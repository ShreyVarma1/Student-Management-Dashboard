"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
} from "@mui/material";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

import {
  useAuth,
} from "../../context/auth_context";

export default function Header() {
  const router = useRouter();

  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  const handleLogout = () => {
    logout();

    router.push("/login");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) =>
          theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        {/* LOGO / TITLE */}

        <Typography
          variant="h6"
          component={Link}
          href={
            isAuthenticated
              ? "/dashboard"
              : "/login"
          }
          sx={{
            color: "inherit",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          Student Management
        </Typography>

        {/* RIGHT SIDE */}

        {!isAuthenticated ? (
          <Box
            sx={{
              display: "flex",
              gap: 1,
            }}
          >
            <Button
              component={Link}
              href="/login"
              color="inherit"
            >
              Login
            </Button>

            <Button
              component={Link}
              href="/register"
              color="inherit"
            >
              Register
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Button
              component={Link}
              href="/dashboard"
              color="inherit"
            >
              Dashboard
            </Button>

            <Button
              component={Link}
              href="/students"
              color="inherit"
            >
              Students
            </Button>

            <Button
              component={Link}
              href="/trainers"
              color="inherit">
              Trainers
            </Button>

            <Button
              component={Link}
              href="/students/add"
              color="inherit"
            >
              Add Student
            </Button>

            {user && (
              <Typography
                variant="body2"
                sx={{
                  marginLeft: 1,
                  fontWeight: 600,
                }}
              >
                {user.username}
              </Typography>
            )}

            <Button
              color="inherit"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}