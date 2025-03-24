import React from "react";
import { Box } from "@mui/material";
import Toast from "./Toast";
import { useToast } from "../context/ToastContext";

const ToastContainer = () => {
  const { toasts, likeSubmission, dismissToast } = useToast();

  return (
    <Box>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          formSubmission={toast}
          onLike={likeSubmission}
          onDismiss={dismissToast}
        />
      ))}
    </Box>
  );
};

export default ToastContainer;
