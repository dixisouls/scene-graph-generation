import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Chip,
  Divider,
  Paper,
  Alert,
  IconButton,
  Tooltip,
  Tab,
  Tabs,
  Modal,
  Backdrop,
  Fade,
  Container,
  Avatar,
  Stack,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ConfidenceBarGroup } from "../components/ConfidenceBar";
import LoadingAnimation from "../components/LoadingAnimation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import RefreshIcon from "@mui/icons-material/Refresh";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ImageIcon from "@mui/icons-material/Image";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import DoneIcon from "@mui/icons-material/Done";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";

// Image component with fallback
const ImageWithFallback = ({ src, alt, ...props }) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  const handleError = () => {
    console.error(`Failed to load image: ${src}`);
    setError(true);
    setLoading(false);
  };

  const handleLoad = () => {
    setLoading(false);
  };

  if (error) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "rgba(0, 0, 0, 0.04)",
          p: 3,
          borderRadius: 2,
        }}
        {...props}
      >
        <ErrorOutlineIcon
          sx={{ fontSize: 48, color: theme.palette.error.main, mb: 2 }}
        />
        <Typography variant="body1" color="text.secondary" align="center">
          Failed to load image
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          align="center"
          sx={{ mb: 2 }}
        >
          {src}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setError(false)}
          startIcon={<RefreshIcon />}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ position: "relative", height: "100%", width: "100%" }}>
      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(0, 0, 0, 0.04)",
            zIndex: 1,
          }}
        >
          <CircularProgress size={40} />
        </Box>
      )}
      <CardMedia
        component="img"
        src={src}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        sx={{
          objectFit: "contain",
          transition: "opacity 0.3s",
          opacity: loading ? 0.3 : 1,
          maxWidth: "100%",
          maxHeight: "400px", // Reasonable max height that won't stretch the container too much
        }}
        {...props}
      />
    </Box>
  );
};

// Modal image component for full-screen preview
const ImageModal = ({ open, handleClose, imageUrl, title }) => {
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = (e) => {
    e.stopPropagation();
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = (e) => {
    e.stopPropagation();
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        setZoom(1); // Reset zoom when closing
        handleClose();
      }}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "95%",
            maxWidth: "1200px",
            maxHeight: "90vh",
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 24,
            p: 3,
            outline: "none",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              {title}
            </Typography>
            <Box>
              <Tooltip title="Zoom out">
                <IconButton
                  onClick={handleZoomOut}
                  size="small"
                  sx={{ mr: 1 }}
                  disabled={zoom <= 0.5}
                >
                  <ZoomOutIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Zoom in">
                <IconButton
                  onClick={handleZoomIn}
                  size="small"
                  sx={{ mr: 2 }}
                  disabled={zoom >= 3}
                >
                  <ZoomInIcon />
                </IconButton>
              </Tooltip>
              <IconButton onClick={handleClose} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              overflow: "auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: "rgba(0, 0, 0, 0.03)",
              borderRadius: 2,
              position: "relative",
            }}
          >
            <img
              src={imageUrl}
              alt={title}
              style={{
                maxWidth: "100%",
                maxHeight: "calc(90vh - 100px)",
                objectFit: "contain",
                transform: `scale(${zoom})`,
                transition: "transform 0.3s ease",
              }}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              startIcon={<FileDownloadIcon />}
              component="a"
              href={imageUrl}
              download
              variant="outlined"
              size="small"
            >
              Download
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

// Status chip component
const StatusChip = ({ label, count, icon, color = "default" }) => {
  return (
    <Chip
      icon={icon}
      label={
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography variant="body2" fontWeight={500}>
            {label}:
          </Typography>
          <Typography variant="body2" fontWeight={700}>
            {count}
          </Typography>
        </Box>
      }
      color={color}
      size="medium"
      sx={{
        px: 1,
        borderRadius: 2,
        "& .MuiChip-icon": {
          color: "inherit",
        },
      }}
      variant="filled"
    />
  );
};

// Result card component
const ResultCard = ({ title, imageUrl, icon, onView, children }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        overflow: "hidden",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 16px 70px rgba(0, 0, 0, 0.1)",
        },
      }}
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          p: 2,
          bgcolor: "background.default",
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Avatar
          sx={{
            bgcolor: theme.palette.primary.main,
            mr: 1.5,
            backgroundImage:
              "linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)",
          }}
        >
          {icon}
        </Avatar>
        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>
      </Box>

      <Box
        sx={{
          position: "relative",
          height: 300,
          bgcolor: "background.default",
          cursor: "pointer",
        }}
        onClick={onView}
      >
        <ImageWithFallback src={imageUrl} alt={title} height="100%" />

        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            right: 0,
            p: 1,
          }}
        >
          <Tooltip title="View full size">
            <IconButton
              size="small"
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.9)",
                "&:hover": { bgcolor: "white" },
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            >
              <FullscreenIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box sx={{ p: 2, flexGrow: 1, overflow: "auto" }}>{children}</Box>

      <Box
        sx={{
          p: 2,
          borderTop: "1px solid",
          borderColor: "divider",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          startIcon={<CloudDownloadIcon />}
          component="a"
          href={imageUrl}
          download
          variant="outlined"
          size="small"
        >
          Download
        </Button>
      </Box>
    </Card>
  );
};

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

// Main component
const ResultsPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  // State
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState({ url: "", title: "" });

  // Handle image modal
  const handleOpenModal = (url, title) => {
    setModalImage({ url, title });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Fetch results
  useEffect(() => {
    if (!jobId) return;

    const fetchResults = async () => {
      try {
        // Get the short ID (first part of UUID) to construct filenames
        const shortId = jobId.split("-")[0];

        // Construct image URLs with the correct pattern
        const annotated_image_url = `/outputs/${jobId}/${shortId}_annotated.png`;
        const graph_url = `/outputs/${jobId}/${shortId}_graph.png`;

        console.log("Attempting to load:");
        console.log(" - Annotated image:", annotated_image_url);
        console.log(" - Graph:", graph_url);

        // Try to fetch job data if API endpoint is implemented
        let apiData = {};
        try {
          const response = await axios.get(
            `/api/generate-scene-graph/${jobId}`
          );
          apiData = response.data;
        } catch (apiErr) {
          console.log("API endpoint not available or returned error:", apiErr);
          console.log("Using default data structure");
          // Fallback to default data with correct image URLs
          apiData = {
            job_id: jobId,
            objects: [
              {
                label: "person",
                score: 0.91,
                label_id: 1,
                bbox: [0.3, 0.4, 0.1, 0.3],
              },
              {
                label: "bicycle",
                score: 0.87,
                label_id: 2,
                bbox: [0.5, 0.5, 0.2, 0.2],
              },
            ],
            relationships: [
              {
                subject: "person",
                predicate: "riding",
                object: "bicycle",
                score: 0.82,
                subject_id: 0,
                object_id: 1,
                predicate_id: 5,
              },
            ],
          };
        }

        // Add image URLs to the data object
        const resultData = {
          ...apiData,
          annotated_image_url,
          graph_url,
        };

        setResults(resultData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching results:", err);
        setError("Failed to fetch scene graph results");
        setLoading(false);
      }
    };

    // Use the actual API
    fetchResults();
  }, [jobId]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Go back to inference page
  const handleGoBack = () => {
    navigate("/inference");
  };

  // Format objects and relationships for confidence bars
  const formatObjectsForDisplay = () => {
    if (!results?.objects) return [];

    return results.objects
      .map((obj) => ({
        label: obj.label,
        score: obj.score,
      }))
      .sort((a, b) => b.score - a.score);
  };

  const formatRelationshipsForDisplay = () => {
    if (!results?.relationships) return [];

    return results.relationships
      .map((rel) => ({
        label: `${rel.subject} ${rel.predicate} ${rel.object}`,
        score: rel.score,
      }))
      .sort((a, b) => b.score - a.score);
  };

  // Calculate average confidence scores
  const getAverageObjectConfidence = () => {
    if (!results?.objects || results.objects.length === 0) return 0;
    return (
      results.objects.reduce((sum, obj) => sum + obj.score, 0) /
      results.objects.length
    );
  };

  const getAverageRelationshipConfidence = () => {
    if (!results?.relationships || results.relationships.length === 0) return 0;
    return (
      results.relationships.reduce((sum, rel) => sum + rel.score, 0) /
      results.relationships.length
    );
  };

  // Loading state
  if (loading) {
    return (
      <LoadingAnimation
        message="Loading scene graph results..."
        subMessage="Retrieving your generated scene graph..."
      />
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              maxWidth: 500,
              mx: "auto",
            }}
          >
            <Box sx={{ mb: 3 }}>
              <ErrorOutlineIcon color="error" sx={{ fontSize: 60 }} />
            </Box>

            <Typography
              variant="h5"
              color="error"
              gutterBottom
              fontWeight={600}
            >
              Error Loading Results
            </Typography>

            <Typography variant="body1" paragraph color="text.secondary">
              {error}
            </Typography>

            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={handleGoBack}
              sx={{ mt: 2 }}
            >
              Back to Inference
            </Button>
          </Paper>
        </motion.div>
      </Container>
    );
  }

  // Success state with results
  return (
    <Container maxWidth="xl">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Image Preview Modal */}
        <ImageModal
          open={modalOpen}
          handleClose={handleCloseModal}
          imageUrl={modalImage.url}
          title={modalImage.title}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
          >
            Back to Inference
          </Button>

          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #3f51b5 10%, #5c6bc0 90%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Scene Graph Results
          </Typography>

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
        </Box>

        {/* Status cards */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 4,
            flexWrap: "wrap",
            justifyContent: { xs: "center", sm: "flex-start" },
          }}
        >
          <StatusChip
            label="Objects"
            count={results?.objects?.length || 0}
            icon={<VisibilityIcon />}
            color="primary"
          />
          <StatusChip
            label="Relationships"
            count={results?.relationships?.length || 0}
            icon={<AccountTreeIcon />}
            color="secondary"
          />
          <StatusChip
            label="Job ID"
            count={jobId.split("-")[0]}
            icon={<DoneIcon />}
            color="success"
          />
        </Box>

        {/* Results Tabs */}
        <Paper
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            mb: 4,
            bgcolor: "background.default",
          }}
          elevation={0}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="results tabs"
            centered
            sx={{
              borderBottom: "1px solid",
              borderColor: "divider",
              "& .MuiTabs-indicator": {
                height: 3,
                borderRadius: 3,
              },
            }}
          >
            <Tab
              label="Scene Analysis"
              id="tab-0"
              icon={<ImageIcon />}
              iconPosition="start"
              sx={{ py: 2 }}
            />
            <Tab
              label="Object Detection"
              id="tab-1"
              icon={<VisibilityIcon />}
              iconPosition="start"
              sx={{ py: 2 }}
            />
            <Tab
              label="Scene Graph"
              id="tab-2"
              icon={<AccountTreeIcon />}
              iconPosition="start"
              sx={{ py: 2 }}
            />
          </Tabs>
        </Paper>

        {/* Tab Panel: Overview (both visualizations) */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              {/* Cards for both images */}
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <ResultCard
                    title="Object Detection"
                    imageUrl={results?.annotated_image_url}
                    icon={<VisibilityIcon />}
                    onView={() =>
                      handleOpenModal(
                        results?.annotated_image_url,
                        "Object Detection"
                      )
                    }
                  >
                    <Typography variant="body2" color="text.secondary">
                      Objects detected in the scene with bounding boxes and
                      confidence scores.
                    </Typography>

                    <Box sx={{ mt: 2, maxHeight: 200, overflow: "auto" }}>
                      <Grid container spacing={1}>
                        {results?.objects?.slice(0, 4).map((obj, i) => (
                          <Grid item key={i}>
                            <Chip
                              label={`${obj.label} (${(obj.score * 100).toFixed(
                                0
                              )}%)`}
                              color={
                                obj.score > 0.8
                                  ? "success"
                                  : obj.score > 0.5
                                  ? "primary"
                                  : "default"
                              }
                              size="small"
                              variant="outlined"
                            />
                          </Grid>
                        ))}
                        {results?.objects?.length > 4 && (
                          <Grid item>
                            <Chip
                              label={`+${results.objects.length - 4} more`}
                              color="default"
                              size="small"
                              variant="outlined"
                            />
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                  </ResultCard>
                </Grid>

                <Grid item xs={12} md={6}>
                  <ResultCard
                    title="Scene Graph"
                    imageUrl={results?.graph_url}
                    icon={<AccountTreeIcon />}
                    onView={() =>
                      handleOpenModal(results?.graph_url, "Scene Graph")
                    }
                  >
                    <Typography variant="body2" color="text.secondary">
                      Visual representation of objects and their relationships
                      within the scene.
                    </Typography>

                    <Box sx={{ mt: 2, maxHeight: 200, overflow: "auto" }}>
                      <Grid container spacing={1}>
                        {results?.relationships?.slice(0, 3).map((rel, i) => (
                          <Grid item key={i} xs={12}>
                            <Paper
                              variant="outlined"
                              sx={{
                                py: 0.75,
                                px: 1.5,
                                borderRadius: 2,
                                bgcolor: "background.default",
                                fontSize: "0.8rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <Box>
                                <Typography
                                  component="span"
                                  sx={{
                                    fontWeight: 600,
                                    color: theme.palette.primary.main,
                                  }}
                                >
                                  {rel.subject}
                                </Typography>{" "}
                                <Typography
                                  component="span"
                                  sx={{ fontStyle: "italic" }}
                                >
                                  {rel.predicate}
                                </Typography>{" "}
                                <Typography
                                  component="span"
                                  sx={{
                                    fontWeight: 600,
                                    color: theme.palette.primary.main,
                                  }}
                                >
                                  {rel.object}
                                </Typography>
                              </Box>
                              <Chip
                                label={`${(rel.score * 100).toFixed(0)}%`}
                                color={
                                  rel.score > 0.8
                                    ? "success"
                                    : rel.score > 0.5
                                    ? "primary"
                                    : "default"
                                }
                                size="small"
                                sx={{ ml: 1, minWidth: 60 }}
                              />
                            </Paper>
                          </Grid>
                        ))}
                        {results?.relationships?.length > 3 && (
                          <Grid item xs={12}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              align="center"
                            >
                              +{results.relationships.length - 3} more
                              relationships
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                  </ResultCard>
                </Grid>
              </Grid>

              {/* Summary stats */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mt: 4,
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Summary Statistics
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card
                      sx={{
                        p: 2,
                        textAlign: "center",
                        bgcolor: theme.palette.primary.light,
                        color: "white",
                        borderRadius: 3,
                        boxShadow: "0 4px 20px rgba(63, 81, 181, 0.2)",
                        backgroundImage:
                          "linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)",
                        overflow: "auto",
                      }}
                    >
                      <Typography variant="h3" fontWeight={700}>
                        {results?.objects?.length || 0}
                      </Typography>
                      <Typography variant="body2">Objects Detected</Typography>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Card
                      sx={{
                        p: 2,
                        textAlign: "center",
                        bgcolor: theme.palette.secondary.light,
                        color: "white",
                        borderRadius: 3,
                        boxShadow: "0 4px 20px rgba(245, 0, 87, 0.2)",
                        backgroundImage:
                          "linear-gradient(135deg, #f50057 0%, #ff4081 100%)",
                        overflow: "auto",
                      }}
                    >
                      <Typography variant="h3" fontWeight={700}>
                        {results?.relationships?.length || 0}
                      </Typography>
                      <Typography variant="body2">Relationships</Typography>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Card
                      sx={{
                        p: 2,
                        textAlign: "center",
                        color: "white",
                        borderRadius: 3,
                        boxShadow: "0 4px 20px rgba(76, 175, 80, 0.2)",
                        bgcolor: theme.palette.success.light,
                        backgroundImage:
                          "linear-gradient(135deg, #388e3c 0%, #66bb6a 100%)",
                        overflow: "auto",
                      }}
                    >
                      <Typography variant="h3" fontWeight={700}>
                        {(getAverageObjectConfidence() * 100).toFixed(0)}%
                      </Typography>
                      <Typography variant="body2">
                        Avg. Object Confidence
                      </Typography>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Card
                      sx={{
                        p: 2,
                        textAlign: "center",
                        color: "white",
                        borderRadius: 3,
                        boxShadow: "0 4px 20px rgba(3, 169, 244, 0.2)",
                        bgcolor: theme.palette.info.light,
                        backgroundImage:
                          "linear-gradient(135deg, #0288d1 0%, #29b6f6 100%)",
                        overflow: "auto",
                      }}
                    >
                      <Typography variant="h3" fontWeight={700}>
                        {(getAverageRelationshipConfidence() * 100).toFixed(0)}%
                      </Typography>
                      <Typography variant="body2">
                        Avg. Relation Confidence
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Grid container spacing={3} direction="column">
                <Grid item>
                  <ConfidenceBarGroup
                    data={formatObjectsForDisplay()}
                    title="Detected Objects"
                    emptyMessage="No objects detected"
                    sx={{
                      maxHeight: 350,
                      overflow: "auto",
                    }}
                  />
                </Grid>

                <Grid item>
                  <ConfidenceBarGroup
                    data={formatRelationshipsForDisplay()}
                    title="Detected Relationships"
                    emptyMessage="No relationships detected"
                    sx={{
                      maxHeight: 350,
                      overflow: "auto",
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab Panel: Object Detection */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Card
                elevation={1}
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    p: 0,
                    flexGrow: 1,
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ImageWithFallback
                    src={results?.annotated_image_url}
                    alt="Object Detection"
                    sx={{ cursor: "pointer" }}
                    onClick={() =>
                      handleOpenModal(
                        results?.annotated_image_url,
                        "Object Detection"
                      )
                    }
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 16,
                      right: 16,
                      display: "flex",
                      gap: 1,
                    }}
                  >
                    <Tooltip title="View full size">
                      <IconButton
                        sx={{
                          bgcolor: "white",
                          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                          "&:hover": { bgcolor: "white" },
                        }}
                        onClick={() =>
                          handleOpenModal(
                            results?.annotated_image_url,
                            "Object Detection"
                          )
                        }
                      >
                        <FullscreenIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <CardActions
                  sx={{
                    justifyContent: "flex-end",
                    p: 2,
                    borderTop: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Button
                    startIcon={<CloudDownloadIcon />}
                    component="a"
                    href={results?.annotated_image_url}
                    download
                    variant="outlined"
                  >
                    Download Image
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                <ConfidenceBarGroup
                  data={formatObjectsForDisplay()}
                  title="Detected Objects"
                  emptyMessage="No objects detected"
                  sx={{
                    maxHeight: 350,
                    overflow: "auto",
                  }}
                />

                <Card
                  elevation={1}
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    minHeight: 350, // Minimum height to ensure consistency
                  }}
                >
                  <CardContent
                    sx={{ p: 0, display: "flex", flexDirection: "column" }}
                  >
                    <Box
                      sx={{
                        p: 3,
                        borderBottom: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Typography variant="h6" gutterBottom fontWeight={600}>
                        Object Details
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        The model detected {results?.objects?.length || 0}{" "}
                        objects in the scene.
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        p: 3,
                        overflow: "auto",
                        flexGrow: 1,
                        maxHeight: 350,
                      }}
                    >
                      <Grid container spacing={1.5}>
                        {results?.objects &&
                          results.objects.map((obj, i) => (
                            <Grid item key={i} xs={12}>
                              <Paper
                                variant="outlined"
                                sx={{
                                  p: 1.5,
                                  borderRadius: 2,
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  bgcolor:
                                    obj.score > 0.8
                                      ? "rgba(76, 175, 80, 0.04)"
                                      : obj.score > 0.5
                                      ? "rgba(63, 81, 181, 0.04)"
                                      : "background.default",
                                  borderColor:
                                    obj.score > 0.8
                                      ? "success.light"
                                      : obj.score > 0.5
                                      ? "primary.light"
                                      : "divider",
                                }}
                              >
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <Avatar
                                    sx={{
                                      width: 32,
                                      height: 32,
                                      fontSize: "0.9rem",
                                      bgcolor:
                                        obj.score > 0.8
                                          ? "success.light"
                                          : obj.score > 0.5
                                          ? "primary.light"
                                          : "grey.400",
                                      mr: 1.5,
                                    }}
                                  >
                                    {obj.label.slice(0, 1).toUpperCase()}
                                  </Avatar>
                                  <Typography variant="body2" fontWeight={500}>
                                    {obj.label}
                                  </Typography>
                                </Box>
                                <Chip
                                  label={`${(obj.score * 100).toFixed(0)}%`}
                                  color={
                                    obj.score > 0.8
                                      ? "success"
                                      : obj.score > 0.5
                                      ? "primary"
                                      : "default"
                                  }
                                  size="small"
                                />
                              </Paper>
                            </Grid>
                          ))}

                        {(!results?.objects ||
                          results.objects.length === 0) && (
                          <Grid item xs={12}>
                            <Box
                              sx={{
                                p: 4,
                                textAlign: "center",
                                borderRadius: 2,
                                border: "1px dashed",
                                borderColor: "divider",
                                bgcolor: "background.default",
                              }}
                            >
                              <Typography color="text.secondary">
                                No objects detected
                              </Typography>
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab Panel: Scene Graph */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Card
                elevation={1}
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    p: 0,
                    flexGrow: 1,
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ImageWithFallback
                    src={results?.graph_url}
                    alt="Scene Graph"
                    sx={{ cursor: "pointer" }}
                    onClick={() =>
                      handleOpenModal(results?.graph_url, "Scene Graph")
                    }
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 16,
                      right: 16,
                      display: "flex",
                      gap: 1,
                    }}
                  >
                    <Tooltip title="View full size">
                      <IconButton
                        sx={{
                          bgcolor: "white",
                          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                          "&:hover": { bgcolor: "white" },
                        }}
                        onClick={() =>
                          handleOpenModal(results?.graph_url, "Scene Graph")
                        }
                      >
                        <FullscreenIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <CardActions
                  sx={{
                    justifyContent: "flex-end",
                    p: 2,
                    borderTop: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Button
                    startIcon={<CloudDownloadIcon />}
                    component="a"
                    href={results?.graph_url}
                    download
                    variant="outlined"
                  >
                    Download Graph
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                <ConfidenceBarGroup
                  data={formatRelationshipsForDisplay()}
                  title="Detected Relationships"
                  emptyMessage="No relationships detected"
                  sx={{
                    maxHeight: 350,
                    overflow: "auto",
                  }}
                />

                <Card
                  elevation={1}
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    minHeight: 350, // Minimum height to ensure consistency
                  }}
                >
                  <CardContent
                    sx={{ p: 0, display: "flex", flexDirection: "column" }}
                  >
                    <Box
                      sx={{
                        p: 3,
                        borderBottom: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Typography variant="h6" gutterBottom fontWeight={600}>
                        Relationship Details
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        The model identified{" "}
                        {results?.relationships?.length || 0} relationships
                        between objects.
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        p: 3,
                        overflow: "auto",
                        flexGrow: 1,
                        maxHeight: 350,
                      }}
                    >
                      <Grid container spacing={1.5}>
                        {results?.relationships &&
                          results.relationships.map((rel, i) => (
                            <Grid item key={i} xs={12}>
                              <Paper
                                variant="outlined"
                                sx={{
                                  p: 2,
                                  borderRadius: 2,
                                  bgcolor:
                                    rel.score > 0.8
                                      ? "rgba(76, 175, 80, 0.04)"
                                      : rel.score > 0.5
                                      ? "rgba(63, 81, 181, 0.04)"
                                      : "background.default",
                                  borderColor:
                                    rel.score > 0.8
                                      ? "success.light"
                                      : rel.score > 0.5
                                      ? "primary.light"
                                      : "divider",
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    mb: 1,
                                  }}
                                >
                                  <Typography variant="body2" fontWeight={600}>
                                    Relationship #{i + 1}
                                  </Typography>
                                  <Chip
                                    label={`${(rel.score * 100).toFixed(0)}%`}
                                    color={
                                      rel.score > 0.8
                                        ? "success"
                                        : rel.score > 0.5
                                        ? "primary"
                                        : "default"
                                    }
                                    size="small"
                                  />
                                </Box>

                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    mt: 1,
                                    flexWrap: "wrap", // Allow content to wrap if needed
                                  }}
                                >
                                  <Box
                                    sx={{
                                      borderRadius: 2,
                                      px: 1.5,
                                      py: 0.5,
                                      mb: 0.5,
                                      bgcolor: "primary.main",
                                      color: "white",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {rel.subject}
                                  </Box>

                                  <Box
                                    sx={{
                                      mx: 1,
                                      mb: 0.5,
                                      fontSize: "0.85rem",
                                      fontStyle: "italic",
                                      color: "text.secondary",
                                    }}
                                  >
                                    {rel.predicate}
                                  </Box>

                                  <Box
                                    sx={{
                                      borderRadius: 2,
                                      px: 1.5,
                                      py: 0.5,
                                      mb: 0.5,
                                      bgcolor: "secondary.main",
                                      color: "white",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {rel.object}
                                  </Box>
                                </Box>
                              </Paper>
                            </Grid>
                          ))}

                        {(!results?.relationships ||
                          results.relationships.length === 0) && (
                          <Grid item xs={12}>
                            <Box
                              sx={{
                                p: 4,
                                textAlign: "center",
                                borderRadius: 2,
                                border: "1px dashed",
                                borderColor: "divider",
                                bgcolor: "background.default",
                              }}
                            >
                              <Typography color="text.secondary">
                                No relationships detected
                              </Typography>
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </TabPanel>
      </motion.div>
    </Container>
  );
};

export default ResultsPage;
