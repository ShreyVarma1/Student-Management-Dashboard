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
  useAppContext,
} from "../../context/context";

export default function Header() {
  const {
    currentUser,
  } = useAppContext();

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
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 700,
          }}
        >
          Student Management
        </Typography>

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
            href="/students/add"
            color="inherit"
          >
            Add Student
          </Button>

          <Typography
            variant="body2"
            sx={{
              marginLeft: 1,
              paddingLeft: 1,
              borderLeft:
                "1px solid rgba(255,255,255,0.4)",
            }}
          >
            {currentUser}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}