"use client";

import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AddIcon from "@mui/icons-material/PersonAdd";

import { useRouter } from "next/navigation";

const drawerWidth = 240;

export default function Sidebar() {
  const router = useRouter();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Box sx={{ marginTop: "64px" }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => router.push("/dashboard")}
            >
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>

              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              onClick={() => router.push("/students")}
            >
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>

              <ListItemText primary="Students" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              onClick={() => router.push("/students/add")}
            >
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>

              <ListItemText primary="Add Student" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}