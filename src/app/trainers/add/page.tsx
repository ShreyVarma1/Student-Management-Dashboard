"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  Alert,
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import {
  toast,
} from "react-toastify";

import ProtectedRoute from
  "../../../components/route/route";

import {
  trainerService,
} from "../../../services/trainers_services";

export default function AddTrainerPage() {
  const phoneRegex = /^[6-9]\d{9}$/;
  const router = useRouter();

  const [
    firstName,
    setFirstName,
  ] = useState("");

  const [
    lastName,
    setLastName,
  ] = useState("");

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    phone,
    setPhone,
  ] = useState("");

  const [
    specialization,
    setSpecialization,
  ] = useState("");

  const [
    experience,
    setExperience,
  ] = useState("");

  const [
    status,
    setStatus,
  ] = useState<
    "Active" | "Inactive"
  >("Active");

  const [
    error,
    setError,
  ] = useState("");

  const handleSubmit = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError("");

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !specialization.trim() ||
      !experience
    ) {
      setError(
        "Please fill in all fields."
      );

      return;
    }

    if (!phoneRegex.test(phone.trim())) {setError("Please enter a valid 10-digit Indian mobile number.");
        return;}

    try {
      trainerService.createTrainer({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        specialization:
          specialization.trim(),
        experience: Number(
          experience
        ),
        status,
      });

      toast.success(
        "Trainer added successfully"
      );

      router.push("/trainers");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to add trainer."
      );
    }
  };

  return (
    <ProtectedRoute>
      <Box
        sx={{
          maxWidth: 800,
          margin: "0 auto",
          padding: {
            xs: 2,
            md: 4,
          },
        }}
      >
        <Typography
          variant="h4"
          sx={{marginBottom: 3, fontWeight:700}}
        >
          Add Trainer
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{
              marginBottom: 2,
            }}
          >
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "grid",
            gap: 2,
          }}
        >
          <TextField
            label="First Name"
            value={firstName}
            onChange={(event) =>
              setFirstName(
                event.target.value
              )
            }
            fullWidth
          />

          <TextField
            label="Last Name"
            value={lastName}
            onChange={(event) =>
              setLastName(
                event.target.value
              )
            }
            fullWidth
          />

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(
                event.target.value
              )
            }
            fullWidth
          />

          <TextField
            label="Phone"
            value={phone}
            onChange={(event) =>
              setPhone(
                event.target.value
              )
            }
            slotProps={{
              htmlInput: {
                maxLength: 10,
                inputMode: "numeric",
              },
            }}
            fullWidth
          />

          <TextField
            label="Specialization"
            value={specialization}
            onChange={(event) =>
              setSpecialization(
                event.target.value
              )
            }
            fullWidth
          />

          <TextField
            label="Experience"
            type="number"
            value={experience}
            onChange={(event) =>
              setExperience(
                event.target.value
              )
            }
            slotProps={{
              htmlInput: {
                min: 0,
              },
            }}
            fullWidth
          />

          <TextField
            select
            label="Status"
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value as
                  | "Active"
                  | "Inactive"
              )
            }
            fullWidth
          >
            <MenuItem value="Active">
              Active
            </MenuItem>

            <MenuItem value="Inactive">
              Inactive
            </MenuItem>
          </TextField>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              marginTop: 1,
            }}
          >
            <Button
              type="submit"
              variant="contained"
            >
              Add Trainer
            </Button>

            <Button
              type="button"
              variant="outlined"
              onClick={() =>
                router.push(
                  "/trainers"
                )
              }
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </ProtectedRoute>
  );
}