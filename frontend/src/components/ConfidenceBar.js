import React, { useEffect, useState } from "react";
import { Box, Typography, LinearProgress, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";

// Custom styled LinearProgress with gradient coloring based on confidence value
const StyledLinearProgress = styled(LinearProgress)(({ theme, value }) => {
  // Calculate color gradient based on value
  const getColorForValue = (val) => {
    if (val < 30) return theme.palette.error.main;
    if (val < 70) return theme.palette.warning.main;
    return theme.palette.success.main;
  };

  return {
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.palette.grey[200],
    "& .MuiLinearProgress-bar": {
      borderRadius: 5,
      backgroundColor: getColorForValue(value),
    },
  };
});

// Wrapper component with animation
const AnimatedBox = ({ children, delay = 0 }) => (
  <Box
    component={motion.div}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    sx={{ mb: 1 }}
  >
    {children}
  </Box>
);

const ConfidenceBar = ({ label, value, index = 0, showValueText = true }) => {
  const [progress, setProgress] = useState(0);

  // Animate progress value
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(value * 100);
    }, 100 * index); // Staggered animation

    return () => {
      clearTimeout(timer);
    };
  }, [value, index]);

  return (
    <AnimatedBox delay={0.1 * index}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
        <Typography variant="body2" fontWeight={500}>
          {label}
        </Typography>
        {showValueText && (
          <Typography variant="body2" color="text.secondary">
            {Math.round(progress)}%
          </Typography>
        )}
      </Box>
      <StyledLinearProgress
        variant="determinate"
        value={progress}
        value-text={`${Math.round(progress)}%`}
      />
    </AnimatedBox>
  );
};

const ConfidenceBarGroup = ({
  data,
  title,
  emptyMessage = "No data available",
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        bgcolor: "background.paper",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{ borderBottom: "1px solid", borderColor: "divider", pb: 1, mb: 2 }}
      >
        {title}
      </Typography>

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
        <Typography
          color="text.secondary"
          variant="body2"
          sx={{ py: 2, textAlign: "center" }}
        >
          {emptyMessage}
        </Typography>
      )}
    </Paper>
  );
};

export { ConfidenceBar, ConfidenceBarGroup };
