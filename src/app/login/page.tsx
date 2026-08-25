"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  useRouter,
  useSearchParams,
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

import LoginIcon from
  "@mui/icons-material/Login";

import {
  authService,
} from "../../services/auth_services";

import {
  useAuth,
} from "../../context/auth_context";

export default function LoginPage() {
  const router = useRouter();

  const searchParams =
    useSearchParams();

  const { login, isAuthenticated } =
    useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (searchParams.get("registered")) {
      setSuccess(
        "Account created successfully. Please login."
      );
    }
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [
    isAuthenticated,
    router,
  ]);

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError(
        "Email is required."
      );
      return;
    }

    if (!password) {
      setError(
        "Password is required."
      );
      return;
    }

    setLoading(true);

    const result =
      authService.login({
        email,
        password,
      });

    setLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    if (result.user) {
      login(result.user);
      router.push("/dashboard");
    }
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
            <LoginIcon
              sx={{
                fontSize: 45,
                marginBottom: 1,
              }}
            />

            <Typography
              variant="h4"
              sx={{ fontWeight: 700 }}
            >
              Login
            </Typography>

            <Typography
              color="text.secondary"
            >
              Login to your admin account
            </Typography>
          </Box>

          {success && (
            <Alert
              severity="success"
              sx={{ marginBottom: 2 }}
            >
              {success}
            </Alert>
          )}

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
                ? "Logging in..."
                : "Login"}
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
                Don't have an account?{" "}
                <Link href="/register">
                  Create Account
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}