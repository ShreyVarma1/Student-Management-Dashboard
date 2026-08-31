"use client";

import {
  ReactNode,
  useEffect,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  Box,
  CircularProgress,
} from "@mui/material";

import {
  useAuth,
} from "../../context/auth_context";

import type {
  UserRole,
} from "../../types/auth";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();

  const {
    user,
    loading,
  } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    /**
     * User is not logged in.
     */
    if (!user) {
      router.replace("/login");
      return;
    }

    /**
     * User is logged in but their role
     * is not allowed on this route.
     */
    if (
      allowedRoles &&
      !allowedRoles.includes(user.role)
    ) {
      /**
       * Send the user to their own dashboard.
       */
      if (user.role === "admin") {
        router.replace("/dashboard");
      } else {
        router.replace("/student/dashboard");
      }
    }
  }, [
    user,
    loading,
    allowedRoles,
    router,
  ]);

  /**
   * Show loading screen while checking
   * the authenticated user.
   */
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  /**
   * Don't render protected content if
   * the user isn't authenticated.
   */
  if (!user) {
    return null;
  }

  /**
   * Don't render protected content if
   * the role isn't allowed.
   */
  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return null;
  }

  return <>{children}</>;
}