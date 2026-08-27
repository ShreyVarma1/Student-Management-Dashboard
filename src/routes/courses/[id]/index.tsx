"use client";
import { useEffect, useState,} from "react";
import { useParams, useRouter,} from "next/navigation";
import { Alert, Box, Button, CircularProgress, Paper, Typography,} from "@mui/material";
import ProtectedRoute from "../../../components/route/route";
import { courseService,} from "../../../services/courses_services";
import type { Course,} from "../../../types/courses";

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const id = Number(params.id);

  const [course, setCourse] = useState<Course | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadCourse =
      async () => {
        try {
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

  if (loading) {
    return (
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
    );
  }

  if (error || !course) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">
          {error ||
            "Course not found."}
        </Alert>
      </Box>
    );
  }

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
        <Typography
          variant="h4"
          gutterBottom
        >
          Course Details
        </Typography>

        <Paper
          sx={{
            p: {
              xs: 2,
              md: 4,
            },
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
          >
            {course.name}
          </Typography>

          <Typography
            sx={{ mb: 3 }}
          >
            {course.description}
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                {
                  xs: "1fr",
                  md: "1fr 1fr",
                },
              gap: 2,
            }}
          >
            <Typography>
              <strong>
                Trainer:
              </strong>{" "}
              {course.trainer}
            </Typography>

            <Typography>
              <strong>
                Duration:
              </strong>{" "}
              {course.duration} weeks
            </Typography>

            <Typography>
              <strong>
                Status:
              </strong>{" "}
              {course.status}
            </Typography>

          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              mt: 4,
            }}
          >
            <Button
              variant="outlined"
              onClick={() =>
                router.push(
                  "/courses"
                )
              }
            >
              Back
            </Button>

            <Button
              variant="contained"
              onClick={() =>
                router.push(
                  `/courses/${course.id}/edit`
                )
              }
            >
              Edit
            </Button>
          </Box>
        </Paper>
      </Box>
    </ProtectedRoute>
  );
}