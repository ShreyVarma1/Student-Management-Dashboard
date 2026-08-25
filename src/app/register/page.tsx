"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import Link from "next/link";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";

import PersonAddIcon from
  "@mui/icons-material/PersonAdd";

import {
  authService,
} from "../../services/auth_services";

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!username.trim()) {
      setError(
        "Username is required."
      );
      return;
    }

    if (!email.trim()) {
      setError(
        "Email is required."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    setLoading(true);

    const result =
      authService.register({
        username,
        email,
        password,
      });

    setLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    router.push("/login?registered=true");
  };

  return (
    <Box
      sx={{
        minHeight:
          "calc(100vh - 80px)",
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
        <CardContent sx={{ padding: 4 }}>
          <Box
            sx={{
              textAlign: "center",
              marginBottom: 3,
            }}
          >
            <PersonAddIcon
              sx={{
                fontSize: 45,
                marginBottom: 1,
              }}
            />

            <Typography
              variant="h4"
              sx={{ fontWeight: 700 }}
            >
              Create Account
            </Typography>

            <Typography
              color="text.secondary"
            >
              Create your admin account
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{ marginBottom: 2 }}
            >
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
          >
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(event) =>
                setUsername(
                  event.target.value
                )
              }
              margin="normal"
              required
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
              margin="normal"
              required
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
              margin="normal"
              required
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
              margin="normal"
              required
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                marginTop: 3,
              }}
            >
              {loading
                ? "Creating..."
                : "Create Account"}
            </Button>

            <Box
              sx={{
                textAlign: "center",
                marginTop: 2,
              }}
            >
              <Typography
                variant="body2"
              >
                Already have an account?{" "}
                <Link href="/login">
                  Login
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}