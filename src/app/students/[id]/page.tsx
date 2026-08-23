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
  Chip,
  CircularProgress,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

import EditIcon from
  "@mui/icons-material/Edit";

import ArrowBackIcon from
  "@mui/icons-material/ArrowBack";

import {
  studentService,
} from "../../../services/students_services";

import type {
  Student,
} from "../../../types/students";

export default function StudentDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const id = Number(params.id);

  const [student, setStudent] =
    useState<Student | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadStudent = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await studentService.getStudentById(
            id
          );

        if (!data) {
          setError(
            "Student not found."
          );
          return;
        }

        setStudent(data);
      } catch {
        setError(
          "Unable to load student details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (!Number.isNaN(id)) {
      loadStudent();
    } else {
      setError("Invalid student ID.");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: 4 }}>
        <Alert severity="error">
          {error}
        </Alert>

        <Button
          sx={{ marginTop: 2 }}
          startIcon={
            <ArrowBackIcon />
          }
          onClick={() =>
            router.push("/students")
          }
        >
          Back to Students
        </Button>
      </Box>
    );
  }

  if (!student) {
    return null;
  }

  return (
    <Box
      sx={{
        padding: {
          xs: 2,
          sm: 3,
          md: 4,
        },
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: 2,
          marginBottom: 3,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700 }}
          >
            Student Details
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ fontWeight: 400 }}
          >
            View complete student information
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={1}
        >
          <Button
            variant="outlined"
            startIcon={
              <ArrowBackIcon />
            }
            onClick={() =>
              router.push("/students")
            }
          >
            Back
          </Button>

          <Button
            variant="contained"
            startIcon={
              <EditIcon />
            }
            onClick={() =>
              router.push(
                `/students/${student.id}/edit`
              )
            }
          >
            Edit
          </Button>
        </Stack>
      </Box>

      <Card sx={{ marginBottom: 3 }}>
        <CardContent>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            {student.firstName}{" "}
            {student.lastName}
          </Typography>

          <Chip
            label={student.status}
            color={
              student.status === "Active"
                ? "success"
                : student.status ===
                  "Completed"
                ? "primary"
                : "default"
            }
            sx={{
              marginBottom: 3,
            }}
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
              },
              gap: 3,
            }}
          >
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Email
              </Typography>

              <Typography>
                {student.email}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Phone
              </Typography>

              <Typography>
                {student.phone}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Date of Birth
              </Typography>

              <Typography>
                {student.dateOfBirth}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Course
              </Typography>

              <Typography>
                {student.course}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Batch
              </Typography>

              <Typography>
                {student.batch}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Trainer
              </Typography>

              <Typography>
                {student.trainer}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Start Date
              </Typography>

              <Typography>
                {student.startDate}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Experience
              </Typography>

              <Typography>
                {student.experience} years
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700 }}
            gutterBottom
          >
            Academic Progress
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              marginBottom: 1,
            }}
          >
            Score: {student.score}%
          </Typography>

          <LinearProgress
            variant="determinate"
            value={student.score}
            sx={{
              height: 10,
              borderRadius: 5,
              marginBottom: 3,
            }}
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
              },
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Score
              </Typography>

              <Typography
                variant="h5"
                sx={{ fontWeight: 700 }}
              >
                {student.score}%
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Pending Assignments
              </Typography>

              <Typography
                variant="h5"
                sx={{ fontWeight: 700 }}
              >
                {
                  student.pendingAssignments
                }
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}