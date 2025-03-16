import React from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";

// Neural Network Animation Component
const NeuralNetworkAnimation = () => {
  const theme = useTheme();

  // Define animation variants for nodes
  const nodeVariants = {
    pulse: {
      scale: [1, 1.15, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

  // Define animation variants for connections
  const connectionVariants = {
    flow: {
      pathLength: [0, 1],
      opacity: [0.3, 0.8, 0.3],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const layerColors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.info.main,
  ];

  return (
    <Box sx={{ width: "100%", maxWidth: 500, mx: "auto", overflow: "hidden" }}>
      <Box sx={{ p: 2, position: "relative", height: 280 }}>
        <motion.svg
          viewBox="0 0 500 250"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Input Layer */}
          {[40, 80, 120, 160, 200].map((y, i) => (
            <motion.circle
              key={`input-${i}`}
              cx="100"
              cy={y}
              r="12"
              fill={layerColors[0]}
              variants={nodeVariants}
              animate="pulse"
              custom={i}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: i * 0.2,
              }}
            />
          ))}

          {/* Hidden Layer */}
          {[60, 100, 140, 180].map((y, i) => (
            <motion.circle
              key={`hidden-${i}`}
              cx="250"
              cy={y}
              r="12"
              fill={layerColors[1]}
              variants={nodeVariants}
              animate="pulse"
              custom={i}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: i * 0.3 + 0.1,
              }}
            />
          ))}

          {/* Output Layer */}
          {[80, 120, 160].map((y, i) => (
            <motion.circle
              key={`output-${i}`}
              cx="400"
              cy={y}
              r="12"
              fill={layerColors[2]}
              variants={nodeVariants}
              animate="pulse"
              custom={i}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: i * 0.4 + 0.2,
              }}
            />
          ))}

          {/* Connections from Input to Hidden */}
          {[40, 80, 120, 160, 200].map((inputY, i) =>
            [60, 100, 140, 180].map((hiddenY, j) => (
              <motion.line
                key={`in-hidden-${i}-${j}`}
                x1="100"
                y1={inputY}
                x2="250"
                y2={hiddenY}
                stroke={theme.palette.grey[400]}
                strokeWidth="1.5"
                variants={connectionVariants}
                animate="flow"
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: (i * 0.1 + j * 0.1) % 1,
                }}
                style={{ opacity: 0.3 }}
              />
            ))
          )}

          {/* Connections from Hidden to Output */}
          {[60, 100, 140, 180].map((hiddenY, i) =>
            [80, 120, 160].map((outputY, j) => (
              <motion.line
                key={`hidden-out-${i}-${j}`}
                x1="250"
                y1={hiddenY}
                x2="400"
                y2={outputY}
                stroke={theme.palette.grey[400]}
                strokeWidth="1.5"
                variants={connectionVariants}
                animate="flow"
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: (i * 0.1 + j * 0.1 + 0.5) % 1,
                }}
                style={{ opacity: 0.3 }}
              />
            ))
          )}

          {/* Data flow animation */}
          <motion.circle
            cx="100"
            cy="120"
            r="5"
            fill={theme.palette.common.white}
            filter="drop-shadow(0 0 3px rgba(0,0,0,0.3))"
            animate={{
              x: [0, 150, 300],
              y: [0, 20, -20],
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "loop",
              times: [0, 0.5, 1],
              ease: "easeInOut",
            }}
          />

          <motion.circle
            cx="100"
            cy="160"
            r="5"
            fill={theme.palette.common.white}
            filter="drop-shadow(0 0 3px rgba(0,0,0,0.3))"
            animate={{
              x: [0, 150, 300],
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "loop",
              times: [0, 0.5, 1],
              delay: 1,
              ease: "easeInOut",
            }}
          />

          <motion.circle
            cx="100"
            cy="80"
            r="5"
            fill={theme.palette.common.white}
            filter="drop-shadow(0 0 3px rgba(0,0,0,0.3))"
            animate={{
              x: [0, 150, 300],
              y: [0, 60, 40],
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "loop",
              times: [0, 0.5, 1],
              delay: 2,
              ease: "easeInOut",
            }}
          />
        </motion.svg>
      </Box>
    </Box>
  );
};

const LoadingAnimation = ({
  message = "Processing your image...",
  subMessage = "This may take a moment...",
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        textAlign: "center",
        borderRadius: 4,
        bgcolor: "background.paper",
        maxWidth: 600,
        mx: "auto",
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
      }}
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ mb: 4 }}>
        <NeuralNetworkAnimation />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 2,
        }}
      >
        <CircularProgress size={20} thickness={4} sx={{ mr: 2 }} />
        <Typography
          variant="h5"
          component={motion.h5}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          color="text.primary"
          fontWeight={600}
        >
          {message}
        </Typography>
      </Box>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ maxWidth: 400, mx: "auto" }}
        component={motion.p}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {subMessage}
      </Typography>

      <Box
        sx={{
          mt: 4,
          height: 4,
          bgcolor: "grey.100",
          borderRadius: 2,
          overflow: "hidden",
          maxWidth: 400,
          mx: "auto",
        }}
      >
        <Box
          component={motion.div}
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
          }}
          sx={{
            width: "30%",
            height: "100%",
            background:
              "linear-gradient(90deg, rgba(63,81,181,0.1) 0%, rgba(63,81,181,0.6) 50%, rgba(63,81,181,0.1) 100%)",
            borderRadius: 2,
          }}
        />
      </Box>
    </Paper>
  );
};

export default LoadingAnimation;
