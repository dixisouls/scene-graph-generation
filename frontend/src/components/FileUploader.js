import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  useTheme,
  IconButton,
  Tooltip,
  Paper,
  Fade,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

// Styled components for consistent styling
const UploadContainer = styled(Paper)(({ theme }) => ({
  width: "100%",
  borderRadius: 16,
  overflow: "hidden",
  boxShadow: "none",
  border: `2px dashed ${theme.palette.divider}`,
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  transition: "all 0.3s ease",
  minHeight: 220,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  cursor: "pointer",
  "&:hover": {
    borderColor: theme.palette.primary.main,
    backgroundColor: "rgba(0, 0, 0, 0.01)",
  },
}));

const UploadContainerWithFile = styled(Paper)(({ theme }) => ({
  width: "100%",
  borderRadius: 16,
  overflow: "hidden",
  boxShadow: "none",
  border: `2px dashed ${theme.palette.success.main}`,
  padding: theme.spacing(3),
  backgroundColor: "rgba(76, 175, 80, 0.04)",
  transition: "all 0.3s ease",
  minHeight: 220,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
}));

const PreviewContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "180px",
  borderRadius: 8,
  overflow: "hidden",
  backgroundColor: theme.palette.background.default,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: theme.spacing(2),
}));

const PreviewImage = styled("img")({
  maxWidth: "100%",
  maxHeight: "100%",
  objectFit: "contain",
});

const FileInfoBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  padding: theme.spacing(1.5),
  borderRadius: 8,
  backgroundColor: theme.palette.background.default,
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
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
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Process a file after it's selected
  const processFile = useCallback(
    (selectedFile) => {
      // Reset error state
      setFileError("");

      // Check file size
      if (selectedFile.size > maxSize) {
        setFileError(
          `File size should be less than ${Math.round(
            maxSize / (1024 * 1024)
          )}MB`
        );
        return;
      }

      // Create preview
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
      setFile(selectedFile);

      // Notify parent component
      if (onFileSelect) {
        onFileSelect(selectedFile);
      }
    },
    [maxSize, onFileSelect]
  );

  // Handle file selection from the input
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      processFile(event.target.files[0]);
    }
  };

  // Handle manual browse button click
  const handleBrowseClick = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Clean up on unmount or when preview changes
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // Handle file removal
  const handleRemoveFile = (e) => {
    e.stopPropagation();
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview("");
    setFileError("");

    // Notify parent component
    if (onFileSelect) {
      onFileSelect(null);
    }
  };

  // Handle change file
  const handleChangeFile = (e) => {
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.click();
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
      {/* Hidden direct file input for more direct control */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpeg,.jpg,.png,.webp,image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {file ? (
        // File preview when a file is selected
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <UploadContainerWithFile>
            <PreviewContainer>
              <PreviewImage src={preview} alt="Preview" />
            </PreviewContainer>

            <FileInfoBox>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <InsertDriveFileOutlinedIcon
                  color="primary"
                  sx={{ mr: 1.5, fontSize: 20 }}
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
                      mr: 1,
                      width: 32,
                      height: 32,
                    }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Change file">
                  <IconButton
                    size="small"
                    onClick={handleChangeFile}
                    sx={{
                      bgcolor: "primary.light",
                      color: "white",
                      "&:hover": { bgcolor: "primary.main" },
                      width: 32,
                      height: 32,
                    }}
                  >
                    <AddPhotoAlternateIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </FileInfoBox>
          </UploadContainerWithFile>
        </motion.div>
      ) : (
        // Upload area when no file is selected
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <UploadContainer
            onClick={handleBrowseClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            sx={{
              borderColor: dragOver ? "primary.main" : "divider",
              bgcolor: dragOver
                ? "rgba(63, 81, 181, 0.04)"
                : "background.paper",
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                bgcolor: "primary.main",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
                boxShadow: "0 6px 16px rgba(63, 81, 181, 0.2)",
                backgroundImage:
                  "linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)",
              }}
              component={motion.div}
              animate={{
                y: [0, -8, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut",
              }}
            >
              <CloudUploadIcon sx={{ fontSize: 36 }} />
            </Box>

            <Typography
              variant="body1"
              gutterBottom
              align="center"
              fontWeight={500}
              sx={{ mb: 1 }}
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
              onClick={handleBrowseClick}
              startIcon={<AddPhotoAlternateIcon />}
              sx={{
                px: 3,
                py: 1,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                boxShadow: "0 4px 12px rgba(63, 81, 181, 0.2)",
              }}
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
          </UploadContainer>
        </motion.div>
      )}

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
