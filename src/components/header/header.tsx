"use client";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
export default function Header() {
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
        >
          Student Management Dashboard
        </Typography>

        <Box>
          <Typography variant="body1">
            Welcome, Admin
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}