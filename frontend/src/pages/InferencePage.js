import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  Slider,
  FormControlLabel,
  Switch,
  Grid,
  Card,
  CardContent,
  Alert,
  Fade,
  Stack,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SettingsIcon from "@mui/icons-material/Settings";
import SendIcon from "@mui/icons-material/Send";
import LoadingAnimation from "../components/LoadingAnimation";

// Styled components
const UploadBox = styled(Box)(
  ({ theme, isDragActive, isDragReject, imagePreview }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(6),
    borderWidth: 2,
    borderRadius: theme.shape.borderRadius,
    borderColor: isDragReject
      ? theme.palette.error.main
      : isDragActive
      ? theme.palette.primary.main
      : theme.palette.divider,
    borderStyle: "dashed",
    backgroundColor: isDragActive
      ? theme.palette.action.hover
      : theme.palette.background.paper,
    color: theme.palette.text.secondary,
    outline: "none",
    transition: "border .24s ease-in-out",
    cursor: "pointer",
    backgroundImage: imagePreview ? `url(${imagePreview})` : "none",
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    position: "relative",
    minHeight: 240,
    "&:hover": {
      borderColor: theme.palette.primary.main,
    },
  })
);

const InferencePage = () => {
  const navigate = useNavigate();

  // State for file upload
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [fileError, setFileError] = useState("");

  // State for inference options
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.5);
  const [useFixedBoxes, setUseFixedBoxes] = useState(false);

  // State for API call
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle file drop
  const onDrop = useCallback((acceptedFiles) => {
    setFileError("");

    if (acceptedFiles.length === 0) {
      return;
    }

    const selectedFile = acceptedFiles[0];

    // Check if file is an image
    if (!selectedFile.type.startsWith("image/")) {
      setFileError("Please upload an image file");
      return;
    }

    // Check file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setFileError("File size should be less than 10MB");
      return;
    }

    // Set file and create preview
    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    setImagePreview(objectUrl);

    // Clean up the preview URL when component unmounts
    return () => URL.revokeObjectURL(objectUrl);
  }, []);

  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "image/*": [".jpeg", ".jpg", ".png"],
      },
      maxFiles: 1,
    });

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setFileError("Please upload an image");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Create form data
      const formData = new FormData();
      formData.append("image", file);
      formData.append("confidence_threshold", confidenceThreshold);
      formData.append("use_fixed_boxes", useFixedBoxes);

      // Make API call
      const response = await axios.post("/api/generate-scene-graph", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Navigate to results page with the job ID
      navigate(`/results/${response.data.job_id}`);
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err.response?.data?.detail || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle confidence threshold change
  const handleConfidenceChange = (event, newValue) => {
    setConfidenceThreshold(newValue);
  };

  // Handle switch change
  const handleFixedBoxesChange = (event) => {
    setUseFixedBoxes(event.target.checked);
  };

  return (
    <Box>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        sx={{ mb: 4, fontWeight: 600 }}
      >
        Scene Graph Inference
      </Typography>

      {isLoading ? (
        <LoadingAnimation message="Generating scene graph..." />
      ) : (
        <Grid container spacing={4}>
          {/* Left column - Upload section */}
          <Grid item xs={12} md={7}>
            <Card
              elevation={0}
              sx={{
                height: "100%",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Upload Image
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Upload an image to analyze objects and their relationships in
                  the scene.
                </Typography>

                <Divider sx={{ my: 2 }} />

                <form onSubmit={handleSubmit}>
                  <UploadBox
                    {...getRootProps()}
                    isDragActive={isDragActive}
                    isDragReject={isDragReject}
                    imagePreview={imagePreview}
                  >
                    <input {...getInputProps()} />

                    {imagePreview ? (
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          p: 1,
                          bgcolor: "rgba(0, 0, 0, 0.5)",
                          color: "white",
                          textAlign: "center",
                        }}
                      >
                        <Typography variant="body2">
                          {file?.name} (
                          {(file?.size / (1024 * 1024)).toFixed(2)} MB)
                        </Typography>
                        <Typography variant="caption">
                          Click or drag to replace
                        </Typography>
                      </Box>
                    ) : (
                      <>
                        <CloudUploadIcon
                          sx={{ fontSize: 48, mb: 2, color: "primary.main" }}
                        />
                        <Typography variant="body1" gutterBottom>
                          Drag & drop an image here, or click to select
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Supported formats: JPEG, PNG, WebP
                        </Typography>
                      </>
                    )}
                  </UploadBox>

                  {fileError && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {fileError}
                    </Alert>
                  )}

                  <Box
                    sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      type="submit"
                      disabled={!file || isLoading}
                      endIcon={<SendIcon />}
                    >
                      Generate Scene Graph
                    </Button>
                  </Box>
                </form>
              </CardContent>
            </Card>
          </Grid>

          {/* Right column - Settings */}
          <Grid item xs={12} md={5}>
            <Card
              elevation={0}
              sx={{
                height: "100%",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <SettingsIcon sx={{ mr: 1, color: "text.secondary" }} />
                  <Typography variant="h6">Inference Settings</Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" paragraph>
                  Adjust parameters to control the scene graph generation
                  process.
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Stack spacing={4} sx={{ mt: 3 }}>
                  {/* Confidence Threshold Slider */}
                  <Box>
                    <Typography id="confidence-slider" gutterBottom>
                      Confidence Threshold: {confidenceThreshold.toFixed(2)}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Higher values result in fewer but more confident
                      predictions.
                    </Typography>
                    <Slider
                      value={confidenceThreshold}
                      onChange={handleConfidenceChange}
                      aria-labelledby="confidence-slider"
                      valueLabelDisplay="auto"
                      step={0.01}
                      marks={[
                        { value: 0, label: "0" },
                        { value: 0.25, label: "0.25" },
                        { value: 0.5, label: "0.5" },
                        { value: 0.75, label: "0.75" },
                        { value: 1, label: "1" },
                      ]}
                      min={0}
                      max={1}
                    />
                  </Box>

                  {/* Use Fixed Boxes Switch */}
                  <Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={useFixedBoxes}
                          onChange={handleFixedBoxesChange}
                          name="useFixedBoxes"
                          color="primary"
                        />
                      }
                      label="Use fixed bounding boxes"
                    />
                    <Typography variant="body2" color="text.secondary">
                      When enabled, uses predefined boxes instead of YOLO
                      detection.
                    </Typography>
                  </Box>

                  {/* Predefined Paths (for reference, not editable) */}
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Model Information
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: "grey.50" }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Model Path:</strong> app/models/model.pth
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Vocabulary Path:</strong>{" "}
                        app/models/vocabulary.json
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Output Path:</strong> outputs/{"{job_id}"}
                      </Typography>
                    </Paper>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Error message */}
      <Fade in={!!error}>
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      </Fade>
    </Box>
  );
};

export default InferencePage;
