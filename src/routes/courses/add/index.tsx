"use client";

import { useRouter } from "next/navigation";

import {
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

import {
  Formik,
  Form,
} from "formik";

import { toast } from "react-toastify";

import ProtectedRoute from "../../../components/route/route";

import {
  courseService,
} from "../../../services/courses_services";

import {
  courseSchema,
} from "../../../validation/courses_schema";

import type {
  CourseInput,
} from "../../../types/courses";

const initialValues: CourseInput = {
  name: "",
  description: "",
  duration: 1,
  trainer: "",
  startDate: "",
  status: "Active",
  capacity: 1,
  enrolledStudents: 0,
};

export default function AddCoursePage() {
  const router = useRouter();

  const handleSubmit = async (
    values: CourseInput
  ) => {
    try {
      await courseService.createCourse({
        ...values,

        name: values.name.trim(),

        description:
          values.description.trim(),

        trainer:
          values.trainer.trim(),

        duration:
          Number(values.duration),

        capacity:
          Number(values.capacity),

        enrolledStudents:
          Number(values.enrolledStudents),
      });

      toast.success(
        "Course added successfully."
      );

      router.push("/courses");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to add course."
      );
    }
  };

  return (
    <ProtectedRoute>
      <Box
        sx={{
          p: {
            xs: 2,
            md: 4,
          },
        }}
      >
        {/* PAGE TITLE */}

        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 700,
          }}
        >
          Add Course
        </Typography>

        {/* FORM CONTAINER */}

        <Paper
          sx={{
            p: {
              xs: 2,
              md: 4,
            },
          }}
        >
          <Formik<CourseInput>
            initialValues={initialValues}
            validationSchema={courseSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
            }) => (
              <Form>
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
                  {/* COURSE NAME */}

                  <TextField
                    fullWidth
                    label="Course Name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.name &&
                      Boolean(errors.name)
                    }
                    helperText={
                      touched.name
                        ? errors.name
                        : ""
                    }
                  />

                  {/* TRAINER */}

                  <TextField
                    fullWidth
                    label="Trainer"
                    name="trainer"
                    value={values.trainer}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.trainer &&
                      Boolean(errors.trainer)
                    }
                    helperText={
                      touched.trainer
                        ? errors.trainer
                        : ""
                    }
                  />

                  {/* DURATION */}

                  <TextField
                    fullWidth
                    label="Duration (weeks)"
                    name="duration"
                    type="number"
                    value={values.duration}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.duration &&
                      Boolean(errors.duration)
                    }
                    helperText={
                      touched.duration
                        ? errors.duration
                        : ""
                    }
                  />

                  {/* START DATE */}

                  <TextField
                    fullWidth
                    label="Start Date"
                    name="startDate"
                    type="date"
                    value={values.startDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.startDate &&
                      Boolean(errors.startDate)
                    }
                    helperText={
                      touched.startDate
                        ? errors.startDate
                        : ""
                    }
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />

                  {/* CAPACITY */}

                  <TextField
                    fullWidth
                    label="Course Capacity"
                    name="capacity"
                    type="number"
                    value={values.capacity}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.capacity &&
                      Boolean(errors.capacity)
                    }
                    helperText={
                      touched.capacity
                        ? errors.capacity
                        : ""
                    }
                  />

                  {/* ENROLLED STUDENTS */}

                  <TextField
                    fullWidth
                    label="Enrolled Students"
                    name="enrolledStudents"
                    type="number"
                    value={
                      values.enrolledStudents
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.enrolledStudents &&
                      Boolean(
                        errors.enrolledStudents
                      )
                    }
                    helperText={
                      touched.enrolledStudents
                        ? errors.enrolledStudents
                        : ""
                    }
                  />

                  {/* STATUS */}

                  <FormControl
                    fullWidth
                    error={
                      touched.status &&
                      Boolean(errors.status)
                    }
                  >
                    <InputLabel>
                      Status
                    </InputLabel>

                    <Select
                      name="status"
                      value={values.status}
                      label="Status"
                      onChange={handleChange}
                      onBlur={handleBlur}
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
                      {touched.status
                        ? errors.status
                        : ""}
                    </FormHelperText>
                  </FormControl>

                  {/* DESCRIPTION */}

                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Description"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.description &&
                      Boolean(errors.description)
                    }
                    helperText={
                      touched.description
                        ? errors.description
                        : ""
                    }
                    sx={{
                      gridColumn: {
                        md: "1 / -1",
                      },
                    }}
                  />
                </Box>

                {/* BUTTONS */}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    mt: 4,
                  }}
                >
                  <Button
                    type="button"
                    onClick={() =>
                      router.push(
                        "/courses"
                      )
                    }
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                  >
                    Add Course
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Paper>
      </Box>
    </ProtectedRoute>
  );
}