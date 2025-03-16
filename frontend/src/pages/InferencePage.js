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
  Container,
  useTheme,
  CardHeader,
  Tooltip,
  IconButton,
  Collapse,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import SendIcon from "@mui/icons-material/Send";
import TuneIcon from "@mui/icons-material/Tune";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import LoadingAnimation from "../components/LoadingAnimation";
import FileUploader from "../components/FileUploader";
import { motion } from "framer-motion";

// Styled expand button for settings
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

const InferencePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  // State for file upload
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");

  // State for inference options
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.5);
  const [useFixedBoxes, setUseFixedBoxes] = useState(false);

  // State for API call
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // State for settings expansion
  const [expandedSettings, setExpandedSettings] = useState(true);

  // Handle file selection
  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setFileError("");
  };

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

  // Toggle settings expansion
  const handleExpandSettings = () => {
    setExpandedSettings(!expandedSettings);
  };

  return (
    <Container maxWidth="lg">
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h4"
          component="h1"
          align="center"
          gutterBottom
          sx={{
            mb: 1,
            fontWeight: 700,
            background: "linear-gradient(135deg, #3f51b5 10%, #5c6bc0 90%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            display: "inline-block",
          }}
        >
          Scene Graph Generator
        </Typography>

        <Typography
          variant="subtitle1"
          color="text.secondary"
          align="center"
          sx={{ mb: 5, maxWidth: 700, mx: "auto" }}
        >
          Upload an image to analyze objects and their relationships, and
          generate a structured scene graph representation.
        </Typography>
      </MotionBox>

      {isLoading ? (
        <LoadingAnimation
          message="Generating scene graph..."
          subMessage="Our model is analyzing your image and identifying objects and relationships. This may take up to 30 seconds."
        />
      ) : (
        <Grid container spacing={4}>
          {/* Left column - Upload section */}
          <Grid item xs={12} md={7}>
            <MotionPaper
              elevation={1}
              sx={{
                height: "100%",
                borderRadius: 3,
                overflow: "hidden",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <CardHeader
                title="Upload Image"
                subheader="Upload an image to analyze objects and their relationships in the scene"
                sx={{
                  bgcolor: "background.default",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              />

              <CardContent sx={{ p: 3 }}>
                <form onSubmit={handleSubmit}>
                  <FileUploader onFileSelect={handleFileSelect} />

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
                      sx={{
                        fontWeight: 600,
                        px: 3,
                        py: 1.2,
                      }}
                    >
                      Generate Scene Graph
                    </Button>
                  </Box>
                </form>
              </CardContent>
            </MotionPaper>
          </Grid>

          {/* Right column - Settings */}
          <Grid item xs={12} md={5}>
            <MotionPaper
              elevation={1}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <CardHeader
                title={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <TuneIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="h6">Inference Settings</Typography>
                  </Box>
                }
                action={
                  <ExpandMore
                    expand={expandedSettings}
                    onClick={handleExpandSettings}
                    aria-expanded={expandedSettings}
                    aria-label="show more"
                  >
                    <ExpandMoreIcon />
                  </ExpandMore>
                }
                sx={{
                  bgcolor: "background.default",
                  borderBottom: expandedSettings ? "1px solid" : "none",
                  borderColor: "divider",
                }}
              />

              <Collapse in={expandedSettings} timeout="auto" unmountOnExit>
                <CardContent sx={{ p: 3, pb: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Adjust parameters to control the scene graph generation
                    process.
                  </Typography>

                  <Stack spacing={3} sx={{ mt: 2 }}>
                    {/* Confidence Threshold Slider */}
                    <Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <Typography id="confidence-slider" fontWeight={500}>
                          Confidence Threshold: {confidenceThreshold.toFixed(2)}
                        </Typography>
                        <Tooltip title="Higher values result in fewer but more confident predictions. Lower values include more objects and relationships but may be less accurate.">
                          <IconButton
                            size="small"
                            sx={{ ml: 1, color: "text.secondary" }}
                          >
                            <HelpOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>

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
                        sx={{
                          "& .MuiSlider-thumb": {
                            height: 24,
                            width: 24,
                            backgroundColor: "#fff",
                            border: "2px solid currentColor",
                            "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible":
                              {
                                boxShadow: "0 0 0 8px rgba(63, 81, 181, 0.16)",
                              },
                          },
                          "& .MuiSlider-valueLabel": {
                            backgroundColor: theme.palette.primary.main,
                          },
                        }}
                      />

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: 1,
                          color: "text.secondary",
                          fontSize: "0.75rem",
                        }}
                      >
                        <span>More objects & relationships</span>
                        <span>Higher accuracy</span>
                      </Box>
                    </Box>

                    {/* Use Fixed Boxes Switch */}
                    <Box sx={{ mb: 0 }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
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
                        <Tooltip title="When enabled, uses predefined boxes instead of dynamic YOLO detection. Useful for debugging or for consistent results.">
                          <IconButton
                            size="small"
                            sx={{ color: "text.secondary" }}
                          >
                            <HelpOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Stack>
                </CardContent>
              </Collapse>
            </MotionPaper>
          </Grid>
        </Grid>
      )}

      {/* Error message */}
      <Fade in={!!error}>
        <Alert
          severity="error"
          sx={{
            mt: 3,
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          {error}
        </Alert>
      </Fade>
    </Container>
  );
};

export default InferencePage;
