# Scene Graph Generation - Backend

The backend component of the Scene Graph Generation project, built with FastAPI
and PyTorch. This service processes images to detect objects and their
relationships, generating structured scene graphs.

## Architecture

The backend consists of the following components:

- **FastAPI Application**: RESTful API for image upload and processing
- **Scene Graph Model**: PyTorch model for predicting relationships between
  objects
- **YOLOv8 Integration**: For object detection
- **Visualization Module**: For creating annotated images and graph
  visualizations

## Directory Structure

```
backend/
├── app/
│   ├── main.py                 # FastAPI application
│   ├── scene_graph_service.py  # Core service implementation
│   ├── models/                 # Directory for model files
│   │   ├── model.pth           # Trained PyTorch model (not included in repo)
│   │   └── vocabulary.json     # Object and relationship vocabulary
├── uploads/                    # Temporary storage for uploaded images
├── outputs/                    # Output directory for processed images
├── requirements.txt            # Python dependencies
└── start.py                    # Startup script
```

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- Pip package manager
- Virtual environment (recommended)

### Installation

1. Create and activate a virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install the required dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Download the model file:
   - Download the `model.pth` file from [Model Download Link]
   - Place it in the `app/models/` directory

### Running the Server

1. Start the FastAPI server:

   ```bash
   python start.py
   ```

2. The server will run at http://localhost:8000
   - API documentation is available at http://localhost:8000/docs

## API Endpoints

### POST /api/generate-scene-graph

Processes an uploaded image and generates a scene graph.

**Request**:

- Form data with the following fields:
  - `image`: Image file (JPEG, PNG)
  - `confidence_threshold`: Float between 0 and 1 (default: 0.5)
  - `use_fixed_boxes`: Boolean (default: false)

**Response**:

```json
{
  "job_id": "unique-job-id",
  "objects": [
    {
      "label": "person",
      "label_id": 1,
      "score": 0.91,
      "bbox": [0.3, 0.4, 0.1, 0.3]
    },
    ...
  ],
  "relationships": [
    {
      "subject": "person",
      "predicate": "riding",
      "object": "bicycle",
      "score": 0.82,
      "subject_id": 0,
      "object_id": 1,
      "predicate_id": 5
    },
    ...
  ],
  "annotated_image_url": "/outputs/job-id/image_annotated.png",
  "graph_url": "/outputs/job-id/image_graph.png"
}
```

### GET /api/generate-scene-graph/{job_id}

Retrieves the results for a previously processed image.

**Response**: Same as the POST endpoint

## Model Architecture

The scene graph generation model consists of:

1. **Object Detection**: Using YOLOv8 for accurate object detection
2. **Feature Extraction**: A ResNet50 backbone extracts visual features
3. **Relationship Prediction**: A neural network predicts relationship types
   between object pairs
4. **Graph Construction**: Objects and relationships are assembled into a
   structured graph

## Troubleshooting

**Common Issues:**

1. **Model File Missing**:

   - Ensure `model.pth` is placed in the `app/models/` directory

2. **Dependency Errors**:

   - Make sure PyTorch is installed with the correct CUDA version for your
     system

3. **Permission Denied**:

   - Ensure the application has write permissions to the `uploads/` and
     `outputs/` directories

4. **Memory Issues**:
   - Processing large images may require significant memory; consider reducing
     image size before upload

## Development

To contribute to the backend:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
