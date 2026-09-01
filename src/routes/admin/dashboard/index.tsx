"use client";

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import GroupIcon from "@mui/icons-material/Group";
import SchoolIcon from "@mui/icons-material/School";
import EventIcon from "@mui/icons-material/Event";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AssignmentIcon from "@mui/icons-material/Assignment";
import StarIcon from "@mui/icons-material/Star";
import { useRouter } from "next/navigation";

import ProtectedRoute from "../../../components/route/route";
import StatCard from "../../../components/stats/stats";
import Loading from "../../../components/loading/loading";
import { useAuth } from "../../../context/auth_context";
import { useStudents } from "../../../hooks/use_students";
import { getStudentStats } from "../../../utils/stats";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { students, loading } = useStudents();

  const stats = getStudentStats(students);

  const managementSections = [
    {
      title: "Students",
      description: "Manage student records, enrollment, and grades.",
      path: "/students",
      icon: <PeopleIcon sx={{ fontSize: 36, color: "primary.main" }} />,
    },
    {
      title: "Trainers",
      description: "Manage trainer profiles and assigned batches.",
      path: "/trainers",
      icon: <GroupIcon sx={{ fontSize: 36, color: "secondary.main" }} />,
    },
    {
      title: "Courses",
      description: "Manage courses, syllabi, and schedules.",
      path: "/courses",
      icon: <SchoolIcon sx={{ fontSize: 36, color: "info.main" }} />,
    },
    {
      title: "Events",
      description: "Manage upcoming events, workshops, and holidays.",
      path: "/events",
      icon: <EventIcon sx={{ fontSize: 36, color: "warning.main" }} />,
    },
    {
      title: "Calendar",
      description: "View scheduled sessions and timeline.",
      path: "/calendar",
      icon: <CalendarMonthIcon sx={{ fontSize: 36, color: "success.main" }} />,
    },
  ];

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
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
          Admin Dashboard
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
          <Loading />
        ) : (
          <>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 2 }}
            >
              Overview Statistics
            </Typography>

            <Grid container spacing={2.5} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                <StatCard title="Total Students" value={stats.totalStudents} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                <StatCard title="Active Students" value={stats.activeStudents} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                <StatCard title="Completed Students" value={stats.completedStudents} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                <StatCard title="Average Score" value={`${Math.round(stats.averageScore)}%`} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                <StatCard title="Pending Assignments" value={stats.pendingAssignments} />
              </Grid>
            </Grid>

            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 2 }}
            >
              Quick Management
            </Typography>

            <Grid container spacing={3}>
              {managementSections.map((item) => (
                <Grid key={item.title} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card sx={{ height: "100%", transition: "transform 0.2s", "&:hover": { transform: "translateY(-4px)" } }}>
                    <CardActionArea
                      onClick={() => router.push(item.path)}
                      sx={{ p: 2, height: "100%" }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                        {item.icon}
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
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