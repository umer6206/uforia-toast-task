import React, { useState, useEffect } from "react";
import { Snackbar, Button, Box, Typography, Paper } from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

const Toast = ({
  formSubmission,
  onLike,
  onDismiss,
  autoHideDuration = 6000,
}) => {
  const [open, setOpen] = useState(true);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    // Add a small delay to allow the closing animation to complete
    setTimeout(() => {
      onDismiss(formSubmission.id);
    }, 300);
  };

  const handleLike = () => {
    setOpen(false);
    // Add a small delay to allow the closing animation to complete
    setTimeout(() => {
      onLike(formSubmission);
    }, 300);
  };

  // Auto close after specified duration
  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false);
      // Add a small delay to allow the closing animation to complete
      setTimeout(() => {
        onDismiss(formSubmission.id);
      }, 300);
    }, autoHideDuration);

    return () => clearTimeout(timer);
  }, [formSubmission.id, autoHideDuration, onDismiss]);

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 2,
          minWidth: "300px",
          maxWidth: "400px",
          backgroundColor: "#f5f5f5",
          borderLeft: "4px solid #3f51b5",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            New Form Submission
          </Typography>
          <IconButton size="small" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ mt: 1 }}>
          <Typography variant="body2">
            <strong>Name:</strong> {formSubmission.data.firstName}{" "}
            {formSubmission.data.lastName}
          </Typography>
          <Typography variant="body2">
            <strong>Email:</strong> {formSubmission.data.email}
          </Typography>
        </Box>

        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            size="small"
            color="primary"
            startIcon={<ThumbUpAltIcon />}
            onClick={handleLike}
          >
            Like
          </Button>
        </Box>
      </Paper>
    </Snackbar>
  );
};

export default Toast;
