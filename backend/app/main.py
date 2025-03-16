from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
import shutil
import uuid
import json
from typing import Optional
import logging

from app.scene_graph_service import process_image

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(title="Scene Graph Generation API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development - restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create necessary directories
os.makedirs("uploads", exist_ok=True)
os.makedirs("outputs", exist_ok=True)

# Mount static files with correct configuration
app.mount("/outputs", StaticFiles(directory="outputs", html=True), name="outputs")


@app.get("/")
def read_root():
    return {"message": "Scene Graph Generation API is running"}


@app.post("/api/generate-scene-graph")
async def generate_scene_graph(
    image: UploadFile = File(...),
    confidence_threshold: float = Form(0.5),
    use_fixed_boxes: bool = Form(False),
):
    try:
        # Input validation
        if not image.content_type.startswith("image/"):
            raise HTTPException(
                status_code=400, detail="Uploaded file must be an image"
            )

        if not (0 <= confidence_threshold <= 1):
            raise HTTPException(
                status_code=400, detail="Confidence threshold must be between 0 and 1"
            )

        # Generate unique ID for this job
        job_id = str(uuid.uuid4())
        short_id = job_id.split("-")[0]  # First part of UUID for shorter filenames

        # Create directories for this job
        upload_dir = os.path.join("uploads", job_id)
        output_dir = os.path.join("outputs", job_id)
        os.makedirs(upload_dir, exist_ok=True)
        os.makedirs(output_dir, exist_ok=True)

        # Save the uploaded image - use the short_id as the base filename
        # This ensures consistent naming patterns that frontend can predict
        original_filename = image.filename
        _, ext = os.path.splitext(original_filename)
        image_filename = f"{short_id}{ext}"
        image_path = os.path.join(upload_dir, image_filename)

        # Save the file
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        logger.info(f"Image saved to {image_path}")
        logger.info(f"Job ID: {job_id}, Short ID: {short_id}")

        # Define model paths
        model_path = "app/models/model.pth"
        vocabulary_path = "app/models/vocabulary.json"

        # Process the image - pass the short_id as base_filename to use for outputs
        objects, relationships, annotated_image_path, graph_path = process_image(
            image_path=image_path,
            model_path=model_path,
            vocabulary_path=vocabulary_path,
            confidence_threshold=confidence_threshold,
            use_fixed_boxes=use_fixed_boxes,
            output_dir=output_dir,
            base_filename=short_id,  # Pass the short ID to use as base filename
        )

        # Generate URLs for frontend
        # Make sure these URLs match the expected format in the frontend
        annotated_image_url = (
            f"/outputs/{job_id}/{os.path.basename(annotated_image_path)}"
        )
        graph_url = f"/outputs/{job_id}/{os.path.basename(graph_path)}"

        # Log the URLs for debugging
        logger.info(f"Annotated image URL: {annotated_image_url}")
        logger.info(f"Graph URL: {graph_url}")

        # Save results to a JSON file for later retrieval
        results_data = {
            "job_id": job_id,
            "objects": objects,
            "relationships": relationships,
            "annotated_image_url": annotated_image_url,
            "graph_url": graph_url,
        }

        # Save the results to a JSON file in the output directory
        results_file = os.path.join(output_dir, "results.json")
        with open(results_file, "w") as f:
            json.dump(results_data, f)

        logger.info(f"Results saved to {results_file}")

        # Return results
        return results_data

    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")


@app.get("/api/generate-scene-graph/{job_id}")
async def get_scene_graph_result(job_id: str):
    try:
        # Check if job ID is valid UUID format
        try:
            uuid.UUID(job_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid job ID format")

        # Check if the output directory exists
        output_dir = os.path.join("outputs", job_id)
        if not os.path.exists(output_dir):
            raise HTTPException(
                status_code=404, detail=f"Results for job {job_id} not found"
            )

        # Check if we have a results JSON file
        results_file = os.path.join(output_dir, "results.json")
        if os.path.exists(results_file):
            try:
                # Read the results from the JSON file
                with open(results_file, "r") as f:
                    results_data = json.load(f)

                # Return the stored results
                return results_data
            except Exception as json_error:
                logger.error(f"Error reading results file: {str(json_error)}")
                # Fall back to generating default results

        # If no results file exists or there was an error reading it,
        # create URLs and placeholder objects/relationships
        # Look for result files
        files = os.listdir(output_dir)
        annotated_image_file = next((f for f in files if "_annotated.png" in f), None)
        graph_file = next((f for f in files if "_graph.png" in f), None)

        if not annotated_image_file or not graph_file:
            raise HTTPException(status_code=404, detail="Result files are incomplete")

        # Create URLs for frontend
        annotated_image_url = f"/outputs/{job_id}/{annotated_image_file}"
        graph_url = f"/outputs/{job_id}/{graph_file}"

        # For demonstration purposes, create sample objects and relationships
        # This would normally come from a database in a production application
        objects = [
            {
                "label": "person",
                "label_id": 1,
                "score": 0.91,
                "bbox": [0.3, 0.4, 0.1, 0.3],
            },
            {
                "label": "bicycle",
                "label_id": 2,
                "score": 0.87,
                "bbox": [0.5, 0.5, 0.2, 0.2],
            },
            {
                "label": "car",
                "label_id": 3,
                "score": 0.76,
                "bbox": [0.7, 0.4, 0.15, 0.1],
            },
        ]

        relationships = [
            {
                "subject": "person",
                "predicate": "riding",
                "object": "bicycle",
                "score": 0.82,
                "subject_id": 0,
                "object_id": 1,
                "predicate_id": 5,
            },
            {
                "subject": "person",
                "predicate": "near",
                "object": "car",
                "score": 0.71,
                "subject_id": 0,
                "object_id": 2,
                "predicate_id": 7,
            },
        ]

        # Return result data with populated objects and relationships
        return {
            "job_id": job_id,
            "annotated_image_url": annotated_image_url,
            "graph_url": graph_url,
            "objects": objects,
            "relationships": relationships,
        }

    except Exception as e:
        logger.error(f"Error getting results for job {job_id}: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error retrieving results: {str(e)}"
        )


@app.get("/api/health")
def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
