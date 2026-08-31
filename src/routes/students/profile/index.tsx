"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";

import {
  useAuth,
} from "../../../context/auth_context";

import ProtectedRoute from
  "../../../components/route/route";

import {
  studentAccountService,
} from "../../../services/students_account_services";

import type {
  Student,
} from "../../../types/students";

export default function StudentProfilePage() {
  const {
    user,
  } = useAuth();

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
    <ProtectedRoute
      allowedRoles={["student"]}
    >
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
            marginBottom: 3,
          }}
        >
          My Profile
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
            Your Student profile has not
            been linked to your account yet.
            Please contact the administrator.
          </Alert>
        )}

        {!loading && student && (
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
                {student.firstName}{" "}
                {student.lastName}
              </Typography>

              <Grid
                container
                spacing={3}
              >
                <Grid
                  size={{
                    xs: 12,
                    md: 6,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Email
                  </Typography>

                  <Typography>
                    {student.email}
                  </Typography>
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    md: 6,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Phone
                  </Typography>

                  <Typography>
                    {student.phone}
                  </Typography>
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    md: 6,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Date of Birth
                  </Typography>

                  <Typography>
                    {student.dateOfBirth}
                  </Typography>
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    md: 6,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Course
                  </Typography>

                  <Typography>
                    {student.course}
                  </Typography>
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    md: 6,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Batch
                  </Typography>

                  <Typography>
                    {student.batch}
                  </Typography>
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    md: 6,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Trainer
                  </Typography>

                  <Typography>
                    {student.trainer}
                  </Typography>
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    md: 6,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Experience
                  </Typography>

                  <Typography>
                    {student.experience} years
                  </Typography>
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    md: 6,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Status
                  </Typography>

                  <Typography>
                    {student.status}
                  </Typography>
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    md: 6,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Score
                  </Typography>

                  <Typography>
                    {student.score}%
                  </Typography>
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    md: 6,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Pending Assignments
                  </Typography>

                  <Typography>
                    {student.pendingAssignments}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Box>
    </ProtectedRoute>
  );
}