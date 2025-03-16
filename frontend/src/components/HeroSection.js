import React from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  useTheme,
  useMediaQuery,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AccountTreeIcon from "@mui/icons-material/AccountTree";

// Motion components
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionPaper = motion(Paper);

const HeroSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.down("md"));

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: [0.6, 0.05, -0.01, 0.9] },
    },
  };

  const decorationVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.7, delay: 0.6 },
    },
  };

  return (
    <Box
      sx={{
        background: `radial-gradient(circle at 90% 10%, ${theme.palette.primary.light}22, transparent 40%), 
                     radial-gradient(circle at 10% 90%, ${theme.palette.secondary.light}22, transparent 40%)`,
        borderRadius: { xs: 0, sm: 4 },
        overflow: "hidden",
        position: "relative",
        my: { xs: 0, sm: 4 },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            py: { xs: 8, md: 12 },
            px: { xs: 2, sm: 4, md: 6 },
            position: "relative",
            zIndex: 1,
          }}
        >
          <MotionBox
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            sx={{
              maxWidth: 800,
              mx: "auto",
              textAlign: "center",
            }}
          >
            {/* Subtitle */}
            <MotionTypography
              variant="subtitle1"
              component="div"
              variants={itemVariants}
              sx={{
                mb: 2,
                display: "inline-flex",
                alignItems: "center",
                px: 2,
                py: 0.5,
                bgcolor: "rgba(63, 81, 181, 0.08)",
                borderRadius: 5,
                color: "primary.main",
                boxShadow: "0 2px 8px rgba(63, 81, 181, 0.1)",
              }}
            >
              <AccountTreeIcon sx={{ mr: 1, fontSize: 18 }} />
              AI-Powered Scene Graph Generation
            </MotionTypography>

            {/* Title */}
            <MotionTypography
              variant={isMobile ? "h3" : "h2"}
              component="h1"
              variants={itemVariants}
              sx={{
                fontWeight: 800,
                mb: 3,
                background: "linear-gradient(135deg, #3f51b5 10%, #f50057 90%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "inline-block",
                textShadow: "0 10px 20px rgba(0,0,0,0.1)",
                letterSpacing: "-0.02em",
              }}
            >
              Transform Images into Graph Representations
            </MotionTypography>

            {/* Description */}
            <MotionTypography
              variant="body1"
              color="text.secondary"
              paragraph
              variants={itemVariants}
              sx={{
                maxWidth: 700,
                mx: "auto",
                mb: 4,
                fontSize: { xs: "1rem", sm: "1.1rem" },
                lineHeight: 1.6,
              }}
            >
              Analyze images, detect objects, and discover relationships with
              our advanced scene graph generation model. Upload any image and
              get a structured graph representation of the scene.
            </MotionTypography>

            {/* CTA Button */}
            <MotionBox
              variants={itemVariants}
              sx={{ display: "flex", justifyContent: "center", gap: 2 }}
            >
              <Button
                component={RouterLink}
                to="/inference"
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  py: 1.5,
                  px: 4,
                  fontWeight: 600,
                  fontSize: "1rem",
                }}
              >
                Generate Scene Graph
              </Button>

              <Button
                variant="outlined"
                size="large"
                component="a"
                href="https://github.com/dixisouls/scene-graph-generation"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  py: 1.5,
                  px: 3,
                  fontWeight: 600,
                }}
              >
                View on GitHub
              </Button>
            </MotionBox>
          </MotionBox>
        </Box>
      </Container>

      {/* Decorative elements */}
      {!isMedium && (
        <>
          <MotionPaper
            variants={decorationVariants}
            initial="hidden"
            animate="visible"
            elevation={4}
            sx={{
              position: "absolute",
              top: "15%",
              left: "5%",
              width: 60,
              height: 60,
              borderRadius: 2,
              bgcolor: "primary.main",
              transform: "rotate(25deg)",
              display: { xs: "none", md: "block" },
            }}
          />

          <MotionPaper
            variants={decorationVariants}
            initial="hidden"
            animate="visible"
            elevation={4}
            sx={{
              position: "absolute",
              bottom: "20%",
              right: "8%",
              width: 40,
              height: 40,
              borderRadius: 3,
              bgcolor: "secondary.main",
              transform: "rotate(-15deg)",
              display: { xs: "none", md: "block" },
            }}
          />

          <MotionPaper
            variants={decorationVariants}
            initial="hidden"
            animate="visible"
            elevation={2}
            sx={{
              position: "absolute",
              bottom: "10%",
              left: "12%",
              width: 30,
              height: 30,
              borderRadius: "50%",
              bgcolor: "info.main",
              display: { xs: "none", md: "block" },
            }}
          />
        </>
      )}
    </Box>
  );
};

export default HeroSection;
