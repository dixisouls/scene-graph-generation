import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  LinearProgress,
  Paper,
  Tooltip,
  useTheme,
  Card,
  CardHeader,
  CardContent,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

// Custom styled LinearProgress with gradient coloring based on confidence value
const StyledLinearProgress = styled(LinearProgress)(({ theme, value }) => {
  // Calculate color gradient based on value
  const getColorForValue = (val) => {
    if (val < 30) return theme.palette.error.main;
    if (val < 70) return theme.palette.warning.main;
    return theme.palette.success.main;
  };

  // Create gradient for the progress bar
  const getGradient = (val) => {
    if (val < 30) {
      return `linear-gradient(90deg, ${theme.palette.error.main} 0%, ${theme.palette.error.light} 100%)`;
    } else if (val < 70) {
      return `linear-gradient(90deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.light} 100%)`;
    } else {
      return `linear-gradient(90deg, ${theme.palette.success.main} 0%, ${theme.palette.success.light} 100%)`;
    }
  };

  return {
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.palette.grey[200],
    "& .MuiLinearProgress-bar": {
      borderRadius: 4,
      backgroundImage: getGradient(value),
      boxShadow: value > 50 ? `0 0 10px rgba(0, 0, 0, 0.1)` : "none",
    },
  };
});

// Wrapper component with animation
const AnimatedBox = ({ children, delay = 0, index = 0 }) => (
  <Box
    component={motion.div}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.05 * index + delay }}
    sx={{ mb: 1.5 }}
  >
    {children}
  </Box>
);

// Value indicator that appears at the end of the progress bar
const ValueIndicator = styled(Box)(({ theme, value }) => {
  const getColor = (val) => {
    if (val < 30) return theme.palette.error.main;
    if (val < 70) return theme.palette.warning.main;
    return theme.palette.success.main;
  };

  return {
    position: "absolute",
    right: "0",
    top: "-20px",
    backgroundColor: getColor(value),
    color: "#fff",
    padding: "2px 6px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "bold",
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
    transform: "translateX(50%)",
  };
});

const ConfidenceBar = ({ label, value, index = 0, showValueText = true }) => {
  const [progress, setProgress] = useState(0);
  const theme = useTheme();

  // Animate progress value
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(value * 100);
    }, 100 * index); // Staggered animation

    return () => {
      clearTimeout(timer);
    };
  }, [value, index]);

  // Get icon based on confidence
  const getConfidenceIcon = () => {
    if (progress > 70) {
      return (
        <TrendingUpIcon
          sx={{ fontSize: 16, color: theme.palette.success.main }}
        />
      );
    } else if (progress > 30) {
      return null;
    } else {
      return (
        <TrendingDownIcon
          sx={{ fontSize: 16, color: theme.palette.error.main }}
        />
      );
    }
  };

  return (
    <AnimatedBox delay={0.1} index={index}>
      <Box sx={{ position: "relative", mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 0.5,
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="body2"
              fontWeight={500}
              sx={{
                maxWidth: 200,
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </Typography>
            {getConfidenceIcon()}
          </Box>
          {showValueText && (
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={500}
            >
              {Math.round(progress)}%
            </Typography>
          )}
        </Box>
        <Box sx={{ position: "relative" }}>
          <StyledLinearProgress
            variant="determinate"
            value={progress}
            value-text={`${Math.round(progress)}%`}
          />
          {/* Circle indicator removed as requested */}
        </Box>
      </Box>
    </AnimatedBox>
  );
};

const ConfidenceBarGroup = ({
  data,
  title,
  emptyMessage = "No data available",
}) => {
  const theme = useTheme();

  // Calculate average confidence
  const averageConfidence =
    data && data.length > 0
      ? data.reduce((sum, item) => sum + item.score, 0) / data.length
      : 0;

  return (
    <Card
      elevation={1}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        transition: "all 0.3s ease",
        height: "100%",
      }}
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <CardHeader
        title={
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              {title}
            </Typography>
            {data && data.length > 0 && (
              <Tooltip title="Average confidence score">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    bgcolor:
                      averageConfidence > 0.7
                        ? "success.light"
                        : averageConfidence > 0.3
                        ? "warning.light"
                        : "error.light",
                    color: "white",
                    borderRadius: 5,
                    px: 1.5,
                    py: 0.5,
                    fontSize: "0.8rem",
                    fontWeight: 600,
                  }}
                >
                  <InfoOutlinedIcon sx={{ fontSize: 16, mr: 0.5 }} />
                  {(averageConfidence * 100).toFixed(0)}%
                </Box>
              </Tooltip>
            )}
          </Box>
        }
        sx={{
          bgcolor: "background.default",
          borderBottom: "1px solid",
          borderColor: "divider",
          pb: 1.5,
        }}
      />

      <CardContent sx={{ px: 2, py: 2 }}>
        {data && data.length > 0 ? (
          data.map((item, index) => (
            <ConfidenceBar
              key={`${item.label}-${index}`}
              label={item.label}
              value={item.score}
              index={index}
            />
          ))
        ) : (
          <Box
            sx={{
              py: 4,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: "background.default",
              borderRadius: 2,
              border: "1px dashed",
              borderColor: "divider",
            }}
          >
            <Typography color="text.secondary" variant="body2">
              {emptyMessage}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export { ConfidenceBar, ConfidenceBarGroup };
