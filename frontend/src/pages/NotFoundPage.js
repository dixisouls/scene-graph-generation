import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";

const NotFoundPage = () => {
  return (
    <Container maxWidth="md">
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          py: 8,
        }}
      >
        {/* 404 SVG */}
        <Box sx={{ mb: 4, width: "100%", maxWidth: 400 }}>
          <svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M50,70 L110,70 L110,100 L80,100 L80,120 L110,120 L110,150 L50,150 L50,120 L80,120 L80,100 L50,100 Z"
              fill="#3f51b5"
              opacity="0.8"
            />
            <circle cx="155" cy="110" r="40" fill="#f50057" opacity="0.8" />
            <circle cx="240" cy="110" r="40" fill="#f50057" opacity="0.8" />
            <path
              d="M340,70 L400,70 L400,100 L370,100 L370,120 L400,120 L400,150 L340,150 L340,120 L370,120 L370,100 L340,100 Z"
              fill="#3f51b5"
              opacity="0.8"
            />
            <line
              x1="450"
              y1="70"
              x2="550"
              y2="150"
              stroke="#3f51b5"
              strokeWidth="20"
              strokeLinecap="round"
            />
            <line
              x1="550"
              y1="70"
              x2="450"
              y2="150"
              stroke="#3f51b5"
              strokeWidth="20"
              strokeLinecap="round"
            />
          </svg>
        </Box>

        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 700 }}
          component={motion.h1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Page Not Found
        </Typography>

        <Typography
          variant="h6"
          color="text.secondary"
          paragraph
          sx={{ maxWidth: 600, mb: 4 }}
          component={motion.p}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </Typography>

        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          sx={{ display: "flex", gap: 2 }}
        >
          <Button
            component={RouterLink}
            to="/"
            variant="contained"
            color="primary"
            size="large"
          >
            Go to Home
          </Button>
          <Button
            component={RouterLink}
            to="/inference"
            variant="outlined"
            color="primary"
            size="large"
          >
            Try Scene Graph
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
