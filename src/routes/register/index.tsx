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

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
  } = useAuth();

  const [role, setRole] =
    useState<UserRole>("student");

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!username.trim()) {
      toast.error(
        "Please enter a username."
      );

      return;
    }

    if (!email.trim()) {
      toast.error(
        "Please enter an email."
      );

      return;
    }

    if (!password) {
      toast.error(
        "Please enter a password."
      );

      return;
    }

    if (password !== confirmPassword) {
      toast.error(
        "Passwords do not match."
      );

      return;
    }

    setLoading(true);

    const result = register({
      username,
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
      "Account created successfully!"
    );

    /**
     * Registration does NOT automatically log
     * the user in.
     *
     * They go back to Login and select the
     * same role there.
     */
    router.push("/login");
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
          maxWidth: 500,
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
            Create Account
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              textAlign: "center",
              marginBottom: 4,
            }}
          >
            Select your role and register
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
                Register as
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
              label="Username"
              value={username}
              onChange={(event) =>
                setUsername(
                  event.target.value
                )
              }
              sx={{
                marginBottom: 2,
              }}
            />

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
                marginBottom: 2,
              }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(
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
                ? "Creating account..."
                : "Create Account"}
            </Button>
          </form>

          <Typography
            sx={{
              textAlign: "center",
              marginTop: 3,
            }}
          >
            Already have an account?{" "}
            <Button
              onClick={() =>
                router.push("/login")
              }
            >
              Login
            </Button>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}