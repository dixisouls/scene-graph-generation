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
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import HeroSection from "../components/HeroSection";

// Icons
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import MemoryIcon from "@mui/icons-material/Memory";
import LayersIcon from "@mui/icons-material/Layers";
import ImageIcon from "@mui/icons-material/Image";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SettingsIcon from "@mui/icons-material/Settings";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import ApiIcon from "@mui/icons-material/Api";
import DevicesIcon from "@mui/icons-material/Devices";
import StorageIcon from "@mui/icons-material/Storage";

// Motion components
const MotionBox = motion(Box);
const MotionGrid = motion(Grid);
const MotionCard = motion(Card);
const MotionTypography = motion(Typography);
const MotionPaper = motion(Paper);

// Card component with animation
const FeatureCard = ({ icon, title, description, delay = 0 }) => {
  const theme = useTheme();

  return (
    <MotionCard
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true, margin: "-50px" }}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 16px 70px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <CardContent sx={{ p: 3, flexGrow: 1 }}>
        <Box
          sx={{
            display: "inline-flex",
            borderRadius: "20%",
            p: 1.5,
            mb: 2,
            bgcolor: "primary.light",
            color: "white",
            boxShadow: "0 4px 14px rgba(63, 81, 181, 0.2)",
            backgroundImage:
              "linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)",
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </MotionCard>
  );
};

const LandingPage = () => {
  const theme = useTheme();

  // Benefits list
  const benefits = [
    "Automatic object detection and classification",
    "Relationship inference between objects",
    "Visual graph representation",
    "Confidence scores for predictions",
    "Customizable confidence thresholds",
    "Visual annotations on original images",
  ];

  return (
    <Box component="main">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
        <MotionBox
          textAlign="center"
          maxWidth={800}
          mx="auto"
          mb={8}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Typography variant="h3" component="h2" gutterBottom fontWeight={700}>
            How It Works
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Our scene graph generation system uses advanced deep learning
            techniques to analyze images and create structured representations
            of their content.
          </Typography>
        </MotionBox>

        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard
              icon={<PhotoCameraIcon fontSize="large" />}
              title="Object Detection"
              description="Identifies objects in the image using YOLOv8, a state-of-the-art object detection model."
              delay={0.1}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard
              icon={<LayersIcon fontSize="large" />}
              title="Feature Extraction"
              description="Extracts meaningful visual features from detected objects using a ResNet50 backbone."
              delay={0.2}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard
              icon={<MemoryIcon fontSize="large" />}
              title="Relationship Prediction"
              description="Neural network predicts relationships between pairs of objects based on their features."
              delay={0.3}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard
              icon={<AccountTreeIcon fontSize="large" />}
              title="Graph Generation"
              description="Generates a structured scene graph with objects as nodes and relationships as edges."
              delay={0.4}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Illustration Section */}
      <Box
        sx={{
          bgcolor: "background.default",
          py: 10,
          borderTop: "1px solid",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <MotionBox
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Typography
                  variant="h4"
                  component="h2"
                  gutterBottom
                  fontWeight={700}
                >
                  Understand Your Images at a Deeper Level
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Scene graphs provide a structured way to represent the content
                  of an image, making it easier to analyze, search, and
                  understand visual data.
                </Typography>

                <List sx={{ mt: 2 }}>
                  {benefits.map((benefit, index) => (
                    <ListItem key={index} disableGutters sx={{ pb: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleOutlineIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={benefit} />
                    </ListItem>
                  ))}
                </List>

                <Button
                  component={RouterLink}
                  to="/inference"
                  variant="contained"
                  size="large"
                  sx={{ mt: 3 }}
                  endIcon={<ArrowForwardIcon />}
                >
                  Try it now
                </Button>
              </MotionBox>
            </Grid>

            <Grid item xs={12} md={6}>
              <MotionBox
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                sx={{
                  position: "relative",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: -20,
                    left: -20,
                    right: 20,
                    bottom: 20,
                    borderRadius: 4,
                    background:
                      "linear-gradient(135deg, rgba(63, 81, 181, 0.1) 0%, rgba(245, 0, 87, 0.1) 100%)",
                    zIndex: 0,
                  },
                }}
              >
                <Paper
                  elevation={4}
                  sx={{
                    borderRadius: 4,
                    overflow: "hidden",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <Box sx={{ p: 1 }}>
                    <svg viewBox="0 0 800 500" width="100%" height="100%">
                      {/* Background */}
                      <rect width="800" height="500" fill="#f5f5f7" />

                      {/* Original Image (simplified representation) */}
                      <rect
                        x="50"
                        y="50"
                        width="300"
                        height="400"
                        rx="10"
                        fill="#e0e0e0"
                        stroke="#bdbdbd"
                        strokeWidth="2"
                      />
                      <rect
                        x="80"
                        y="80"
                        width="240"
                        height="160"
                        rx="5"
                        fill="#3f51b5"
                        fillOpacity="0.2"
                      />
                      <circle
                        cx="150"
                        cy="200"
                        r="30"
                        fill="#3f51b5"
                        fillOpacity="0.5"
                        stroke="#3f51b5"
                        strokeWidth="2"
                      />
                      <rect
                        x="200"
                        cy="250"
                        width="80"
                        height="120"
                        rx="5"
                        fill="#f50057"
                        fillOpacity="0.2"
                        stroke="#f50057"
                        strokeWidth="2"
                      />
                      <circle
                        cx="120"
                        cy="350"
                        r="40"
                        fill="#4caf50"
                        fillOpacity="0.3"
                        stroke="#4caf50"
                        strokeWidth="2"
                      />

                      {/* Bounding box annotation */}
                      <rect
                        x="115"
                        y="170"
                        width="70"
                        height="70"
                        rx="5"
                        fill="none"
                        stroke="#3f51b5"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                      />
                      <rect
                        x="200"
                        y="250"
                        width="80"
                        height="120"
                        rx="5"
                        fill="none"
                        stroke="#f50057"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                      />
                      <rect
                        x="80"
                        y="310"
                        width="80"
                        height="80"
                        rx="5"
                        fill="none"
                        stroke="#4caf50"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                      />

                      {/* Graph visualization */}
                      <rect
                        x="400"
                        y="50"
                        width="350"
                        height="400"
                        rx="10"
                        fill="white"
                        stroke="#bdbdbd"
                        strokeWidth="2"
                      />

                      {/* Nodes */}
                      <circle
                        cx="500"
                        cy="150"
                        r="40"
                        fill="#3f51b5"
                        fillOpacity="0.7"
                        stroke="#3f51b5"
                        strokeWidth="2"
                      />
                      <circle
                        cx="650"
                        cy="150"
                        r="40"
                        fill="#f50057"
                        fillOpacity="0.7"
                        stroke="#f50057"
                        strokeWidth="2"
                      />
                      <circle
                        cx="575"
                        cy="300"
                        r="40"
                        fill="#4caf50"
                        fillOpacity="0.7"
                        stroke="#4caf50"
                        strokeWidth="2"
                      />

                      {/* Edges */}
                      <line
                        x1="500"
                        y1="150"
                        x2="575"
                        y2="300"
                        stroke="#666"
                        strokeWidth="2"
                      />
                      <line
                        x1="650"
                        y1="150"
                        x2="575"
                        y2="300"
                        stroke="#666"
                        strokeWidth="2"
                      />
                      <line
                        x1="500"
                        y1="150"
                        x2="650"
                        y2="150"
                        stroke="#666"
                        strokeWidth="2"
                      />

                      {/* Labels */}
                      <text
                        x="500"
                        y="155"
                        textAnchor="middle"
                        fill="white"
                        fontWeight="bold"
                        fontSize="14"
                      >
                        Person
                      </text>
                      <text
                        x="650"
                        y="155"
                        textAnchor="middle"
                        fill="white"
                        fontWeight="bold"
                        fontSize="14"
                      >
                        Car
                      </text>
                      <text
                        x="575"
                        y="305"
                        textAnchor="middle"
                        fill="white"
                        fontWeight="bold"
                        fontSize="14"
                      >
                        Tree
                      </text>

                      {/* Relationship labels */}
                      <text
                        x="537"
                        y="225"
                        textAnchor="middle"
                        fill="#333"
                        fontWeight="bold"
                        fontSize="12"
                      >
                        near
                      </text>
                      <text
                        x="612"
                        y="225"
                        textAnchor="middle"
                        fill="#333"
                        fontWeight="bold"
                        fontSize="12"
                      >
                        behind
                      </text>
                      <text
                        x="575"
                        y="135"
                        textAnchor="middle"
                        fill="#333"
                        fontWeight="bold"
                        fontSize="12"
                      >
                        looking at
                      </text>

                      {/* Title */}
                      <text
                        x="575"
                        y="80"
                        textAnchor="middle"
                        fill="#333"
                        fontWeight="bold"
                        fontSize="16"
                      >
                        Scene Graph Representation
                      </text>
                    </svg>
                  </Box>
                </Paper>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Technology Section */}
      <Container maxWidth="lg" sx={{ mt: 10, mb: 10 }}>
        <MotionBox
          textAlign="center"
          maxWidth={800}
          mx="auto"
          mb={6}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Typography variant="h3" component="h2" gutterBottom fontWeight={700}>
            Technology Stack
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Built with modern technologies for performance and scalability
          </Typography>
        </MotionBox>

        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <MotionPaper
              elevation={0}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              sx={{
                p: 3,
                height: "100%",
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: "primary.light",
                    color: "white",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    mr: 2,
                  }}
                >
                  <ApiIcon />
                </Avatar>
                <Typography variant="h5" component="h3" fontWeight={600}>
                  Backend
                </Typography>
              </Box>

              <List sx={{ pl: 1 }}>
                <ListItem>
                  <ListItemIcon>
                    <FlashOnIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="FastAPI"
                    secondary="High-performance Python web framework for building APIs"
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <MemoryIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="PyTorch"
                    secondary="Deep learning framework for the scene graph model"
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <VisibilityIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="YOLOv8"
                    secondary="State-of-the-art, real-time object detection system"
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <AccountTreeIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="NetworkX"
                    secondary="Graph creation and visualization library"
                  />
                </ListItem>
              </List>
            </MotionPaper>
          </Grid>

          <Grid item xs={12} md={6}>
            <MotionPaper
              elevation={0}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              sx={{
                p: 3,
                height: "100%",
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: "secondary.light",
                    color: "white",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    mr: 2,
                  }}
                >
                  <DevicesIcon />
                </Avatar>
                <Typography variant="h5" component="h3" fontWeight={600}>
                  Frontend
                </Typography>
              </Box>

              <List sx={{ pl: 1 }}>
                <ListItem>
                  <ListItemIcon>
                    <SettingsIcon
                      sx={{ color: theme.palette.secondary.main }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="React"
                    secondary="JavaScript library for building user interfaces"
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <LayersIcon sx={{ color: theme.palette.secondary.main }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Material-UI"
                    secondary="React component library implementing Material Design"
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <ImageIcon sx={{ color: theme.palette.secondary.main }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Framer Motion"
                    secondary="Production-ready animation library for React"
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <StorageIcon sx={{ color: theme.palette.secondary.main }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Axios"
                    secondary="Promise based HTTP client for making API requests"
                  />
                </ListItem>
              </List>
            </MotionPaper>
          </Grid>
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          borderRadius: { xs: 0, sm: 4 },
          py: 6,
          px: 3,
          mx: { xs: 0, sm: 4 },
          textAlign: "center",
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          background: "linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative elements */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            zIndex: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
        />

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <MotionTypography
            variant="h3"
            component="h2"
            gutterBottom
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            sx={{ fontWeight: 700 }}
          >
            Ready to Generate Scene Graphs?
          </MotionTypography>

          <MotionTypography
            variant="h6"
            paragraph
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            sx={{ mb: 4, maxWidth: 700, mx: "auto", fontWeight: "normal" }}
          >
            Upload your images and let our model analyze the objects and
            relationships within them. Gain new insights into your visual
            content with structured scene graph representations.
          </MotionTypography>

          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Button
              component={RouterLink}
              to="/inference"
              variant="contained"
              size="large"
              color="secondary"
              endIcon={<ArrowForwardIcon />}
              sx={{
                py: 1.5,
                px: 4,
                fontWeight: 600,
                fontSize: "1.1rem",
                boxShadow: "0 8px 25px rgba(245, 0, 87, 0.4)",
              }}
            >
              Get Started Now
            </Button>
          </MotionBox>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
