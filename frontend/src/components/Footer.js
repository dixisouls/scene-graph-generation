import React from "react";
import { Box, Typography, Container, Link, Grid } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import AccountTreeIcon from "@mui/icons-material/AccountTree";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: (theme) => theme.palette.grey[100],
      }}
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={3}
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item xs={12} sm={6} md={4}>
            <Box display="flex" alignItems="center">
              <AccountTreeIcon sx={{ mr: 1 }} />
              <Typography variant="h6" color="text.primary">
                Scene Graph
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Scene graph generation using deep learning
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4} textAlign="center">
            <Typography variant="body2" color="text.secondary">
              {"© "}
              {new Date().getFullYear()}
              {" Scene Graph Generator. All rights reserved."}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4} textAlign="right">
            <Link
              href="https://github.com/dixisouls"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                transition: "color 0.2s",
                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              <GitHubIcon sx={{ mr: 0.5 }} />
              <Typography variant="body2">dixisouls</Typography>
            </Link>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
