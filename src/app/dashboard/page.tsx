"use client";

import {
  Box,
  Typography,
  Alert,
  Button,
} from "@mui/material";

import StatCard from
  "../../components/stats/stats";

import Loading from
  "../../components/loading/loading";

import {
  useStudents,
} from "../../hooks/use_students";

import {
  getStudentStats,
} from "../../utils/stats";

export default function DashboardPage() {
  const {
    students,
    loading,
    error,
    refreshStudents,
  } = useStudents();

  if (loading) {
    return (
      <Loading message="Loading dashboard..." />
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: 3 }}>
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              onClick={
                refreshStudents
              }
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  const stats =
    getStudentStats(
      students
    );

  return (
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
        gutterBottom
      >
        Dashboard
      </Typography>

      <Typography
        color="text.secondary"
        sx={{
          marginBottom: 3,
        }}
      >
        Student Management Overview
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            lg: "repeat(5, 1fr)",
          },
          gap: 2,
        }}
      >
        <StatCard
          title="Total Students"
          value={
            stats.totalStudents
          }
        />

        <StatCard
          title="Active Students"
          value={
            stats.activeStudents
          }
        />

        <StatCard
          title="Completed Students"
          value={
            stats.completedStudents
          }
        />

        <StatCard
          title="Average Score"
          value={`${stats.averageScore.toFixed(
            1
          )}%`}
        />

        <StatCard
          title="Pending Assignments"
          value={
            stats.pendingAssignments
          }
        />
      </Box>
    </Box>
  );
}