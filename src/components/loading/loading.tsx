"use client";

import {
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";

interface LoadingProps {
  message?: string;
}

export default function Loading({
  message = "Loading students...",
}: LoadingProps) {
  return (
    <Box
      sx={{
        minHeight: 250,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <CircularProgress />

      <Typography color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}