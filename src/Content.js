import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useToast } from "./context/ToastContext";
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
} from "@mui/material";

export default function Content() {
  const { likedSubmissions, loading, error } = useToast();

  if (loading) {
    return (
      <Box sx={{ marginTop: 3, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ marginTop: 3 }}>
        <Typography variant="h4">Liked Form Submissions</Typography>
        <Paper sx={{ marginTop: 2, padding: 2, backgroundColor: "#ffebee" }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ marginTop: 3 }}>
      <Typography variant="h4">Liked Form Submissions</Typography>

      {likedSubmissions.length === 0 ? (
        <Typography variant="body1" sx={{ fontStyle: "italic", marginTop: 1 }}>
          No liked submissions yet. Like a submission to see it here!
        </Typography>
      ) : (
        <Paper sx={{ marginTop: 2 }}>
          <List>
            {likedSubmissions.map((submission, index) => (
              <React.Fragment key={submission.id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={`${submission.data.firstName} ${submission.data.lastName}`}
                    secondary={submission.data.email}
                  />
                </ListItem>
                {index < likedSubmissions.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}
