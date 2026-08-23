"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";

import type { Student } from "../../../types/students";

import { studentService } from "../../../services/students_services";

export default function StudentDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [student, setStudent] =
    useState<Student | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadStudent = async () => {
      const id = Number(params.id);

      const data =
        await studentService.getStudentById(id);

      setStudent(data ?? null);
      setLoading(false);
    };

    loadStudent();
  }, [params.id]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          padding: 5,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!student) {
    return (
      <Box sx={{ padding: 3 }}>
        <Alert severity="error">
          Student not found.
        </Alert>

        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() =>
            router.push("/students")
          }
          sx={{ marginTop: 2 }}
        >
          Back to Students
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 3,
        }}
      >
        <Box>
          <Typography variant="h4">
            {student.firstName}{" "}
            {student.lastName}
          </Typography>

          <Typography variant="body2">
            Student Details
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() =>
            router.push(
              `/students/${student.id}/edit`
            )
          }
        >
          Edit Student
        </Button>
      </Box>

      <Paper sx={{ padding: 3 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 1fr",
            },
            gap: 3,
          }}
        >
          <Box>
            <Typography
              variant="subtitle2"
              color="text.secondary"
            >
              First Name
            </Typography>

            <Typography>
              {student.firstName}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="subtitle2"
              color="text.secondary"
            >
              Last Name
            </Typography>

            <Typography>
              {student.lastName}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="subtitle2"
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
              variant="subtitle2"
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
              variant="subtitle2"
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
              variant="subtitle2"
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
              variant="subtitle2"
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
              variant="subtitle2"
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
              variant="subtitle2"
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
              variant="subtitle2"
              color="text.secondary"
            >
              Experience
            </Typography>

            <Typography>
              {student.experience} years
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="subtitle2"
              color="text.secondary"
            >
              Status
            </Typography>

            <Typography>
              {student.status}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="subtitle2"
              color="text.secondary"
            >
              Score
            </Typography>

            <Typography>
              {student.score}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="subtitle2"
              color="text.secondary"
            >
              Pending Assignments
            </Typography>

            <Typography>
              {student.pendingAssignments}
            </Typography>
          </Box>
        </Box>

        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() =>
            router.push("/students")
          }
          sx={{ marginTop: 4 }}
        >
          Back to Students
        </Button>
      </Paper>
    </Box>
  );
}