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
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";

import {
  toast,
} from "react-toastify";

import StudentForm from "../../../../components/form/form";

import { studentService } from "../../../../services/students_services";

import type {
  Student,
  StudentInput,
} from "../../../../types/students";

export default function EditStudentPage() {
  const router = useRouter();

  const params = useParams();

  const id = Number(params.id);

  const [student, setStudent] =
    useState<Student | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadStudent =
      async () => {
        try {
          setLoading(true);

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
            "Unable to load student."
          );
        } finally {
          setLoading(false);
        }
      };

    if (!Number.isNaN(id)) {
      loadStudent();
    } else {
      setError(
        "Invalid student ID."
      );

      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent:
            "center",
          padding: 5,
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
      </Box>
    );
  }

  if (!student) {
    return (
      <Box sx={{ padding: 4 }}>
        <Alert severity="info">
          Student not found.
        </Alert>
      </Box>
    );
  }

  const initialValues: StudentInput = {
    firstName:
      student.firstName,
    lastName:
      student.lastName,
    email:
      student.email,
    phone:
      student.phone,
    dateOfBirth:
      student.dateOfBirth,
    course:
      student.course,
    batch:
      student.batch,
    startDate:
      student.startDate,
    trainer:
      student.trainer,
    experience:
      student.experience,
    status:
      student.status,
    score:
      student.score,
    pendingAssignments:
      student.pendingAssignments,
  };

  const handleSubmit = async (
    values: StudentInput
  ) => {
    try {
      await studentService.updateStudent(
        id,
        values
      );

      toast.success(
        "Student updated successfully"
      );

      router.push("/students");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update student."
      );
    }
  };

  return (
    <Box
      sx={{
        padding: {
          xs: 2,
          md: 4,
        },
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
      >
        Edit Student
      </Typography>

      <Paper
        sx={{
          padding: {
            xs: 2,
            md: 4,
          },
        }}
      >
        <StudentForm
          initialValues={
            initialValues
          }
          submitLabel="Save Changes"
          onSubmit={handleSubmit}
        />
      </Paper>
    </Box>
  );
}