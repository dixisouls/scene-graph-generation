import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  useTheme,
  IconButton,
  Tooltip,
  CircularProgress,
  Fade,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import { styled } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

// Styled components
const UploadBox = styled(Box)(
  ({ theme, isDragActive, isDragReject, hasFile }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(3),
    borderWidth: 2,
    borderRadius: 16,
    borderColor: isDragReject
      ? theme.palette.error.main
      : isDragActive
      ? theme.palette.primary.main
      : hasFile
      ? theme.palette.success.main
      : theme.palette.divider,
    borderStyle: "dashed",
    backgroundColor: isDragActive
      ? theme.palette.action.hover
      : hasFile
      ? "rgba(76, 175, 80, 0.04)"
      : theme.palette.background.paper,
    color: theme.palette.text.secondary,
    outline: "none",
    transition: "all 0.24s ease-in-out",
    cursor: "pointer",
    minHeight: 220,
    position: "relative",
    "&:hover": {
      borderColor: hasFile
        ? theme.palette.success.main
        : theme.palette.primary.main,
      backgroundColor: hasFile
        ? "rgba(76, 175, 80, 0.08)"
        : "rgba(0, 0, 0, 0.02)",
    },
  })
);

const PreviewContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  height: "100%",
  borderRadius: 8,
  overflow: "hidden",
  backgroundColor: theme.palette.background.default,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

const PreviewImage = styled("img")(({ theme }) => ({
  maxWidth: "100%",
  maxHeight: "180px",
  objectFit: "contain",
  borderRadius: 8,
}));

const FileUploader = ({
  onFileSelect,
  acceptedTypes = { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
  maxSize = 10 * 1024 * 1024, // 10MB
  initialFile = null,
}) => {
  const theme = useTheme();
  const [file, setFile] = useState(initialFile);
  const [preview, setPreview] = useState("");
  const [fileError, setFileError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle file drop
  const onDrop = useCallback(
    (acceptedFiles) => {
      setFileError("");
      setLoading(true);

      if (acceptedFiles.length === 0) {
        setLoading(false);
        return;
      }

      const selectedFile = acceptedFiles[0];

      // Check file size
      if (selectedFile.size > maxSize) {
        setFileError(
          `File size should be less than ${Math.round(
            maxSize / (1024 * 1024)
          )}MB`
        );
        setLoading(false);
        return;
      }

      // Create preview
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);

      // Set file with a small delay to show loading
      setTimeout(() => {
        setFile(selectedFile);
        setLoading(false);

        // Notify parent component
        if (onFileSelect) {
          onFileSelect(selectedFile);
        }
      }, 800);

      // Clean up the preview URL when component unmounts
      return () => URL.revokeObjectURL(objectUrl);
    },
    [maxSize, onFileSelect]
  );

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // Initialize the file uploader with React-Dropzone
  const { getRootProps, getInputProps, isDragActive, isDragReject, open } =
    useDropzone({
      onDrop,
      accept: acceptedTypes,
      maxFiles: 1,
      noClick: file !== null,
      noKeyboard: file !== null,
    });

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setFile(null);
    setPreview("");
    setFileError("");

    // Notify parent component
    if (onFileSelect) {
      onFileSelect(null);
    }
  };

  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Box sx={{ width: "100%" }}>
      <UploadBox
        {...getRootProps()}
        isDragActive={isDragActive}
        isDragReject={isDragReject}
        hasFile={!!file}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <CircularProgress size={40} thickness={4} />
              <Typography variant="body2" sx={{ mt: 2 }}>
                Processing...
              </Typography>
            </motion.div>
          ) : file ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{ width: "100%", height: "100%", position: "relative" }}
            >
              <Box
                sx={{
                  position: "relative",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <PreviewContainer>
                  <PreviewImage src={preview} alt="Preview" />
                </PreviewContainer>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    mt: 2,
                    bgcolor: "background.default",
                    p: 1.5,
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <InsertDriveFileOutlinedIcon
                      color="primary"
                      sx={{ mr: 1, fontSize: 20 }}
                    />
                    <Box>
                      <Typography
                        variant="body2"
                        fontWeight={500}
                        noWrap
                        sx={{ maxWidth: 200 }}
                      >
                        {file.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatFileSize(file.size)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Tooltip title="Remove file">
                      <IconButton
                        size="small"
                        onClick={handleRemoveFile}
                        sx={{
                          bgcolor: "error.light",
                          color: "white",
                          "&:hover": { bgcolor: "error.main" },
                        }}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Change file">
                      <IconButton
                        size="small"
                        onClick={open}
                        sx={{
                          ml: 1,
                          bgcolor: "primary.light",
                          color: "white",
                          "&:hover": { bgcolor: "primary.main" },
                        }}
                      >
                        <AddPhotoAlternateIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  bgcolor: "primary.light",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                  boxShadow: "0 8px 20px rgba(63, 81, 181, 0.2)",
                  backgroundImage:
                    "linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)",
                }}
                component={motion.div}
                animate={{
                  y: [0, -10, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                }}
              >
                <CloudUploadIcon sx={{ fontSize: 40 }} />
              </Box>

              <Typography
                variant="body1"
                gutterBottom
                align="center"
                fontWeight={500}
              >
                Drag & drop your image here
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                sx={{ mb: 2 }}
              >
                - OR -
              </Typography>

              <Button
                variant="contained"
                onClick={open}
                startIcon={<AddPhotoAlternateIcon />}
              >
                Browse Files
              </Button>

              <Typography
                variant="caption"
                color="text.secondary"
                align="center"
                sx={{ mt: 2 }}
              >
                Supported formats: JPEG, PNG, WebP (Max{" "}
                {Math.round(maxSize / (1024 * 1024))}MB)
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>
      </UploadBox>

      <Fade in={!!fileError}>
        <Typography
          color="error"
          variant="body2"
          sx={{ mt: 1, display: "flex", alignItems: "center" }}
        >
          {fileError}
        </Typography>
      </Fade>
    </Box>
  );
};

export default FileUploader;
