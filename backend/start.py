import uvicorn
import os
import sys

if __name__ == "__main__":
    # Create necessary directories
    os.makedirs("app/models", exist_ok=True)
    os.makedirs("uploads", exist_ok=True)
    os.makedirs("outputs", exist_ok=True)
    
    # Set the working directory to the script's location
    current_dir = os.path.dirname(os.path.realpath(__file__))
    os.chdir(current_dir)
    
    # Start the FastAPI server
    # Use "app.main:app" instead of "app.main:app" to ensure proper module resolution
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)