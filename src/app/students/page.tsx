"use client";

import { Box, Typography, Paper } from "@mui/material";

export default function StudentsPage() {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Students
      </Typography>

      <Paper sx={{ padding: 3 }}>
        <Typography variant="body1">
          Student list will appear here.
        </Typography>
      </Paper>
    </Box>
  );
}