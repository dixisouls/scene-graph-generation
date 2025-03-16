import React from "react";
import { Box, Typography, Button, Container, Paper } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import HomeIcon from "@mui/icons-material/Home";
import SearchOffIcon from "@mui/icons-material/SearchOff";

const NotFoundPage = () => {
  return (
    <Container
      maxWidth="md"
      sx={{ display: "flex", flexGrow: 1, alignItems: "center", py: 8 }}
    >
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Paper
          elevation={1}
          sx={{
            p: 6,
            borderRadius: 4,
            maxWidth: 500,
            width: "100%",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background decoration */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 150,
              height: 150,
              bgcolor: "rgba(63, 81, 181, 0.05)",
              borderRadius: "0 0 0 100%",
              zIndex: 0,
            }}
          />

          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: 120,
              height: 120,
              bgcolor: "rgba(245, 0, 87, 0.05)",
              borderRadius: "0 100% 0 0",
              zIndex: 0,
            }}
          />

          {/* Content */}
          <Box sx={{ position: "relative", zIndex: 1 }}>
            {/* 404 Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Box
                sx={{
                  mb: 4,
                  display: "flex",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    bgcolor: "primary.light",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 25px rgba(63, 81, 181, 0.3)",
                    backgroundImage:
                      "linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)",
                  }}
                >
                  <SearchOffIcon sx={{ fontSize: 48, color: "white" }} />
                </Box>
              </Box>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 800,
                  mb: 2,
                  background:
                    "linear-gradient(135deg, #3f51b5 10%, #f50057 90%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "-0.05em",
                }}
              >
                404
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 600, mb: 2 }}
              >
                Page Not Found
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Typography
                variant="body1"
                color="text.secondary"
                paragraph
                sx={{ mb: 4 }}
              >
                The page you are looking for might have been removed, had its
                name changed, or is temporarily unavailable.
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                <Button
                  component={RouterLink}
                  to="/"
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<HomeIcon />}
                  sx={{ px: 3 }}
                >
                  Go to Home
                </Button>
                <Button
                  component={RouterLink}
                  to="/inference"
                  variant="outlined"
                  color="primary"
                  size="large"
                  startIcon={<AccountTreeIcon />}
                  sx={{ px: 3 }}
                >
                  Try Scene Graph
                </Button>
              </Box>
            </motion.div>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
