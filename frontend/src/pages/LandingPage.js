import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
  Divider,
  useTheme,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";

// Icons
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import MemoryIcon from "@mui/icons-material/Memory";
import LayersIcon from "@mui/icons-material/Layers";
import ImageIcon from "@mui/icons-material/Image";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import VisibilityIcon from "@mui/icons-material/Visibility";

// Motion components
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionGrid = motion(Grid);
const MotionCard = motion(Card);

const LandingPage = () => {
  const theme = useTheme();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  // Architecture information
  const architectureSteps = [
    {
      icon: <PhotoCameraIcon fontSize="large" />,
      title: "Object Detection",
      description:
        "YOLOv8 identifies objects in the input image with their bounding boxes.",
    },
    {
      icon: <LayersIcon fontSize="large" />,
      title: "Feature Extraction",
      description:
        "ResNet-50 backbone extracts visual features from the detected objects.",
    },
    {
      icon: <MemoryIcon fontSize="large" />,
      title: "Relationship Prediction",
      description:
        "Neural network predicts relationships between pairs of objects.",
    },
    {
      icon: <AccountTreeIcon fontSize="large" />,
      title: "Graph Generation",
      description:
        "Generates a structured scene graph with objects as nodes and relationships as edges.",
    },
  ];

  return (
    <Container maxWidth="lg" component="main" sx={{ mb: 8 }}>
      {/* Hero Section */}
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          py: { xs: 6, md: 10 },
          overflow: "hidden",
        }}
      >
        <MotionTypography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            mb: 3,
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Scene Graph Generation
        </MotionTypography>

        <MotionTypography
          variant="h5"
          color="text.secondary"
          paragraph
          sx={{ maxWidth: 800, mb: 4 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Transform your images into structured graph representations that
          capture objects and their relationships within a scene.
        </MotionTypography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mt: 2,
          }}
        >
          <Button
            component={RouterLink}
            to="/inference"
            variant="contained"
            size="large"
            color="primary"
            sx={{
              py: 1.5,
              px: 4,
              fontWeight: 600,
            }}
          >
            Try It Now
          </Button>
          <Button
            variant="outlined"
            size="large"
            color="primary"
            href="https://github.com/dixisouls"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              py: 1.5,
              px: 4,
              fontWeight: 600,
            }}
          >
            View on GitHub
          </Button>
        </Box>
      </MotionBox>

      {/* What is Scene Graph Section */}
      <Box sx={{ py: 6 }}>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{ fontWeight: 600, mb: 4, textAlign: "center" }}
        >
          What is Scene Graph Generation?
        </Typography>

        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                bgcolor: "background.paper",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="body1" paragraph>
                A <strong>scene graph</strong> is a structured representation of
                an image that captures objects, their attributes, and
                relationships between objects. It represents visual content in a
                graphical format, making it easier for computers to understand
                and reason about the scene.
              </Typography>
              <Typography variant="body1" paragraph>
                Scene graphs are powerful because they bridge the gap between
                visual perception and semantic understanding. They enable
                applications like:
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Box component="li">
                  <Typography variant="body1">
                    Visual question answering
                  </Typography>
                </Box>
                <Box component="li">
                  <Typography variant="body1">
                    Image captioning and retrieval
                  </Typography>
                </Box>
                <Box component="li">
                  <Typography variant="body1">
                    Robot navigation and planning
                  </Typography>
                </Box>
                <Box component="li">
                  <Typography variant="body1">
                    Visual reasoning systems
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 3,
                bgcolor: "background.paper",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                textAlign: "center",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  maxWidth: 400,
                  mx: "auto",
                }}
              >
                <svg viewBox="0 0 400 300">
                  {/* Background */}
                  <rect width="400" height="300" fill="#f5f5f7" />

                  {/* Nodes */}
                  <circle
                    cx="100"
                    cy="80"
                    r="30"
                    fill="#3f51b5"
                    fillOpacity="0.7"
                    stroke="#3f51b5"
                    strokeWidth="2"
                  />
                  <circle
                    cx="200"
                    cy="200"
                    r="30"
                    fill="#3f51b5"
                    fillOpacity="0.7"
                    stroke="#3f51b5"
                    strokeWidth="2"
                  />
                  <circle
                    cx="300"
                    cy="120"
                    r="30"
                    fill="#3f51b5"
                    fillOpacity="0.7"
                    stroke="#3f51b5"
                    strokeWidth="2"
                  />

                  {/* Edges */}
                  <path
                    d="M100 80 L200 200"
                    stroke="#777"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                  <path
                    d="M200 200 L300 120"
                    stroke="#777"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                  <path
                    d="M100 80 L300 120"
                    stroke="#777"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />

                  {/* Labels */}
                  <text
                    x="100"
                    y="85"
                    textAnchor="middle"
                    fill="white"
                    fontWeight="bold"
                  >
                    Person
                  </text>
                  <text
                    x="200"
                    y="205"
                    textAnchor="middle"
                    fill="white"
                    fontWeight="bold"
                  >
                    Bike
                  </text>
                  <text
                    x="300"
                    y="125"
                    textAnchor="middle"
                    fill="white"
                    fontWeight="bold"
                  >
                    Road
                  </text>

                  {/* Relationship labels */}
                  <text
                    x="150"
                    y="130"
                    textAnchor="middle"
                    fill="#333"
                    fontWeight="bold"
                  >
                    riding
                  </text>
                  <text
                    x="250"
                    y="170"
                    textAnchor="middle"
                    fill="#333"
                    fontWeight="bold"
                  >
                    on
                  </text>
                  <text
                    x="200"
                    y="70"
                    textAnchor="middle"
                    fill="#333"
                    fontWeight="bold"
                  >
                    traveling on
                  </text>
                </svg>
              </Box>
              <Typography
                variant="subtitle1"
                sx={{ mt: 2, fontStyle: "italic" }}
              >
                Example of a simple scene graph
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 6 }} />

      {/* Model Architecture Section */}
      <Box sx={{ py: 4 }}>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{ fontWeight: 600, mb: 5, textAlign: "center" }}
        >
          Our Approach
        </Typography>

        <MotionGrid
          container
          spacing={3}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {architectureSteps.map((step, index) => (
            <MotionGrid
              item
              xs={12}
              sm={6}
              md={3}
              key={index}
              variants={itemVariants}
            >
              <MotionCard
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
                  },
                }}
                whileHover={{ y: -5 }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                  <Box
                    sx={{
                      color: "primary.main",
                      mb: 2,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {step.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {step.description}
                  </Typography>
                </CardContent>
              </MotionCard>
            </MotionGrid>
          ))}
        </MotionGrid>
      </Box>

      {/* Call to Action */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          borderRadius: 3,
          mt: 8,
          p: 6,
          textAlign: "center",
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
          Ready to Generate Scene Graphs?
        </Typography>
        <Typography
          variant="body1"
          paragraph
          sx={{ mb: 4, maxWidth: 700, mx: "auto" }}
        >
          Upload your images and let our model analyze the objects and
          relationships within them. Gain new insights into your visual content
          with structured scene graph representations.
        </Typography>
        <Button
          component={RouterLink}
          to="/inference"
          variant="contained"
          size="large"
          color="secondary"
          sx={{ py: 1.5, px: 4, fontWeight: 600 }}
        >
          Get Started
        </Button>
      </Box>
    </Container>
  );
};

export default LandingPage;
