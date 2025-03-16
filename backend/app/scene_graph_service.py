import os
import json
import torch
import numpy as np
import matplotlib.pyplot as plt
import networkx as nx
from PIL import Image
import torchvision.transforms as T
from typing import Dict, List, Tuple, Any, Union, Optional
import logging

# Import from your existing code
from ultralytics import YOLO
from math import isclose

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Set random seeds for reproducibility
def set_seeds(seed=42):
    import random

    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False


# Call this at the start
set_seeds(42)

# Configuration
CONFIG = {
    "img_size": 512,
    "model": {
        "backbone": "resnet50",
        "embedding_dim": 512,
        "hidden_dim": 256,
    },
    "yolo": {
        "model": "yolov8n.pt",  # Using the smallest YOLOv8 model for speed
        "conf": 0.25,  # Default confidence threshold
        "iou": 0.45,  # Default IoU threshold for NMS
    },
}


# Vocabulary class
class Vocabulary:
    """Vocabulary for objects, attributes, and relationships in scene graphs."""

    def __init__(self):
        # Initialize dictionaries for mapping between terms and IDs
        self.object2id = {"<unk>": 0}
        self.id2object = {0: "<unk>"}
        self.relationship2id = {"<unk>": 0}
        self.id2relationship = {0: "<unk>"}
        self.attribute2id = {"<unk>": 0}
        self.id2attribute = {0: "<unk>"}

    def get_object_id(self, obj_name: str) -> int:
        return self.object2id.get(obj_name, 0)  # Return <unk> ID if not found

    def get_relationship_id(self, rel_name: str) -> int:
        return self.relationship2id.get(rel_name, 0)  # Return <unk> ID if not found

    def get_attribute_id(self, attr_name: str) -> int:
        return self.attribute2id.get(attr_name, 0)  # Return <unk> ID if not found

    def get_object_name(self, obj_id: int) -> str:
        return self.id2object.get(obj_id, "<unk>")

    def get_relationship_name(self, rel_id: int) -> str:
        return self.id2relationship.get(rel_id, "<unk>")

    def get_attribute_name(self, attr_id: int) -> str:
        return self.id2attribute.get(attr_id, "<unk>")

    @classmethod
    def load(cls, path: str) -> "Vocabulary":
        """Load vocabulary from a JSON file."""
        vocab = cls()

        with open(path, "r") as f:
            data = json.load(f)

        # Load objects
        vocab.object2id = data["objects"]
        vocab.id2object = {
            int(k): v for k, v in {v: k for k, v in vocab.object2id.items()}.items()
        }

        # Load relationships
        vocab.relationship2id = data["relationships"]
        vocab.id2relationship = {
            int(k): v
            for k, v in {v: k for k, v in vocab.relationship2id.items()}.items()
        }

        # Load attributes
        vocab.attribute2id = data["attributes"]
        vocab.id2attribute = {
            int(k): v for k, v in {v: k for k, v in vocab.attribute2id.items()}.items()
        }

        return vocab


# Model Architecture
class VisualFeatureEncoder(torch.nn.Module):
    """Visual feature encoder for scene graph generation."""

    def __init__(
        self,
        backbone_name: str = "resnet50",
        pretrained: bool = False,
    ):
        super().__init__()

        self.backbone_name = backbone_name
        self.backbone, self.out_channels = self._get_backbone(backbone_name, pretrained)

    def _get_backbone(
        self, backbone_name: str, pretrained: bool
    ) -> Tuple[torch.nn.Module, int]:
        """Get backbone network and output channels."""
        if backbone_name == "resnet50":
            from torchvision.models import resnet50

            backbone = resnet50(pretrained=pretrained)
            # Remove the last FC layer
            backbone = torch.nn.Sequential(*list(backbone.children())[:-2])
            out_channels = 2048
        else:
            raise ValueError(f"Unsupported backbone: {backbone_name}")

        return backbone, out_channels

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """Extract features from images."""
        return self.backbone(x)


class RelationshipPredictor(torch.nn.Module):
    """Predicts relationships between object pairs."""

    def __init__(
        self,
        num_obj_classes: int,
        num_rel_classes: int,
        obj_embed_dim: int = 256,
        rel_embed_dim: int = 256,
        hidden_dim: int = 512,
        dropout: float = 0.2,
    ):
        super().__init__()

        # Object embeddings
        self.obj_embedding = torch.nn.Embedding(num_obj_classes, obj_embed_dim)

        # Spatial feature extractor
        self.spatial_fc = torch.nn.Sequential(
            torch.nn.Linear(10, 64),  # 10 = 5 (subject) + 5 (object) spatial features
            torch.nn.ReLU(),
            torch.nn.Dropout(dropout),
            torch.nn.Linear(64, 128),
            torch.nn.ReLU(),
        )

        # Visual feature fusion
        self.visual_fusion = torch.nn.Sequential(
            torch.nn.Linear(obj_embed_dim * 2 + 128, hidden_dim),
            torch.nn.ReLU(),
            torch.nn.Dropout(dropout),
            torch.nn.Linear(hidden_dim, hidden_dim),
            torch.nn.ReLU(),
        )

        # Relationship classifier
        self.rel_classifier = torch.nn.Linear(hidden_dim, num_rel_classes)

    def forward(
        self,
        obj_features: List[torch.Tensor],
        obj_boxes: List[torch.Tensor],
        obj_pairs: List[torch.Tensor],
    ) -> Dict[str, List[torch.Tensor]]:
        """Forward pass for relationship prediction."""
        results = {}
        all_rel_logits = []

        # Process each example in the batch
        for i, (feats, boxes, pairs) in enumerate(
            zip(obj_features, obj_boxes, obj_pairs)
        ):
            if len(pairs) == 0 or boxes.size(0) == 0:
                # No relationships to predict
                all_rel_logits.append(None)
                continue

            # Extract object classes from boxes
            obj_classes = boxes[:, 4].long()
            obj_embeds = self.obj_embedding(obj_classes)

            # Create pairs of object features
            subj_idx = pairs[:, 0].long()
            obj_idx = pairs[:, 1].long()

            subj_feats = obj_embeds[subj_idx]
            obj_feats = obj_embeds[obj_idx]

            # Spatial features
            subj_boxes = boxes[subj_idx, :4]  # [x_c, y_c, w, h]
            obj_boxes = boxes[obj_idx, :4]  # [x_c, y_c, w, h]

            # Compute relative spatial features
            delta_x = subj_boxes[:, 0] - obj_boxes[:, 0]
            delta_y = subj_boxes[:, 1] - obj_boxes[:, 1]

            # Concatenate spatial features
            spatial_feats = torch.cat(
                [subj_boxes, obj_boxes, delta_x.unsqueeze(1), delta_y.unsqueeze(1)],
                dim=1,
            )

            spatial_feats = self.spatial_fc(spatial_feats)

            # Concatenate subject and object features
            subj_obj_feats = torch.cat([subj_feats, obj_feats, spatial_feats], dim=1)

            # Visual fusion
            fused_feats = self.visual_fusion(subj_obj_feats)

            # Predict relationships
            rel_logits = self.rel_classifier(fused_feats)
            all_rel_logits.append(rel_logits)

        results["rel_logits"] = all_rel_logits
        return results


class SceneGraphGenerationModel(torch.nn.Module):
    """Complete scene graph generation model."""

    def __init__(
        self,
        backbone: torch.nn.Module,
        num_obj_classes: int,
        num_rel_classes: int,
        num_attr_classes: int,
        roi_size: int = 7,
        embedding_dim: int = 512,
        hidden_dim: int = 256,
        dropout: float = 0.0,
    ):
        super().__init__()

        self.backbone = backbone
        self.num_obj_classes = num_obj_classes
        self.num_rel_classes = num_rel_classes

        # RoI pooling for object features
        self.roi_size = roi_size
        self.roi_pool = torch.nn.AdaptiveAvgPool2d((roi_size, roi_size))

        # Object feature embedding
        self.obj_feature_embedding = torch.nn.Sequential(
            torch.nn.Linear(backbone.out_channels * roi_size * roi_size, embedding_dim),
            torch.nn.ReLU(),
            torch.nn.Dropout(dropout),
        )

        # Object classifier
        self.obj_classifier = torch.nn.Linear(embedding_dim, num_obj_classes)

        # Attribute classifier
        self.attr_classifier = torch.nn.Linear(embedding_dim, num_attr_classes)

        # Bounding box regressor
        self.bbox_regressor = torch.nn.Linear(embedding_dim, 4)  # [x_c, y_c, w, h]

        # Relationship predictor
        self.relationship_predictor = RelationshipPredictor(
            num_obj_classes=num_obj_classes,
            num_rel_classes=num_rel_classes,
            obj_embed_dim=embedding_dim,
            hidden_dim=hidden_dim,
            dropout=dropout,
        )

    def extract_roi_features(
        self,
        features: torch.Tensor,  # [batch_size, channels, height, width]
        boxes: List[
            torch.Tensor
        ],  # List of [num_boxes, 4] tensors with normalized boxes
    ) -> List[torch.Tensor]:
        """Extract RoI features for objects."""
        batch_size = features.shape[0]
        roi_features = []

        for i in range(batch_size):
            if len(boxes[i]) == 0:
                # No objects in this image
                roi_features.append(
                    torch.empty(
                        0,
                        self.backbone.out_channels * self.roi_size**2,
                        device=features.device,
                    )
                )
                continue

            # Convert normalized [x_c, y_c, w, h] to [x1, y1, x2, y2]
            bbox = boxes[i][:, :4]
            x_c, y_c, w, h = bbox[:, 0], bbox[:, 1], bbox[:, 2], bbox[:, 3]
            x1 = (x_c - w / 2) * features.shape[3]
            y1 = (y_c - h / 2) * features.shape[2]
            x2 = (x_c + w / 2) * features.shape[3]
            y2 = (y_c + h / 2) * features.shape[2]

            # Ensure boxes are within image
            x1 = torch.clamp(x1, 0, features.shape[3] - 1)
            y1 = torch.clamp(y1, 0, features.shape[2] - 1)
            x2 = torch.clamp(x2, 0, features.shape[3] - 1)
            y2 = torch.clamp(y2, 0, features.shape[2] - 1)

            # Create RoI boxes for torchvision's RoIPool
            rois = torch.stack([x1, y1, x2, y2], dim=1)

            # Extract features for each RoI
            obj_features = []
            for roi in rois:
                x1, y1, x2, y2 = map(int, roi.cpu().numpy())
                # Ensure valid box dimensions
                if x2 <= x1 or y2 <= y1:
                    roi_feat = torch.zeros(
                        self.backbone.out_channels,
                        self.roi_size,
                        self.roi_size,
                        device=features.device,
                    )
                else:
                    # Extract feature for this ROI
                    roi_feat = self.roi_pool(
                        features[i, :, y1:y2, x1:x2].unsqueeze(0)
                    ).squeeze(0)

                # Flatten the feature
                roi_feat = roi_feat.view(-1)
                obj_features.append(roi_feat)

            if obj_features:
                obj_features = torch.stack(obj_features)
            else:
                obj_features = torch.empty(
                    0,
                    self.backbone.out_channels * self.roi_size**2,
                    device=features.device,
                )

            roi_features.append(obj_features)

        return roi_features

    def forward(
        self, images: torch.Tensor, boxes: List[torch.Tensor]
    ) -> Dict[str, Any]:
        """Forward pass for scene graph generation."""
        batch_size = images.shape[0]

        # Extract features from backbone
        features = self.backbone(images)

        # Extract RoI features
        roi_features = self.extract_roi_features(features, boxes)

        # Process each example in the batch
        obj_logits_list = []
        attr_logits_list = []
        bbox_pred_list = []
        obj_features_list = []

        for i in range(batch_size):
            if roi_features[i].shape[0] == 0:
                # No objects in this image
                obj_logits_list.append(
                    torch.empty(0, self.num_obj_classes, device=images.device)
                )
                attr_logits_list.append(
                    torch.empty(0, self.num_attr_classes, device=images.device)
                )
                bbox_pred_list.append(torch.empty(0, 4, device=images.device))
                obj_features_list.append(
                    torch.empty(
                        0,
                        self.obj_feature_embedding[0].out_features,
                        device=images.device,
                    )
                )
                continue

            # Embed RoI features
            obj_feats = self.obj_feature_embedding(roi_features[i])
            obj_features_list.append(obj_feats)

            # Predict object classes
            obj_logits = self.obj_classifier(obj_feats)
            obj_logits_list.append(obj_logits)

            # Predict attributes
            attr_logits = self.attr_classifier(obj_feats)
            attr_logits_list.append(attr_logits)

            # Regress bounding box refinements
            bbox_pred = self.bbox_regressor(obj_feats)
            bbox_pred_list.append(bbox_pred)

        # Create object pairs for relationship prediction
        obj_pairs = []
        for i in range(batch_size):
            if boxes[i].shape[0] <= 1:
                # Need at least 2 objects for relationships
                obj_pairs.append(torch.empty(0, 2, device=images.device))
                continue

            # Create all possible object pairs
            num_objs = boxes[i].shape[0]
            subj_idx = torch.arange(num_objs, device=images.device).repeat_interleave(
                num_objs
            )
            obj_idx = torch.arange(num_objs, device=images.device).repeat(num_objs)

            # Exclude self-relationships
            mask = subj_idx != obj_idx
            pairs = torch.stack([subj_idx[mask], obj_idx[mask]], dim=1)
            obj_pairs.append(pairs)

        # Predict relationships
        rel_preds = self.relationship_predictor(obj_features_list, boxes, obj_pairs)

        return {
            "obj_logits": obj_logits_list,
            "attr_logits": attr_logits_list,
            "bbox_pred": bbox_pred_list,
            "rel_logits": rel_preds.get("rel_logits", []),
            "obj_pairs": obj_pairs,
        }


# YOLO-based object detection
def detect_objects_yolo(
    image_path: str,
    vocabulary: Vocabulary,
    device: torch.device,
    use_fixed_boxes: bool = False,
) -> torch.Tensor:
    """
    Detect objects in an image using YOLOv8.

    Args:
        image_path: Path to the input image
        vocabulary: Vocabulary for mapping class names
        device: PyTorch device
        use_fixed_boxes: Whether to use fixed boxes or YOLO detection

    Returns:
        Bounding boxes in format [x_c, y_c, w, h, class_id] (normalized)
    """
    # Load YOLOv8 model - will download if not present
    yolo_model = YOLO(CONFIG["yolo"]["model"])

    # Run inference
    results = yolo_model(image_path)
    detections = results[0]

    # No detections
    if len(detections.boxes) == 0:
        return torch.zeros((0, 5), device=device, dtype=torch.float32)

    # Process detections
    boxes = []

    # Get image dimensions
    img = Image.open(image_path)
    img_width, img_height = img.size

    # YOLO class names (COCO class names)
    yolo_class_names = yolo_model.names

    # Create class name mapping from YOLO to our vocabulary
    class_name_map = {}
    for yolo_id, yolo_name in yolo_class_names.items():
        # Try direct mapping first
        if yolo_name in vocabulary.object2id:
            class_name_map[yolo_id] = vocabulary.get_object_id(yolo_name)
        # Try lowercase
        elif yolo_name.lower() in vocabulary.object2id:
            class_name_map[yolo_id] = vocabulary.get_object_id(yolo_name.lower())
        # Fallback to <unk>
        else:
            class_name_map[yolo_id] = 0  # <unk>

    # Process each detection
    for i in range(len(detections.boxes)):
        box = detections.boxes[i]

        # Get class ID and confidence
        cls_id = int(box.cls.item())
        confidence = box.conf.item()

        # Skip low-confidence detections
        if confidence < CONFIG["yolo"]["conf"]:
            continue

        # Get bounding box in xyxy format (unnormalized)
        x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()

        # Convert to xywh format and normalize
        x_c = ((x1 + x2) / 2) / img_width
        y_c = ((y1 + y2) / 2) / img_height
        w = (x2 - x1) / img_width
        h = (y2 - y1) / img_height

        # Map class ID to vocabulary
        vocab_cls_id = class_name_map.get(cls_id, 0)  # Default to <unk> if not found

        # Add to boxes
        boxes.append([x_c, y_c, w, h, vocab_cls_id])

    # Convert to tensor with explicit float32 dtype
    if boxes:
        return torch.tensor(boxes, device=device, dtype=torch.float32)
    else:
        return torch.zeros((0, 5), device=device, dtype=torch.float32)


# Visualization functions
def visualize_image_with_boxes(
    image: np.ndarray, objects: List[Dict[str, Any]], output_path: str
) -> None:
    """Visualize image with bounding boxes and labels."""
    # Create figure
    plt.figure(figsize=(10, 8))

    # Display image
    plt.imshow(image)

    # Get image dimensions
    img_height, img_width = image.shape[:2]

    # Generate colors for classes
    num_classes = len(objects)
    colors = plt.cm.hsv(np.linspace(0, 1, num_classes))

    # Draw bounding boxes and labels
    for i, obj in enumerate(objects):
        # Get bounding box
        x_c, y_c, w, h = obj["bbox"]

        # Scale to image size if normalized
        if max(x_c, y_c, w, h) <= 1.0:
            x_c *= img_width
            y_c *= img_height
            w *= img_width
            h *= img_height

        # Convert to (x1, y1, x2, y2) format
        x1 = x_c - w / 2
        y1 = y_c - h / 2
        x2 = x_c + w / 2
        y2 = y_c + h / 2

        # Draw bounding box
        rect = plt.Rectangle(
            (x1, y1),
            x2 - x1,
            y2 - y1,
            linewidth=2,
            edgecolor=colors[i % len(colors)],
            facecolor="none",
        )
        plt.gca().add_patch(rect)

        # Draw label
        plt.text(
            x1,
            y1 - 5,
            f"{obj['label']} ({obj['score']:.2f})",
            color=colors[i % len(colors)],
            fontsize=10,
            bbox=dict(facecolor="white", alpha=0.7, edgecolor="none", pad=1),
        )

    # Add a title
    plt.title("Object Detection")
    plt.axis("off")

    # Save the figure
    plt.tight_layout()
    plt.savefig(output_path, dpi=300, bbox_inches="tight")
    plt.close()

    logger.info(f"Annotated image saved to {output_path}")


def visualize_graph(
    objects: List[Dict[str, Any]], relationships: List[Dict[str, Any]], output_path: str
) -> None:
    """Visualize relationship graph."""
    # Create figure
    plt.figure(figsize=(10, 8))

    # Create graph
    G = nx.DiGraph()

    # Add nodes
    for i, obj in enumerate(objects):
        G.add_node(i, label=obj["label"])

    # Add edges
    for rel in relationships:
        subj_idx = rel["subject_id"]
        obj_idx = rel["object_id"]
        G.add_edge(subj_idx, obj_idx, label=rel["predicate"])

    # Position nodes
    pos = nx.spring_layout(G, seed=42)

    # Draw nodes
    nx.draw_networkx_nodes(G, pos, node_size=700, node_color="skyblue", alpha=0.8)

    # Draw node labels
    nx.draw_networkx_labels(G, pos, font_size=10, font_weight="bold")

    # Draw edges
    nx.draw_networkx_edges(G, pos, width=2, alpha=0.7, arrows=True, arrowsize=15)

    # Draw edge labels
    nx.draw_networkx_edge_labels(
        G, pos, edge_labels=nx.get_edge_attributes(G, "label"), font_size=8
    )

    # Add a title
    plt.title("Scene Graph")
    plt.axis("off")

    # Save the figure
    plt.tight_layout()
    plt.savefig(output_path, dpi=300, bbox_inches="tight")
    plt.close()

    logger.info(f"Graph visualization saved to {output_path}")


def process_image(
    image_path: str,
    model_path: str,
    vocabulary_path: str,
    confidence_threshold: float = 0.5,
    use_fixed_boxes: bool = False,
    output_dir: str = "outputs",
    base_filename: str = None,
) -> Tuple[List, List, str, str]:
    """
    Process an image to generate a scene graph.

    Args:
        image_path: Path to the input image
        model_path: Path to the model checkpoint
        vocabulary_path: Path to the vocabulary file
        confidence_threshold: Confidence threshold for relationships
        use_fixed_boxes: Whether to use fixed boxes or YOLO detection
        output_dir: Directory to save outputs
        base_filename: Optional base filename to use instead of the original image name

    Returns:
        Tuple of (objects, relationships, annotated_image_path, graph_path)
    """
    # Check if files exist
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image not found at {image_path}")

    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model not found at {model_path}")

    if not os.path.exists(vocabulary_path):
        raise FileNotFoundError(f"Vocabulary not found at {vocabulary_path}")

    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)

    # Load vocabulary
    vocabulary = Vocabulary.load(vocabulary_path)
    logger.info(
        f"Loaded vocabulary with {len(vocabulary.object2id)} objects and {len(vocabulary.relationship2id)} relationships"
    )

    # Set device
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    logger.info(f"Using device: {device}")

    # Load and preprocess image
    image = Image.open(image_path).convert("RGB")
    img_width, img_height = image.size

    # Use YOLO for object detection
    logger.info("Detecting objects with YOLO...")
    boxes = detect_objects_yolo(image_path, vocabulary, device, use_fixed_boxes)
    logger.info(f"Detected {len(boxes)} objects")

    if len(boxes) == 0:
        raise ValueError("No objects detected. Cannot generate scene graph.")

    # Create encoder
    encoder = VisualFeatureEncoder(backbone_name=CONFIG["model"]["backbone"])

    # Create model
    model = SceneGraphGenerationModel(
        backbone=encoder,
        num_obj_classes=len(vocabulary.object2id),
        num_rel_classes=len(vocabulary.relationship2id),
        num_attr_classes=len(vocabulary.attribute2id),
        embedding_dim=CONFIG["model"]["embedding_dim"],
        hidden_dim=CONFIG["model"]["hidden_dim"],
    )

    # Load model weights
    logger.info(f"Loading model from {model_path}...")
    checkpoint = torch.load(model_path, map_location=device)
    if "model_state_dict" in checkpoint:
        model.load_state_dict(checkpoint["model_state_dict"])
        logger.info("Loaded model state dict from checkpoint")
    else:
        model.load_state_dict(checkpoint)
        logger.info("Loaded direct model state from checkpoint")

    model.to(device)
    model.eval()

    # Preprocess image for scene graph model
    transform = T.Compose(
        [
            T.Resize((CONFIG["img_size"], CONFIG["img_size"])),
            T.ToTensor(),
            T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ]
    )
    img_tensor = transform(image).unsqueeze(0).to(device)

    # Run inference for scene graph generation
    logger.info("Generating scene graph...")
    with torch.no_grad():
        # Forward pass
        outputs = model(img_tensor, [boxes])

        # Process predictions
        obj_logits = outputs["obj_logits"][0]
        obj_probs = torch.softmax(obj_logits, dim=1)
        obj_scores, obj_labels = torch.max(obj_probs, dim=1)

        # Get bounding box predictions
        bbox_pred = outputs["bbox_pred"][0]

        # Create object list
        objects = []
        for i in range(len(obj_labels)):
            bbox = bbox_pred[i].cpu().numpy().tolist()
            label_id = obj_labels[i].item()
            score = obj_scores[i].item()

            objects.append(
                {
                    "label": vocabulary.get_object_name(label_id),
                    "label_id": label_id,
                    "score": score,
                    "bbox": bbox,
                }
            )

        # Process relationships
        relationships = []
        if "rel_logits" in outputs and outputs["rel_logits"]:
            rel_logits = outputs["rel_logits"][0]
            obj_pairs = outputs["obj_pairs"][0]

            if rel_logits is not None and len(rel_logits) > 0:
                rel_probs = torch.softmax(rel_logits, dim=1)
                rel_scores, rel_labels = torch.max(rel_probs, dim=1)

                # Filter by confidence
                rel_mask = rel_scores > confidence_threshold
                rel_labels = rel_labels[rel_mask]
                rel_scores = rel_scores[rel_mask]
                filtered_pairs = obj_pairs[rel_mask]

                # Create relationship list
                for i in range(len(rel_labels)):
                    subj_idx = filtered_pairs[i, 0].item()
                    obj_idx = filtered_pairs[i, 1].item()
                    label_id = rel_labels[i].item()
                    score = rel_scores[i].item()

                    # Map to filtered object indices
                    subj_new_idx = -1
                    obj_new_idx = -1

                    for j, obj in enumerate(objects):
                        if j == subj_idx:
                            subj_new_idx = j
                        if j == obj_idx:
                            obj_new_idx = j

                    if subj_new_idx != -1 and obj_new_idx != -1:
                        relationships.append(
                            {
                                "subject_id": subj_new_idx,
                                "object_id": obj_new_idx,
                                "predicate": vocabulary.get_relationship_name(label_id),
                                "predicate_id": label_id,
                                "score": score,
                                "subject": objects[subj_new_idx]["label"],
                                "object": objects[obj_new_idx]["label"],
                            }
                        )

    # Determine base filename for output files
    if base_filename:
        # Use provided base filename if specified
        file_prefix = base_filename
    else:
        # Otherwise use the original image name
        file_prefix = os.path.splitext(os.path.basename(image_path))[0]

    # Generate output filenames with consistent naming pattern
    annotated_image_path = os.path.join(output_dir, f"{file_prefix}_annotated.png")
    graph_path = os.path.join(output_dir, f"{file_prefix}_graph.png")

    # Log the paths for debugging
    logger.info(f"Using file prefix: {file_prefix}")
    logger.info(f"Saving annotated image to: {annotated_image_path}")
    logger.info(f"Saving graph to: {graph_path}")

    # Save visualizations
    visualize_image_with_boxes(np.array(image), objects, annotated_image_path)
    visualize_graph(objects, relationships, graph_path)

    logger.info(f"Visualization complete. Files saved to:")
    logger.info(f"  - {annotated_image_path}")
    logger.info(f"  - {graph_path}")

    # Convert objects for JSON serialization
    serializable_objects = []
    for obj in objects:
        serializable_objects.append(
            {
                "label": obj["label"],
                "label_id": int(obj["label_id"]),
                "score": float(obj["score"]),
                "bbox": [float(val) for val in obj["bbox"]],
            }
        )

    return serializable_objects, relationships, annotated_image_path, graph_path


if __name__ == "__main__":
    # This can be used for testing the service directly
    image_path = "test.jpg"
    model_path = "app/models/model.pth"
    vocabulary_path = "app/models/vocabulary.json"

    objects, relationships, annotated_path, graph_path = process_image(
        image_path=image_path,
        model_path=model_path,
        vocabulary_path=vocabulary_path,
        confidence_threshold=0.3,
        output_dir="outputs",
    )

    print(f"Processed {len(objects)} objects and {len(relationships)} relationships")
