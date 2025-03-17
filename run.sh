#!/bin/bash

# Colors for documentation
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Backend startup
echo -e "${GREEN}Starting backend server...${NC}"

# Navigate to backend directory
cd backend || { echo -e "\033[0;31mBackend directory not found${NC}"; exit 1; }

# Activate virtual environment
echo -e "${CYAN}Activating virtual environment...${NC}"
source venv/bin/activate

# Start the backend server
echo -e "${GREEN}Starting Python backend application...${NC}"
python start.py &

# Store backend process ID
BACKEND_PID=$!

# Give the backend some time to start
sleep 2

# Frontend startup
echo -e "${GREEN}Starting frontend application...${NC}"

# Navigate to frontend directory
cd ../frontend || { echo -e "\033[0;31mFrontend directory not found${NC}"; exit 1; }

# Start frontend
echo -e "${GREEN}Starting npm...${NC}"
npm start

# Cleanup function to ensure backend process is terminated when script is interrupted
cleanup() {
    echo -e "${CYAN}Shutting down services...${NC}"
    kill $BACKEND_PID
    exit 0
}

# Set up trap to call cleanup when script receives SIGINT
trap cleanup SIGINT

# Wait for npm start to finish
wait