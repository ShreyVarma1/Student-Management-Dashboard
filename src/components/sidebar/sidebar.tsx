"use client";

import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import DashboardIcon from
  "@mui/icons-material/Dashboard";

import PeopleIcon from
  "@mui/icons-material/People";

import SchoolIcon from
  "@mui/icons-material/School";

import PersonIcon from
  "@mui/icons-material/Person";

import EventIcon from
  "@mui/icons-material/Event";

import CalendarMonthIcon from
  "@mui/icons-material/CalendarMonth";

import GroupIcon from
  "@mui/icons-material/Group";

import AddIcon from
  "@mui/icons-material/PersonAdd";

import { useRouter } from "next/navigation";

import { useAuth } from
  "../../context/auth_context";

const drawerWidth = 240;

interface MenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export default function Sidebar() {
  const router = useRouter();

  const { user } = useAuth();

  const adminMenu: MenuItem[] = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: <DashboardIcon />,
    },
    {
      label: "Students",
      path: "/students",
      icon: <PeopleIcon />,
    },
    {
      label: "Add Student",
      path: "/students/add",
      icon: <AddIcon />,
    },
    {
      label: "Trainers",
      path: "/trainers",
      icon: <GroupIcon />,
    },
    {
      label: "Courses",
      path: "/courses",
      icon: <SchoolIcon />,
    },
    {
      label: "Events",
      path: "/events",
      icon: <EventIcon />,
    },
    {
      label: "Calendar",
      path: "/calendar",
      icon: <CalendarMonthIcon />,
    },
  ];

  const studentMenu: MenuItem[] = [
    {
      label: "Dashboard",
      path: "/student",
      icon: <DashboardIcon />,
    },
    {
      label: "My Profile",
      path: "/student/profile",
      icon: <PersonIcon />,
    },
    {
      label: "My Courses",
      path: "/student/courses",
      icon: <SchoolIcon />,
    },
    {
      label: "Events",
      path: "/events",
      icon: <EventIcon />,
    },
    {
      label: "Calendar",
      path: "/calendar",
      icon: <CalendarMonthIcon />,
    },
  ];

  const menu =
    user?.role === "student"
      ? studentMenu
      : adminMenu;

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
      <List
        sx={{
          marginTop: 8,
        }}
      >
        {menu.map((item) => (
          <ListItem
            key={item.path}
            disablePadding
          >
            <ListItemButton
              onClick={() =>
                router.push(item.path)
              }
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.label}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}