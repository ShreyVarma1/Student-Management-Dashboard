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
  Card,
  CardContent,
  Typography,
} from "@mui/material";

import EditIcon from
  "@mui/icons-material/Edit";

import ArrowBackIcon from
  "@mui/icons-material/ArrowBack";

import ProtectedRoute from
  "../../../components/route/route";

import {
  trainerService,
} from "../../../services/trainers_services";

import {
  Trainer,
} from "../../../types/trainers";

import Loading from
  "../../../components/loading/loading";

export default function TrainerDetailsPage() {
  const params = useParams();

  const router = useRouter();

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

  const id = Number(params.id);

  useEffect(() => {
    const foundTrainer =
      trainerService.getTrainerById(
        id
      );

    setTrainer(
      foundTrainer ?? null
    );

    setLoading(false);
  }, [id]);

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
          Trainer Details
        </Typography>

        <Card>
          <CardContent>
            <Typography
              variant="h5"
              sx={{marginBottom: 2, fontWeight: 700}}
            >
              {trainer.firstName}{" "}
              {trainer.lastName}
            </Typography>

            <Typography
              sx={{
                marginBottom: 1,
              }}
            >
              <strong>Email:</strong>{" "}
              {trainer.email}
            </Typography>

            <Typography
              sx={{
                marginBottom: 1,
              }}
            >
              <strong>Phone:</strong>{" "}
              {trainer.phone}
            </Typography>

            <Typography
              sx={{
                marginBottom: 1,
              }}
            >
              <strong>
                Specialization:
              </strong>{" "}
              {trainer.specialization}
            </Typography>

            <Typography
              sx={{
                marginBottom: 1,
              }}
            >
              <strong>
                Experience:
              </strong>{" "}
              {trainer.experience} years
            </Typography>

            <Typography
              sx={{
                marginBottom: 3,
              }}
            >
              <strong>Status:</strong>{" "}
              {trainer.status}
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
              }}
            >
              <Button
                variant="contained"
                startIcon={
                  <EditIcon />
                }
                onClick={() =>
                  router.push(
                    `/trainers/${trainer.id}/edit`
                  )
                }
              >
                Edit
              </Button>

              <Button
                variant="outlined"
                startIcon={
                  <ArrowBackIcon />
                }
                onClick={() =>
                  router.push(
                    "/trainers"
                  )
                }
              >
                Back
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </ProtectedRoute>
  );
}