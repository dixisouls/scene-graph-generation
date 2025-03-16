# Scene Graph Generation - Frontend

The frontend component of the Scene Graph Generation project, built with React
and Material-UI. This application provides an intuitive user interface for
uploading images, viewing the detected objects, and exploring the generated
scene graphs.

## Features

- **Modern UI**: Clean, responsive design using Material-UI components
- **Image Upload**: Drag-and-drop interface for image uploading
- **Inference Configuration**: Adjustable settings for scene graph generation
- **Results Visualization**: Interactive display of annotated images and scene
  graphs
- **Confidence Visualization**: Visual representation of object and relationship
  confidence scores
- **Full-Screen View**: Modal view for detailed examination of results
- **Download Options**: Easy download of generated visualizations

## Directory Structure

```
frontend/
├── public/
│   └── ...                     # Public assets
├── src/
│   ├── components/             # React components
│   │   ├── ConfidenceBar.js    # Confidence visualization component
│   │   ├── Footer.js           # Footer component
│   │   ├── LoadingAnimation.js # Loading animation component
│   │   └── Navbar.js           # Navigation bar component
│   ├── pages/                  # Page layouts
│   │   ├── InferencePage.js    # Image upload and processing page
│   │   ├── LandingPage.js      # Home page with project information
│   │   ├── NotFoundPage.js     # 404 page
│   │   └── ResultsPage.js      # Results display page
│   ├── App.js                  # Main component
│   ├── index.js                # Entry point
│   └── ...                     # Other React files
├── package.json                # Node.js dependencies
└── ...                         # Other config files
```

## Setup Instructions

### Prerequisites

- Node.js 14.x or higher
- npm or yarn package manager

### Installation

1. Install the required dependencies:

   ```bash
   npm install
   # or with yarn
   yarn install
   ```

2. Configure the proxy for API requests:
   - The application is pre-configured to proxy API requests to
     `http://localhost:8000`
   - If your backend runs on a different port, update the `proxy` field in
     `package.json`

### Running the Application

1. Start the development server:

   ```bash
   npm start
   # or with yarn
   yarn start
   ```

2. The application will open in your default browser at http://localhost:3000

### Building for Production

To create a production build:

```bash
npm run build
# or with yarn
yarn build
```

The build artifacts will be stored in the `build/` directory and can be served
by any static file server.

## User Guide

### Home Page

The landing page provides an overview of what scene graph generation is and how
the application works. It includes:

- Introduction to scene graphs
- Diagram of the model architecture
- Sample visualizations
- Quick start button to begin using the application

### Inference Page

This is where you can upload and process images:

1. **Upload an Image**:

   - Either drag and drop an image into the upload area or click to select a
     file
   - Supported formats: JPEG, PNG, WebP

2. **Configure Settings**:

   - Adjust the confidence threshold slider (0.0 to 1.0)
   - Toggle the "Use fixed bounding boxes" option if needed

3. **Generate Scene Graph**:
   - Click the "Generate Scene Graph" button to process the image
   - A loading animation will display while processing

### Results Page

The results page has three tabs:

1. **Scene Analysis**:

   - Overview of both the annotated image and scene graph
   - Summary statistics (object count, average confidence, etc.)
   - Confidence bars for detected objects and relationships

2. **Object Detection**:

   - Detailed view of the annotated image with bounding boxes
   - List of detected objects with confidence scores

3. **Scene Graph**:
   - Visual representation of the scene graph
   - List of relationships with confidence scores
   - Textual descriptions of relationships

## Customization

### Styling

The application uses Material-UI's theming system. To customize colors,
typography, etc.:

1. Edit the theme configuration in `src/index.js`
2. Refer to the
   [Material-UI documentation](https://mui.com/customization/theming/) for
   detailed guidance

### Adding New Components

To add new components:

1. Create a new file in the `src/components/` directory
2. Import and use the component in the appropriate page

## Troubleshooting

**Common Issues:**

1. **API Connection Errors**:

   - Ensure the backend server is running
   - Check that the proxy configuration in `package.json` matches your backend
     URL

2. **Image Upload Issues**:

   - Verify the image format is supported
   - Check that the image size is under the maximum allowed (typically 10MB)

3. **Rendering Problems**:
   - Clear your browser cache
   - Update to the latest version of your browser

## Development

To contribute to the frontend:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
