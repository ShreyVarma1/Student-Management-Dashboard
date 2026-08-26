"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
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
  "../../../../components/route/route";

import {
  trainerService,
} from "../../../../services/trainers_services";

import {
  Trainer,
} from "../../../../types/trainers";

import Loading from
  "../../../../components/loading/loading";

export default function EditTrainerPage() {
  const phoneRegex = /^[6-9]\d{9}$/;
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [
    trainer,
    setTrainer,
  ] = useState<Trainer | null>(
    null
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    const foundTrainer =
      trainerService.getTrainerById(
        id
      );

    if (foundTrainer) {
      setTrainer(foundTrainer);
    }

    setLoading(false);
  }, [id]);

  const handleChange = (
    field: keyof Trainer,
    value: string | number
  ) => {
    if (!trainer) {
      return;
    }

    setTrainer({
      ...trainer,
      [field]: value,
    });
  };

  const handleSubmit = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!trainer) {
      return;
    }

    setError("");

    if (
      !trainer.firstName.trim() ||
      !trainer.lastName.trim() ||
      !trainer.email.trim() ||
      !trainer.phone.trim() ||
      !trainer.specialization.trim()
    ) {
      setError(
        "Please fill in all fields."
      );

      return;
    }

    if (!phoneRegex.test(trainer.phone.trim())) {setError("Please enter a valid 10-digit Indian mobile number.");
         return;}

    try {
      trainerService.updateTrainer(
        trainer.id,
        {
          firstName:
            trainer.firstName.trim(),
          lastName:
            trainer.lastName.trim(),
          email:
            trainer.email.trim(),
          phone:
            trainer.phone.trim(),
          specialization:
            trainer.specialization.trim(),
          experience:
            Number(
              trainer.experience
            ),
          status:
            trainer.status,
        }
      );

      toast.success(
        "Trainer updated successfully"
      );

      router.push(
        `/trainers/${trainer.id}`
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update trainer."
      );
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Loading />
      </ProtectedRoute>
    );
  }

  if (!trainer) {
    return (
      <ProtectedRoute>
        <Box sx={{ padding: 4 }}>
          <Alert severity="error">
            Trainer not found.
          </Alert>

          <Button
            sx={{
              marginTop: 2,
            }}
            onClick={() =>
              router.push(
                "/trainers"
              )
            }
          >
            Back to Trainers
          </Button>
        </Box>
      </ProtectedRoute>
    );
  }

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
          sx={{marginBottom: 3,fontWeight: 700}}
        >
          Edit Trainer
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
            value={trainer.firstName}
            onChange={(event) =>
              handleChange(
                "firstName",
                event.target.value
              )
            }
            fullWidth
          />

          <TextField
            label="Last Name"
            value={trainer.lastName}
            onChange={(event) =>
              handleChange(
                "lastName",
                event.target.value
              )
            }
            fullWidth
          />

          <TextField
            label="Email"
            type="email"
            value={trainer.email}
            onChange={(event) =>
              handleChange(
                "email",
                event.target.value
              )
            }
            fullWidth
          />

          <TextField
            label="Phone"
            value={trainer.phone}
            onChange={(event) =>
              handleChange(
                "phone",
                event.target.value
              )
            }
            slotProps={{htmlInput: { maxLength: 10, inputMode: "numeric" },}}
            fullWidth
          />

          <TextField
            label="Specialization"
            value={
              trainer.specialization
            }
            onChange={(event) =>
              handleChange(
                "specialization",
                event.target.value
              )
            }
            fullWidth
          />

          <TextField
            label="Experience"
            type="number"
            value={trainer.experience}
            onChange={(event) =>
              handleChange(
                "experience",
                Number(
                  event.target.value
                )
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
            value={trainer.status}
            onChange={(event) =>
              handleChange(
                "status",
                event.target.value
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
              Update Trainer
            </Button>

            <Button
              type="button"
              variant="outlined"
              onClick={() =>
                router.push(
                  `/trainers/${trainer.id}`
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