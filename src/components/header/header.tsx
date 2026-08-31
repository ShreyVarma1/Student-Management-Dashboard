"use client";

import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Typography,
} from "@mui/material";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "../../context/auth_context";

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

  const homeRoute =
    user?.role === "student"
      ? "/student"
      : "/dashboard";

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
        {/* LOGO */}

        <Typography
          variant="h6"
          component={Link}
          href={
            isAuthenticated
              ? homeRoute
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

        {/* NOT LOGGED IN */}

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
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            {/* USER */}

            {user && (
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                }}
              >
                {user.username}
                {" • "}
                {user.role === "admin"
                  ? "Admin"
                  : "Student"}
              </Typography>
            )}

            {/* LOGOUT */}

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