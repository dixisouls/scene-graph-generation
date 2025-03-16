import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  useScrollTrigger,
  Slide,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
  Avatar,
} from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import GitHubIcon from "@mui/icons-material/GitHub";
import { motion } from "framer-motion";

// Hide navbar on scroll down
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

// Helper for animations
const MotionBox = motion(Box);

const Navbar = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Detect scroll for styling
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Scene Graph Generator", path: "/inference" },
  ];

  const drawer = (
    <Box sx={{ textAlign: "center", py: 2 }}>
      <Box
        sx={{
          my: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Avatar
          sx={{
            bgcolor: "primary.main",
            width: 40,
            height: 40,
            mr: 1,
            backgroundImage:
              "linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)",
          }}
        >
          <AccountTreeIcon fontSize="small" />
        </Avatar>
        <Typography variant="h6" color="inherit" fontWeight={700}>
          Scene Graph
        </Typography>
      </Box>
      <List sx={{ pt: 2 }}>
        {navItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={item.path}
              sx={{
                textAlign: "center",
                color:
                  location.pathname === item.path
                    ? "primary.main"
                    : "text.primary",
                fontWeight: location.pathname === item.path ? 600 : 400,
                py: 1.5,
              }}
              onClick={handleDrawerToggle}
            >
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <HideOnScroll>
      <AppBar
        position="sticky"
        color="default"
        elevation={isScrolled ? 2 : 0}
        sx={{
          bgcolor: isScrolled ? "rgba(255, 255, 255, 0.95)" : "transparent",
          backdropFilter: isScrolled ? "blur(20px)" : "none",
          transition: "all 0.3s ease",
          borderBottom: isScrolled ? "none" : "1px solid",
          borderColor: "divider",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: { xs: "70px" } }}>
            {/* Mobile menu button */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo and title */}
            <MotionBox
              sx={{
                display: "flex",
                alignItems: "center",
                flexGrow: { xs: 1, md: 0 },
                mr: 4,
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  width: 40,
                  height: 40,
                  mr: 1.5,
                  backgroundImage:
                    "linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)",
                  boxShadow: "0 4px 14px rgba(63, 81, 181, 0.2)",
                }}
              >
                <AccountTreeIcon fontSize="small" />
              </Avatar>
              <Typography
                variant="h6"
                component={RouterLink}
                to="/"
                sx={{
                  fontWeight: 700,
                  color: "text.primary",
                  textDecoration: "none",
                  display: "flex",
                  letterSpacing: "-0.01em",
                }}
              >
                Scene Graph
              </Typography>
            </MotionBox>

            {/* Desktop Navigation */}
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                justifyContent: "center",
              }}
            >
              {navItems.map((item, index) => (
                <MotionBox
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                >
                  <Button
                    component={RouterLink}
                    to={item.path}
                    sx={{
                      mx: 1,
                      color:
                        location.pathname === item.path
                          ? "primary.main"
                          : "text.primary",
                      fontWeight: location.pathname === item.path ? 600 : 500,
                      position: "relative",
                      py: 1,
                      "&::after":
                        location.pathname === item.path
                          ? {
                              content: '""',
                              position: "absolute",
                              bottom: "6px",
                              left: "10px",
                              right: "10px",
                              height: "3px",
                              bgcolor: "primary.main",
                              borderRadius: "3px",
                              backgroundImage:
                                "linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)",
                            }
                          : {},
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.02)",
                        transform: "translateY(0)",
                        boxShadow: "none",
                      },
                    }}
                  >
                    {item.name}
                  </Button>
                </MotionBox>
              ))}
            </Box>

            {/* Right side actions */}
            <MotionBox
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <IconButton
                color="inherit"
                aria-label="github"
                href="https://github.com/dixisouls/scene-graph-generation"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  bgcolor: "rgba(0, 0, 0, 0.05)",
                  "&:hover": { bgcolor: "rgba(0, 0, 0, 0.1)" },
                }}
              >
                <GitHubIcon />
              </IconButton>

              {!isMobile && (
                <Button
                  variant="contained"
                  color="primary"
                  component={RouterLink}
                  to="/inference"
                  sx={{ ml: 1 }}
                >
                  Try it now
                </Button>
              )}
            </MotionBox>
          </Toolbar>
        </Container>

        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 280,
              bgcolor: "background.paper",
              borderRadius: "0 16px 16px 0",
            },
          }}
        >
          {drawer}
        </Drawer>
      </AppBar>
    </HideOnScroll>
  );
};

export default Navbar;
