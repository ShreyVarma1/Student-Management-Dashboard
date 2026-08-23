"use client";

import {
  useRouter,
} from "next/navigation";

import {
  Box,
  Paper,
  Typography,
} from "@mui/material";

import {
  toast,
} from "react-toastify";

import StudentForm from "../../../components/form/form";

import { studentService } from "../../../services/students_services";

import type {
  StudentInput,
} from "../../../types/students";

const initialValues: StudentInput = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  course: "",
  batch: "",
  startDate: "",
  trainer: "",
  experience: 0,
  status: "Active",
  score: 0,
  pendingAssignments: 0,
};

export default function AddStudentPage() {
  const router = useRouter();

  const handleSubmit = async (
    values: StudentInput
  ) => {
    try {
      await studentService.createStudent(
        values
      );

      toast.success(
        "Student added successfully"
      );

      router.push("/students");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to add student."
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
        Add Student
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
          submitLabel="Add Student"
          onSubmit={handleSubmit}
        />
      </Paper>
    </Box>
  );
}