"use client";

import {
  Box,
  Typography,
} from "@mui/material";

import ProtectedRoute from
  "../../../components/route/route";

import {
  useAuth,
} from "../../../context/auth_context";

export default function StudentDashboardPage() {
  const {
    user,
  } = useAuth();

  return (
    <ProtectedRoute
      allowedRoles={["student"]}
    >
      <Box
        sx={{
          padding: {
            xs: 2,
            md: 4,
          },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            marginBottom: 2,
          }}
        >
          Student Dashboard
        </Typography>

        <Typography
          color="text.secondary"
        >
          Welcome, {user?.username}.
        </Typography>
      </Box>
    </ProtectedRoute>
  );
}