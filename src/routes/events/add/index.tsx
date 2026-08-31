"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EventIcon from "@mui/icons-material/Event";

import { toast } from "react-toastify";

import ProtectedRoute from "../../../components/route/route";
import ConfirmDialog from "../../../components/dialog/dialog";

import { eventService } from "../../../services/events_services";

import type { Event } from "../../../types/events";

import { useAuth } from "../../../context/auth_context";

export default function EventsPage() {
  const router = useRouter();

  const { user } = useAuth();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleteEventId, setDeleteEventId] = useState<
    number | null
  >(null);

  const [deleteEventTitle, setDeleteEventTitle] =
    useState("");

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await eventService.getEvents();

      setEvents(data);
    } catch {
      setError("Unable to load events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleDelete = async () => {
    if (deleteEventId === null) {
      return;
    }

    try {
      setDeleteLoading(true);

      await eventService.deleteEvent(deleteEventId);

      toast.success("Event deleted successfully.");

      setDeleteEventId(null);
      setDeleteEventTitle("");

      await loadEvents();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to delete event."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const isAdmin = user?.role === "admin";

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["admin", "student"]}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <CircularProgress />
        </Box>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute allowedRoles={["admin", "student"]}>
        <Box sx={{ padding: 4 }}>
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={loadEvents}
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        </Box>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["admin", "student"]}>
      <Box
        sx={{
          padding: {
            xs: 2,
            md: 4,
          },
        }}
      >
        {/* HEADER */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: {
              xs: "flex-start",
              sm: "center",
            },
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            gap: 2,
            marginBottom: 4,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
              }}
            >
              Events
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                marginTop: 0.5,
              }}
            >
              View upcoming events, holidays,
              exams and workshops.
            </Typography>
          </Box>

          {isAdmin && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() =>
                router.push("/events/add")
              }
            >
              Add Event
            </Button>
          )}
        </Box>

        {/* NO EVENTS */}

        {events.length === 0 ? (
          <Alert severity="info">
            No events have been created yet.
          </Alert>
        ) : (
          <Grid
            container
            spacing={3}
          >
            {events.map((event) => (
              <Grid
                key={event.id}
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                }}
              >
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent
                    sx={{
                      padding: 3,
                      flexGrow: 1,
                    }}
                  >
                    {/* EVENT ICON */}

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems: "center",
                        marginBottom: 2,
                      }}
                    >
                      <EventIcon
                        color="primary"
                      />

                      <Chip
                        label={event.type}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>

                    {/* TITLE */}

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        marginBottom: 1,
                      }}
                    >
                      {event.title}
                    </Typography>

                    {/* DATE */}

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        marginBottom: 2,
                      }}
                    >
                      {new Date(
                        `${event.date}T00:00:00`
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </Typography>

                    {/* DESCRIPTION */}

                    <Typography
                      variant="body2"
                      sx={{
                        display:
                          "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient:
                          "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {event.description ||
                        "No description provided."}
                    </Typography>
                  </CardContent>

                  {/* ACTIONS */}

                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      padding: 2,
                      borderTop:
                        "1px solid",
                      borderColor:
                        "divider",
                    }}
                  >
                    <Button
                      size="small"
                      startIcon={
                        <VisibilityIcon />
                      }
                      onClick={() =>
                        router.push(
                          `/events/${event.id}`
                        )
                      }
                    >
                      View
                    </Button>

                    {isAdmin && (
                      <>
                        <Button
                          size="small"
                          startIcon={
                            <EditIcon />
                          }
                          onClick={() =>
                            router.push(
                              `/events/${event.id}/edit`
                            )
                          }
                        >
                          Edit
                        </Button>

                        <Button
                          size="small"
                          color="error"
                          startIcon={
                            <DeleteIcon />
                          }
                          onClick={() => {
                            setDeleteEventId(
                              event.id
                            );

                            setDeleteEventTitle(
                              event.title
                            );
                          }}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* DELETE CONFIRMATION */}

        <ConfirmDialog
          open={
            deleteEventId !== null
          }
          studentName={
            deleteEventTitle
          }
          loading={
            deleteLoading
          }
          onCancel={() => {
            if (deleteLoading) {
              return;
            }

            setDeleteEventId(null);
            setDeleteEventTitle("");
          }}
          onConfirm={handleDelete}
        />
      </Box>
    </ProtectedRoute>
  );
}