"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  AppBar,
  Box,
  Button,
  Chip,
  Toolbar,
  Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupIcon from "@mui/icons-material/Group";
import SchoolIcon from "@mui/icons-material/School";
import EventIcon from "@mui/icons-material/Event";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { toast } from "react-toastify";

import { useAuth } from "../../context/auth_context";
import { authService } from "../../services/auth_services";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully.");
    router.replace("/login");
  };

  if (loading) {
    return null;
  }

  const adminNav: NavItem[] = [
    { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon fontSize="small" /> },
    { label: "Students", path: "/students", icon: <PeopleIcon fontSize="small" /> },
    { label: "Add Student", path: "/students/add", icon: <PersonAddIcon fontSize="small" /> },
    { label: "Trainers", path: "/trainers", icon: <GroupIcon fontSize="small" /> },
    { label: "Courses", path: "/courses", icon: <SchoolIcon fontSize="small" /> },
    { label: "Events", path: "/events", icon: <EventIcon fontSize="small" /> },
    { label: "Calendar", path: "/calendar", icon: <CalendarMonthIcon fontSize="small" /> },
  ];

  const studentNav: NavItem[] = [
    { label: "Dashboard", path: "/student/dashboard", icon: <DashboardIcon fontSize="small" /> },
    { label: "My Profile", path: "/students/profile", icon: <PersonIcon fontSize="small" /> },
    { label: "My Courses", path: "/students/courses", icon: <SchoolIcon fontSize="small" /> },
    { label: "Events", path: "/events", icon: <EventIcon fontSize="small" /> },
    { label: "Calendar", path: "/calendar", icon: <CalendarMonthIcon fontSize="small" /> },
  ];

  const navItems = user?.role === "student" ? studentNav : adminNav;

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "#1976d2",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          minHeight: 64,
          px: { xs: 1.5, md: 3 },
        }}
      >
        {/* Brand / Logo */}
        <Typography
          variant="h6"
          component={Link}
          href={user ? "/dashboard" : "/login"}
          sx={{
            color: "inherit",
            textDecoration: "none",
            fontWeight: 700,
            fontSize: { xs: "1rem", md: "1.2rem" },
            whiteSpace: "nowrap",
          }}
        >
          Student Management Dashboard
        </Typography>

        {/* Top bar navigation fields next to where admin is written */}
        {user ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              flexWrap: "wrap",
              justifyContent: "center",
              flex: 1,
              mx: 2,
            }}
          >
            {navItems.map((item) => {
              const isSelected =
                pathname === item.path ||
                (item.path !== "/dashboard" &&
                  item.path !== "/student/dashboard" &&
                  pathname?.startsWith(item.path));

              return (
                <Button
                  key={item.path}
                  color="inherit"
                  size="small"
                  startIcon={item.icon}
                  onClick={() => router.push(item.path)}
                  sx={{
                    textTransform: "none",
                    fontWeight: isSelected ? 700 : 500,
                    px: 1.2,
                    py: 0.6,
                    borderRadius: 1.5,
                    backgroundColor: isSelected
                      ? "rgba(255, 255, 255, 0.22)"
                      : "transparent",
                    borderBottom: isSelected ? "2px solid #ffffff" : "2px solid transparent",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                    },
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>
        ) : null}

        {/* Right side: User Profile / Auth buttons */}
        {!user ? (
          <Box
            sx={{
              display: "flex",
              gap: 1,
            }}
          >
            <Button
              color="inherit"
              onClick={() => router.push("/login")}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Login
            </Button>

            <Button
              variant="outlined"
              color="inherit"
              onClick={() => router.push("/register")}
              sx={{ textTransform: "none", fontWeight: 600, borderColor: "rgba(255,255,255,0.7)" }}
            >
              Register
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              whiteSpace: "nowrap",
            }}
          >
            <Chip
              label={`${user.username} (${user.role})`}
              size="small"
              sx={{
                color: "#ffffff",
                backgroundColor: "rgba(255, 255, 255, 0.18)",
                fontWeight: 600,
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            />

            <Button
              color="inherit"
              variant="outlined"
              size="small"
              startIcon={<LogoutIcon fontSize="small" />}
              onClick={handleLogout}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderColor: "rgba(255,255,255,0.5)",
                "&:hover": {
                  borderColor: "#ffffff",
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}