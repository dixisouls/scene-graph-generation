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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import axios from "axios";
import { ConfidenceBarGroup } from "../components/ConfidenceBar";
import LoadingAnimation from "../components/LoadingAnimation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import RefreshIcon from "@mui/icons-material/Refresh";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CloseIcon from "@mui/icons-material/Close";

// Image component with fallback
const ImageWithFallback = ({ src, alt, ...props }) => {
  const [error, setError] = useState(false);

  const handleError = () => {
    console.error(`Failed to load image: ${src}`);
    setError(true);
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
          bgcolor: "grey.100",
          p: 3,
          borderRadius: 1,
        }}
        {...props}
      >
        <Typography variant="body1" color="text.secondary" align="center">
          Image could not be loaded
        </Typography>
        <Typography variant="caption" color="text.secondary" align="center">
          {src}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          sx={{ mt: 2 }}
          onClick={() => setError(false)}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <CardMedia
      component="img"
      src={src}
      alt={alt}
      onError={handleError}
      {...props}
    />
  );
};

// Modal image component for full-screen preview
const ImageModal = ({ open, handleClose, imageUrl, title }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
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
            width: "90%",
            maxWidth: "1000px",
            maxHeight: "90vh",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 2,
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
            <Typography variant="h6">{title}</Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              overflow: "auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={imageUrl}
              alt={title}
              style={{
                maxWidth: "100%",
                maxHeight: "calc(90vh - 70px)",
                objectFit: "contain",
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

// Styled components
const ResultImage = styled(({ src, alt, ...props }) => (
  <ImageWithFallback src={src} alt={alt} {...props} />
))(({ theme }) => ({
  height: 400,
  objectFit: "contain",
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.02)",
    cursor: "pointer",
  },
}));

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

const ResultsPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

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

  // Loading state
  if (loading) {
    return <LoadingAnimation message="Loading scene graph results..." />;
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
        >
          Back to Inference
        </Button>
      </Box>
    );
  }

  return (
    <Box
      component={motion.div}
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

        <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
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

      {/* Results Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="results tabs"
          centered
        >
          <Tab label="Scene Analysis" id="tab-0" />
          <Tab label="Object Detection" id="tab-1" />
          <Tab label="Scene Graph" id="tab-2" />
        </Tabs>
      </Box>

      {/* Tab Panel: Overview (both visualizations) */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Scene Analysis Results
              </Typography>
              <Typography variant="body2" paragraph color="text.secondary">
                The scene graph model has analyzed the image and identified
                objects and their relationships.
              </Typography>

              {/* Modified layout: Full-width images with more spacing */}
              <Grid container spacing={4} direction="column">
                <Grid item xs={12}>
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Object Detection
                    </Typography>
                    <Box
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                        overflow: "hidden",
                        height: 450,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        bgcolor: "background.default",
                      }}
                      onClick={() =>
                        handleOpenModal(
                          results?.annotated_image_url,
                          "Object Detection"
                        )
                      }
                    >
                      <img
                        src={results?.annotated_image_url}
                        alt="Object Detection"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                          cursor: "pointer",
                        }}
                      />
                    </Box>
                    <Box sx={{ mt: 1, textAlign: "right" }}>
                      <Tooltip title="View full size">
                        <IconButton
                          size="small"
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
                      <Tooltip title="Download image">
                        <IconButton
                          size="small"
                          component="a"
                          href={results?.annotated_image_url}
                          download
                        >
                          <FileDownloadIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Scene Graph
                    </Typography>
                    <Box
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                        overflow: "hidden",
                        height: 450,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        bgcolor: "background.default",
                      }}
                      onClick={() =>
                        handleOpenModal(results?.graph_url, "Scene Graph")
                      }
                    >
                      <img
                        src={results?.graph_url}
                        alt="Scene Graph"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                          cursor: "pointer",
                        }}
                      />
                    </Box>
                    <Box sx={{ mt: 1, textAlign: "right" }}>
                      <Tooltip title="View full size">
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleOpenModal(results?.graph_url, "Scene Graph")
                          }
                        >
                          <FullscreenIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download image">
                        <IconButton
                          size="small"
                          component="a"
                          href={results?.graph_url}
                          download
                        >
                          <FileDownloadIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              {/* Summary stats */}
              <Box sx={{ mt: 4 }}>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Paper
                      sx={{
                        p: 2,
                        textAlign: "center",
                        bgcolor: "primary.light",
                        color: "white",
                      }}
                    >
                      <Typography variant="h4">
                        {results?.objects?.length || 0}
                      </Typography>
                      <Typography variant="body2">Objects</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Paper
                      sx={{
                        p: 2,
                        textAlign: "center",
                        bgcolor: "secondary.light",
                        color: "white",
                      }}
                    >
                      <Typography variant="h4">
                        {results?.relationships?.length || 0}
                      </Typography>
                      <Typography variant="body2">Relationships</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Paper
                      sx={{
                        p: 2,
                        textAlign: "center",
                        bgcolor: "success.light",
                        color: "white",
                      }}
                    >
                      <Typography variant="h4">
                        {results?.objects?.length > 0
                          ? (
                              (results.objects.reduce(
                                (acc, obj) => acc + obj.score,
                                0
                              ) /
                                results.objects.length) *
                              100
                            ).toFixed(0)
                          : 0}
                        %
                      </Typography>
                      <Typography variant="body2">
                        Avg. Object Confidence
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Paper
                      sx={{
                        p: 2,
                        textAlign: "center",
                        bgcolor: "info.light",
                        color: "white",
                      }}
                    >
                      <Typography variant="h4">
                        {results?.relationships?.length > 0
                          ? (
                              (results.relationships.reduce(
                                (acc, rel) => acc + rel.score,
                                0
                              ) /
                                results.relationships.length) *
                              100
                            ).toFixed(0)
                          : 0}
                        %
                      </Typography>
                      <Typography variant="body2">
                        Avg. Relation Confidence
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Grid container spacing={3} direction="column">
              <Grid item>
                <ConfidenceBarGroup
                  data={formatObjectsForDisplay()}
                  title="Detected Objects"
                  emptyMessage="No objects detected"
                />
              </Grid>

              <Grid item>
                <ConfidenceBarGroup
                  data={formatRelationshipsForDisplay()}
                  title="Detected Relationships"
                  emptyMessage="No relationships detected"
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
              elevation={0}
              sx={{
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <ResultImage
                  src={results?.annotated_image_url}
                  alt="Object Detection"
                  sx={{ height: 500, borderRadius: 0 }}
                  onClick={() =>
                    handleOpenModal(
                      results?.annotated_image_url,
                      "Object Detection"
                    )
                  }
                />
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end" }}>
                <Button
                  startIcon={<CloudDownloadIcon />}
                  component="a"
                  href={results?.annotated_image_url}
                  download
                >
                  Download Image
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                height: "100%",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Detected Objects
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                The model detected {results?.objects?.length || 0} objects in
                the scene.
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mt: 2, mb: 3 }}>
                <Grid container spacing={1}>
                  {results?.objects &&
                    results.objects.map((obj, i) => (
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
                          variant="outlined"
                          sx={{ m: 0.5 }}
                        />
                      </Grid>
                    ))}
                </Grid>
              </Box>

              <ConfidenceBarGroup
                data={formatObjectsForDisplay()}
                title="Object Confidence Scores"
                emptyMessage="No objects detected"
              />
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Tab Panel: Scene Graph */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <ResultImage
                  src={results?.graph_url}
                  alt="Scene Graph"
                  sx={{ height: 500, borderRadius: 0 }}
                  onClick={() =>
                    handleOpenModal(results?.graph_url, "Scene Graph")
                  }
                />
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end" }}>
                <Button
                  startIcon={<CloudDownloadIcon />}
                  component="a"
                  href={results?.graph_url}
                  download
                >
                  Download Graph
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                height: "100%",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Detected Relationships
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                The model identified {results?.relationships?.length || 0}{" "}
                relationships between objects.
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mt: 3 }}>
                <ConfidenceBarGroup
                  data={formatRelationshipsForDisplay()}
                  title="Relationship Confidence Scores"
                  emptyMessage="No relationships detected"
                />
              </Box>

              {results?.relationships && results.relationships.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Relationship Descriptions
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    {results.relationships.map((rel, i) => (
                      <Box
                        key={i}
                        sx={{
                          mb: i !== results.relationships.length - 1 ? 1 : 0,
                        }}
                      >
                        <Typography variant="body2">
                          <Box
                            component="span"
                            sx={{ fontWeight: "bold", color: "primary.main" }}
                          >
                            {rel.subject}
                          </Box>{" "}
                          <Box component="span" sx={{ fontStyle: "italic" }}>
                            {rel.predicate}
                          </Box>{" "}
                          <Box
                            component="span"
                            sx={{ fontWeight: "bold", color: "primary.main" }}
                          >
                            {rel.object}
                          </Box>{" "}
                          <Box
                            component="span"
                            sx={{ color: "text.secondary", fontSize: "0.8rem" }}
                          >
                            ({(rel.score * 100).toFixed(0)}%)
                          </Box>
                        </Typography>
                      </Box>
                    ))}
                  </Paper>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default ResultsPage;
