"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Alert,
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import type {
  StudentInput,
  StudentStatus,
} from "../../../types/students";

import { studentService } from "../../../services/students_services";

const initialForm: StudentInput = {
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

  const [form, setForm] =
    useState<StudentInput>(initialForm);

  const [errors, setErrors] =
    useState<Record<string, string>>({});

  const [submitting, setSubmitting] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const updateField = <
    K extends keyof StudentInput
  >(
    field: K,
    value: StudentInput[K]
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: "",
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.firstName.trim()) {
      newErrors.firstName =
        "First name is required.";
    }

    if (!form.lastName.trim()) {
      newErrors.lastName =
        "Last name is required.";
    }

    if (!form.email.trim()) {
      newErrors.email =
        "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email
      )
    ) {
      newErrors.email =
        "Enter a valid email address.";
    }

    if (!form.phone.trim()) {
      newErrors.phone =
        "Phone is required.";
    } else if (
      !/^\d{10}$/.test(form.phone)
    ) {
      newErrors.phone =
        "Phone must contain exactly 10 digits.";
    }

    if (!form.course.trim()) {
      newErrors.course =
        "Course is required.";
    }

    if (!form.batch.trim()) {
      newErrors.batch =
        "Batch is required.";
    }

    if (!form.dateOfBirth) {
      newErrors.dateOfBirth =
        "Date of birth is required.";
    }

    if (!form.startDate) {
      newErrors.startDate =
        "Start date is required.";
    }

    if (!form.trainer.trim()) {
      newErrors.trainer =
        "Trainer is required.";
    }

    if (
      form.score < 0 ||
      form.score > 100
    ) {
      newErrors.score =
        "Score must be between 0 and 100.";
    }

    if (form.experience < 0) {
      newErrors.experience =
        "Experience cannot be negative.";
    }

    if (
      form.pendingAssignments < 0
    ) {
      newErrors.pendingAssignments =
        "Pending assignments cannot be negative.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setSuccess(false);

    if (!validate()) {
      return;
    }

    try {
      setSubmitting(true);

      await studentService.createStudent(
        form
      );

      setSuccess(true);

      setForm(initialForm);

      setTimeout(() => {
        router.push("/students");
      }, 1000);
    } catch {
      setErrors({
        form: "Unable to create student.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() =>
          router.push("/students")
        }
        sx={{ marginBottom: 2 }}
      >
        Back to Students
      </Button>

      <Typography
        variant="h4"
        gutterBottom
      >
        Add Student
      </Typography>

      {success && (
        <Alert
          severity="success"
          sx={{ marginBottom: 2 }}
        >
          Student added successfully.
        </Alert>
      )}

      {errors.form && (
        <Alert
          severity="error"
          sx={{ marginBottom: 2 }}
        >
          {errors.form}
        </Alert>
      )}

      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{ padding: 3 }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 1fr",
            },
            gap: 2,
          }}
        >
          <TextField
            label="First Name"
            value={form.firstName}
            onChange={(event) =>
              updateField(
                "firstName",
                event.target.value
              )
            }
            error={Boolean(errors.firstName)}
            helperText={errors.firstName}
            required
          />

          <TextField
            label="Last Name"
            value={form.lastName}
            onChange={(event) =>
              updateField(
                "lastName",
                event.target.value
              )
            }
            error={Boolean(errors.lastName)}
            helperText={errors.lastName}
            required
          />

          <TextField
            label="Email"
            type="email"
            value={form.email}
            onChange={(event) =>
              updateField(
                "email",
                event.target.value
              )
            }
            error={Boolean(errors.email)}
            helperText={errors.email}
            required
          />

          <TextField
            label="Phone"
            value={form.phone}
            onChange={(event) =>
              updateField(
                "phone",
                event.target.value
              )
            }
            error={Boolean(errors.phone)}
            helperText={errors.phone}
            required
          />

          <TextField
            label="Date of Birth"
            type="date"
            value={form.dateOfBirth}
            onChange={(event) =>
              updateField(
                "dateOfBirth",
                event.target.value
              )
            }
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            error={Boolean(
              errors.dateOfBirth
            )}
            helperText={
              errors.dateOfBirth
            }
            required
          />

          <TextField
            label="Start Date"
            type="date"
            value={form.startDate}
            onChange={(event) =>
              updateField(
                "startDate",
                event.target.value
              )
            }
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            error={Boolean(
              errors.startDate
            )}
            helperText={
              errors.startDate
            }
            required
          />

          <TextField
            label="Course"
            value={form.course}
            onChange={(event) =>
              updateField(
                "course",
                event.target.value
              )
            }
            error={Boolean(errors.course)}
            helperText={errors.course}
            required
          />

          <TextField
            label="Batch"
            value={form.batch}
            onChange={(event) =>
              updateField(
                "batch",
                event.target.value
              )
            }
            error={Boolean(errors.batch)}
            helperText={errors.batch}
            required
          />

          <TextField
            label="Trainer"
            value={form.trainer}
            onChange={(event) =>
              updateField(
                "trainer",
                event.target.value
              )
            }
            error={Boolean(errors.trainer)}
            helperText={errors.trainer}
            required
          />

          <TextField
            label="Experience"
            type="number"
            slotProps={{
              htmlInput: {
                min: 0,
              },
            }}
            value={form.experience}
            onChange={(event) =>
              updateField(
                "experience",
                Number(event.target.value)
              )
            }
            error={Boolean(
              errors.experience
            )}
            helperText={
              errors.experience
            }
          />

          <FormControl fullWidth>
            <InputLabel>
              Status
            </InputLabel>

            <Select
              value={form.status}
              label="Status"
              onChange={(event) =>
                updateField(
                  "status",
                  event.target.value as StudentStatus
                )
              }
            >
              <MenuItem value="Active">
                Active
              </MenuItem>

              <MenuItem value="Completed">
                Completed
              </MenuItem>

              <MenuItem value="Inactive">
                Inactive
              </MenuItem>
            </Select>

            <FormHelperText>
              Student status
            </FormHelperText>
          </FormControl>

          <TextField
            label="Score"
            type="number"
            slotProps={{
              htmlInput: {
                min: 0,
                max: 100,
              },
            }}
            value={form.score}
            onChange={(event) =>
              updateField(
                "score",
                Number(event.target.value)
              )
            }
            error={Boolean(errors.score)}
            helperText={errors.score}
            required
          />

          <TextField
            label="Pending Assignments"
            type="number"
            slotProps={{
              htmlInput: {
                min: 0,
              },
            }}
            value={
              form.pendingAssignments
            }
            onChange={(event) =>
              updateField(
                "pendingAssignments",
                Number(event.target.value)
              )
            }
            error={Boolean(
              errors.pendingAssignments
            )}
            helperText={
              errors.pendingAssignments
            }
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            marginTop: 3,
          }}
        >
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
          >
            {submitting
              ? "Saving..."
              : "Add Student"}
          </Button>

          <Button
            variant="outlined"
            onClick={() =>
              router.push("/students")
            }
          >
            Cancel
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}