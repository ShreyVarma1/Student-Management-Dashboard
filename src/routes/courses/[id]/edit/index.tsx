"use client";
import { useEffect, useState,} from "react";
import { useParams, useRouter,} from "next/navigation";
import { Alert, Box, Button, CircularProgress, FormControl, FormHelperText, InputLabel, MenuItem, Paper, Select, TextField,
       Typography,} from "@mui/material";
import { Formik, Form,} from "formik";
import { toast } from "react-toastify";
import ProtectedRoute from "../../../../components/route/route";
import { courseService,} from "../../../../services/courses_services";
import {courseSchema,} from "../../../../validation/courses_schema";
import type { Course, CourseInput,} from "../../../../types/courses";

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();

  const id = Number(params.id);

  const [course, setCourse] =
    useState<Course | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // --------------------------------
  // LOAD COURSE
  // --------------------------------

  useEffect(() => {
    const loadCourse = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await courseService.getCourseById(
            id
          );

        if (!data) {
          setError(
            "Course not found."
          );
          return;
        }

        setCourse(data);
      } catch {
        setError(
          "Unable to load course."
        );
      } finally {
        setLoading(false);
      }
    };

    if (!Number.isNaN(id)) {
      loadCourse();
    } else {
      setError(
        "Invalid course ID."
      );
      setLoading(false);
    }
  }, [id]);

  // --------------------------------
  // LOADING
  // --------------------------------

  if (loading) {
    return (
      <ProtectedRoute>
        <Box
          sx={{
            display: "flex",
            justifyContent:
              "center",
            p: 5,
          }}
        >
          <CircularProgress />
        </Box>
      </ProtectedRoute>
    );
  }

  // --------------------------------
  // ERROR
  // --------------------------------

  if (!course) {
    return (
      <ProtectedRoute>
        <Box sx={{ p: 4 }}>
          <Alert severity="error">
            {error ||
              "Course not found."}
          </Alert>

          <Button
            sx={{ mt: 2 }}
            onClick={() =>
              router.push(
                "/courses"
              )
            }
          >
            Back to Courses
          </Button>
        </Box>
      </ProtectedRoute>
    );
  }

  // --------------------------------
  // INITIAL VALUES
  // --------------------------------

  const initialValues: CourseInput = {
    name: course.name,

    description:
      course.description,

    duration:
      course.duration,

    trainer:
      course.trainer,

    startDate:
      course.startDate,

    status:
      course.status,

    capacity:
      course.capacity,

    enrolledStudents:
      course.enrolledStudents,
  };

  // --------------------------------
  // SUBMIT
  // --------------------------------

  const handleSubmit = async (
    values: CourseInput
  ) => {
    try {
      await courseService.updateCourse(
        id,
        {
          ...values,

          name:
            values.name.trim(),

          description:
            values.description.trim(),

          trainer:
            values.trainer.trim(),

          duration:
            Number(values.duration),

          capacity:
            Number(values.capacity),

          enrolledStudents:
            Number(
              values.enrolledStudents
            ),
        }
      );

      toast.success(
        "Course updated successfully."
      );

      router.push("/courses");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update course."
      );
    }
  };

  // --------------------------------
  // PAGE
  // --------------------------------

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
          Edit Course
        </Typography>

        {/* FORM */}

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
            enableReinitialize
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
                    value={
                      values.description
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.description &&
                      Boolean(
                        errors.description
                      )
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
                    Save Changes
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