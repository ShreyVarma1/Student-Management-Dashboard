"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  LinearProgress,
  Typography,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import EventIcon from "@mui/icons-material/Event";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useRouter } from "next/navigation";

import ProtectedRoute from "../../../components/route/route";
import { useAuth } from "../../../context/auth_context";
import { studentAccountService } from "../../../services/students_account_services";
import type { Student } from "../../../types/students";

export default function StudentDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [student, setStudent] = useState<Student | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudent = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const result = await studentAccountService.getLinkedStudent(user);
        setStudent(result.student);
      } catch {
        setStudent(undefined);
      } finally {
        setLoading(false);
      }
    };

    loadStudent();
  }, [user]);

  const quickLinks = [
    {
      title: "My Profile",
      description: "View and verify your personal and contact info.",
      path: "/students/profile",
      icon: <PersonIcon sx={{ fontSize: 32, color: "primary.main" }} />,
    },
    {
      title: "My Courses",
      description: "Check your enrolled course details and batch.",
      path: "/students/courses",
      icon: <SchoolIcon sx={{ fontSize: 32, color: "secondary.main" }} />,
    },
    {
      title: "Events",
      description: "Stay updated on upcoming exams and seminars.",
      path: "/events",
      icon: <EventIcon sx={{ fontSize: 32, color: "warning.main" }} />,
    },
    {
      title: "Calendar",
      description: "View schedule and academic timetable.",
      path: "/calendar",
      icon: <CalendarMonthIcon sx={{ fontSize: 32, color: "success.main" }} />,
    },
  ];

  return (
    <ProtectedRoute allowedRoles={["student"]}>
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
            marginBottom: 1,
          }}
        >
          Student Dashboard
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            marginBottom: 4,
          }}
        >
          Welcome back, {user?.username}.
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : (
          <>
            {student ? (
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card sx={{ p: 1 }}>
                    <CardContent>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          Enrolled Course
                        </Typography>
                        <Chip
                          label={student.status}
                          color={
                            student.status === "Active"
                              ? "success"
                              : student.status === "Completed"
                              ? "primary"
                              : "default"
                          }
                          size="small"
                        />
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {student.course}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Batch: {student.batch} | Trainer: {student.trainer || "N/A"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Start Date: {student.startDate || "N/A"}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Card sx={{ p: 1 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                        Academic Performance
                      </Typography>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Score
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {student.score}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(student.score, 100)}
                        sx={{ height: 8, borderRadius: 4, mb: 2 }}
                      />
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" color="text.secondary">
                          Pending Assignments:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {student.pendingAssignments}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            ) : (
              <Alert severity="info" sx={{ mb: 4 }}>
                Your student profile record has not been linked to this email ({user?.email}) by the administrator yet.
              </Alert>
            )}

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Quick Navigation
            </Typography>

            <Grid container spacing={3}>
              {quickLinks.map((item) => (
                <Grid key={item.title} size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card sx={{ height: "100%", transition: "transform 0.2s", "&:hover": { transform: "translateY(-4px)" } }}>
                    <CardActionArea
                      onClick={() => router.push(item.path)}
                      sx={{ p: 2, height: "100%" }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                        {item.icon}
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          {item.title}
                        </Typography>
                      </Box>
                      <Typography color="text.secondary" variant="body2">
                        {item.description}
                      </Typography>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Box>
    </ProtectedRoute>
  );
}