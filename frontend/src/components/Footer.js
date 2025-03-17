import React from "react";
import {
  Box,
  Typography,
  Container,
  Link,
  Grid,
  Button,
  Divider,
  Avatar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box component="footer" sx={{ mt: "auto" }}>
      <Box
        sx={{
          py: 6,
          px: 2,
          bgcolor:
            theme.palette.mode === "light"
              ? "rgba(63, 81, 181, 0.03)"
              : "rgba(255, 255, 255, 0.05)",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar
                    sx={{
                      bgcolor: "primary.main",
                      width: 40,
                      height: 40,
                      mr: 1.5,
                      backgroundImage:
                        "linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)",
                    }}
                  >
                    <AccountTreeIcon fontSize="small" />
                  </Avatar>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    letterSpacing="-0.01em"
                  >
                    Scene Graph
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  An advanced tool for generating scene graphs from images using
                  deep learning. Analyze objects and their relationships to
                  create structured graph representations.
                </Typography>
                <Box sx={{ display: "flex", gap: 1, mt: 3 }}>
                  <Link
                    href="https://github.com/dixisouls"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ textDecoration: "none" }}
                  >
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<GitHubIcon />}
                      sx={{ borderRadius: 2 }}
                    >
                      GitHub
                    </Button>
                  </Link>
                </Box>
              </MotionBox>
            </Grid>

            <Grid item xs={6} md={2}>
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Navigation
                </Typography>
                <Box component="ul" sx={{ pl: 0, listStyle: "none", m: 0 }}>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Link
                      component={RouterLink}
                      to="/"
                      color="text.secondary"
                      sx={{
                        textDecoration: "none",
                        "&:hover": { color: "primary.main" },
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <ArrowForwardIcon
                        sx={{ fontSize: 14, mr: 0.5, opacity: 0.7 }}
                      />
                      Home
                    </Link>
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Link
                      component={RouterLink}
                      to="/inference"
                      color="text.secondary"
                      sx={{
                        textDecoration: "none",
                        "&:hover": { color: "primary.main" },
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <ArrowForwardIcon
                        sx={{ fontSize: 14, mr: 0.5, opacity: 0.7 }}
                      />
                      Scene Graph Generator
                    </Link>
                  </Box>
                </Box>
              </MotionBox>
            </Grid>

            <Grid item xs={6} md={2}>
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Resources
                </Typography>
                <Box component="ul" sx={{ pl: 0, listStyle: "none", m: 0 }}>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Link
                      href="https://github.com/dixisouls/scene-graph-generation"
                      target="_blank"
                      color="text.secondary"
                      sx={{
                        textDecoration: "none",
                        "&:hover": { color: "primary.main" },
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <ArrowForwardIcon
                        sx={{ fontSize: 14, mr: 0.5, opacity: 0.7 }}
                      />
                      Documentation
                    </Link>
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Link
                      href="https://github.com/dixisouls/scene-graph-generation/issues"
                      target="_blank"
                      color="text.secondary"
                      sx={{
                        textDecoration: "none",
                        "&:hover": { color: "primary.main" },
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <ArrowForwardIcon
                        sx={{ fontSize: 14, mr: 0.5, opacity: 0.7 }}
                      />
                      Report Issues
                    </Link>
                  </Box>
                </Box>
              </MotionBox>
            </Grid>

            <Grid item xs={12} md={4}>
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Try Scene Graph Generation
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Upload your images and discover the relationships between
                  objects.
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    component={RouterLink}
                    to="/inference"
                    endIcon={<ArrowForwardIcon />}
                    fullWidth={isMobile}
                  >
                    Get Started
                  </Button>
                </Box>
              </MotionBox>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                © {new Date().getFullYear()} Scene Graph Generator.
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              sx={{
                mt: { xs: 2, sm: 0 },
                textAlign: { xs: "left", sm: "right" },
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Created by{" "}
                <Link
                  href="https://dixisouls.github.io/portfolio/"
                  color="primary.main"
                  underline="hover"
                >
                  Divya Panchal
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;
