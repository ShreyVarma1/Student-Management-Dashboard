"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";

import {
  toast,
} from "react-toastify";

import {
  useAuth,
} from "../../context/auth_context";

import type {
  UserRole,
} from "../../types/auth";

export default function LoginPage() {
  const router = useRouter();

  const {
    login,
  } = useAuth();

  const [role, setRole] =
    useState<UserRole>("student");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.error(
        "Please enter your email."
      );

      return;
    }

    if (!password) {
      toast.error(
        "Please enter your password."
      );

      return;
    }

    setLoading(true);

    const result = login({
      email,
      password,
      role,
    });

    if (!result.success) {
      toast.error(result.message);

      setLoading(false);

      return;
    }

    toast.success(
      "Login successful!"
    );

    /**
     * Redirect according to role.
     */
    if (result.user?.role === "admin") {
      router.push("/dashboard");
    } else {
      router.push(
        "/student/dashboard"
      );
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 450,
        }}
      >
        <CardContent
          sx={{
            padding: 4,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              textAlign: "center",
              marginBottom: 1,
            }}
          >
            Login
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              textAlign: "center",
              marginBottom: 4,
            }}
          >
            Select your role and login
          </Typography>

          <form
            onSubmit={handleSubmit}
          >
            <FormControl
              sx={{
                marginBottom: 3,
              }}
            >
              <FormLabel>
                Login as
              </FormLabel>

              <RadioGroup
                row
                value={role}
                onChange={(event) =>
                  setRole(
                    event.target
                      .value as UserRole
                  )
                }
              >
                <FormControlLabel
                  value="student"
                  control={<Radio />}
                  label="Student"
                />

                <FormControlLabel
                  value="admin"
                  control={<Radio />}
                  label="Admin"
                />
              </RadioGroup>
            </FormControl>

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              sx={{
                marginBottom: 2,
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              sx={{
                marginBottom: 3,
              }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                paddingY: 1.5,
              }}
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </Button>
          </form>

          <Typography
            sx={{
              textAlign: "center",
              marginTop: 3,
            }}
          >
            Don't have an account?{" "}
            <Button
              onClick={() =>
                router.push(
                  "/register"
                )
              }
            >
              Register
            </Button>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}