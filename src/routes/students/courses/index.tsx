"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";

import { useAuth } from "../../../context/auth_context";
import ProtectedRoute from "../../../components/route/route";

import { studentAccountService } from "../../../services/students_account_services";

import type { Student } from "../../../types/students";

export default function StudentCoursesPage() {
  const { user } = useAuth();

  const [student, setStudent] =
    useState<Student | undefined>();

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadStudent = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const result =
          await studentAccountService.getLinkedStudent(
            user
          );

        setStudent(result.student);
      } catch {
        setStudent(undefined);
      } finally {
        setLoading(false);
      }
    };

    loadStudent();
  }, [user]);

  return (
    <ProtectedRoute allowedRoles={["student"]}>
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
          sx={{
            fontWeight: 700,
            marginBottom: 1,
          }}
        >
          My Courses
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            marginBottom: 3,
          }}
        >
          View your enrolled course and academic
          details.
        </Typography>

        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              padding: 5,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {!loading && !student && (
          <Alert severity="info">
            Your Student profile has not been
            linked to your account yet. Please
            contact the administrator.
          </Alert>
        )}

        {!loading && student && (
          <Grid
            container
            spacing={3}
          >
            {/* Course */}
            <Grid
              size={{
                xs: 12,
                md: 8,
              }}
            >
              <Card>
                <CardContent
                  sx={{
                    padding: 4,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      marginBottom: 3,
                    }}
                  >
                    {student.course}
                  </Typography>

                  <Grid
                    container
                    spacing={3}
                  >
                    <Grid
                      size={{
                        xs: 12,
                        sm: 6,
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Batch
                      </Typography>

                      <Typography
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        {student.batch}
                      </Typography>
                    </Grid>

                    <Grid
                      size={{
                        xs: 12,
                        sm: 6,
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Trainer
                      </Typography>

                      <Typography
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        {student.trainer}
                      </Typography>
                    </Grid>

                    <Grid
                      size={{
                        xs: 12,
                        sm: 6,
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Start Date
                      </Typography>

                      <Typography
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        {student.startDate}
                      </Typography>
                    </Grid>

                    <Grid
                      size={{
                        xs: 12,
                        sm: 6,
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Status
                      </Typography>

                      <Box sx={{ marginTop: 0.5 }}>
                        <Chip
                          label={student.status}
                          color={
                            student.status ===
                            "Active"
                              ? "success"
                              : student.status ===
                                "Completed"
                              ? "primary"
                              : "default"
                          }
                          size="small"
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Performance */}
            <Grid
              size={{
                xs: 12,
                md: 4,
              }}
            >
              <Card>
                <CardContent
                  sx={{
                    padding: 4,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      marginBottom: 3,
                    }}
                  >
                    My Performance
                  </Typography>

                  <Box
                    sx={{
                      marginBottom: 3,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Score
                    </Typography>

                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                      }}
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
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                      }}
                    >
                      {student.pendingAssignments}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
    </ProtectedRoute>
  );
}