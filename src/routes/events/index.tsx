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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EventIcon from "@mui/icons-material/Event";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import { toast } from "react-toastify";

import ProtectedRoute from "../../components/route/route";
import ConfirmDialog from "../../components/dialog/dialog";
import EventForm from "../../components/events/events_form";
import { eventService } from "../../services/events_services";
import type { Event, EventInput, EventType } from "../../types/events";
import { useAuth } from "../../context/auth_context";

export default function EventsPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter state
  const [selectedType, setSelectedType] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [viewEvent, setViewEvent] = useState<Event | null>(null);
  const [editEvent, setEditEvent] = useState<Event | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Delete state
  const [deleteEventId, setDeleteEventId] = useState<number | null>(null);
  const [deleteEventTitle, setDeleteEventTitle] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const isAdmin = user?.role === "admin";

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

  const handleCreateEvent = async (data: EventInput) => {
    try {
      setFormLoading(true);
      await eventService.createEvent(data);
      toast.success("Event added successfully.");
      setAddModalOpen(false);
      await loadEvents();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to create event.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateEvent = async (data: EventInput) => {
    if (!editEvent) return;
    try {
      setFormLoading(true);
      await eventService.updateEvent(editEvent.id, data);
      toast.success("Event updated successfully.");
      setEditEvent(null);
      await loadEvents();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to update event.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (deleteEventId === null) return;
    try {
      setDeleteLoading(true);
      await eventService.deleteEvent(deleteEventId);
      toast.success("Event deleted successfully.");
      setDeleteEventId(null);
      setDeleteEventTitle("");
      await loadEvents();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to delete event.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesType =
      selectedType === "All" || event.type === selectedType;
    const matchesSearch =
      searchQuery === "" ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getChipColor = (type: EventType) => {
    switch (type) {
      case "Holiday":
        return "success";
      case "Exam":
        return "error";
      case "Workshop":
        return "warning";
      case "Meeting":
        return "info";
      default:
        return "primary";
    }
  };

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

  return (
    <ProtectedRoute allowedRoles={["admin", "student"]}>
      <Box sx={{ padding: { xs: 2, md: 4 } }}>
        {/* HEADER */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            marginBottom: 3,
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Events
            </Typography>
            <Typography color="text.secondary" sx={{ marginTop: 0.5 }}>
              View and manage upcoming events, holidays, exams and workshops.
            </Typography>
          </Box>

          {isAdmin && (
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setAddModalOpen(true)}
              >
                Add Event
              </Button>
            </Box>
          )}
        </Box>

        {/* SEARCH & FILTERS */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 3,
            alignItems: "center",
          }}
        >
          <TextField
            size="small"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: { xs: "100%", sm: 300 } }}
          />

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {["All", "Event", "Holiday", "Exam", "Workshop", "Meeting", "Other"].map((type) => (
              <Chip
                key={type}
                label={type}
                clickable
                color={selectedType === type ? "primary" : "default"}
                variant={selectedType === type ? "filled" : "outlined"}
                onClick={() => setSelectedType(type)}
              />
            ))}
          </Box>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            action={
              <Button color="inherit" size="small" onClick={loadEvents}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* EVENTS LIST */}
        {filteredEvents.length === 0 ? (
          <Alert severity="info">
            {events.length === 0
              ? "No events have been created yet."
              : "No events match the selected filter."}
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {filteredEvents.map((event) => (
              <Grid key={event.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: 2,
                    borderRadius: 2,
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent sx={{ padding: 3, flexGrow: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 2,
                      }}
                    >
                      <EventIcon color="primary" />
                      <Chip
                        label={event.type}
                        size="small"
                        color={getChipColor(event.type) as any}
                      />
                    </Box>

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        marginBottom: 1,
                      }}
                    >
                      {event.title}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1.5 }}>
                      <CalendarMonthIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {new Date(`${event.date}T00:00:00`).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </Typography>
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {event.description || "No description provided."}
                    </Typography>
                  </CardContent>

                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      padding: 2,
                      borderTop: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Button
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => setViewEvent(event)}
                    >
                      View
                    </Button>

                    {isAdmin && (
                      <>
                        <Button
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => setEditEvent(event)}
                        >
                          Edit
                        </Button>

                        <Button
                          size="small"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => {
                            setDeleteEventId(event.id);
                            setDeleteEventTitle(event.title);
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

        {/* VIEW EVENT DETAILS MODAL */}
        <Dialog
          open={viewEvent !== null}
          onClose={() => setViewEvent(null)}
          maxWidth="sm"
          fullWidth
        >
          {viewEvent && (
            <>
              <DialogTitle
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontWeight: 700,
                }}
              >
                Event Details
                <Chip
                  label={viewEvent.type}
                  size="small"
                  color={getChipColor(viewEvent.type) as any}
                />
              </DialogTitle>
              <Divider />
              <DialogContent sx={{ py: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5 }}>
                  {viewEvent.title}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}>
                  <CalendarMonthIcon color="primary" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {new Date(`${viewEvent.date}T00:00:00`).toLocaleDateString("en-IN", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </Typography>
                </Box>

                <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", color: "text.primary" }}>
                  {viewEvent.description || "No description provided."}
                </Typography>
              </DialogContent>
              <Divider />
              <DialogActions sx={{ p: 2 }}>
                {isAdmin && (
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => {
                      const ev = viewEvent;
                      setViewEvent(null);
                      setEditEvent(ev);
                    }}
                  >
                    Edit
                  </Button>
                )}
                <Button variant="contained" onClick={() => setViewEvent(null)}>
                  Close
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* ADD EVENT MODAL */}
        <Dialog
          open={addModalOpen}
          onClose={() => !formLoading && setAddModalOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 700 }}>Add New Event</DialogTitle>
          <Divider />
          <DialogContent sx={{ py: 3 }}>
            <EventForm
              loading={formLoading}
              onSubmit={handleCreateEvent}
              onCancel={() => setAddModalOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* EDIT EVENT MODAL */}
        <Dialog
          open={editEvent !== null}
          onClose={() => !formLoading && setEditEvent(null)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 700 }}>Edit Event</DialogTitle>
          <Divider />
          <DialogContent sx={{ py: 3 }}>
            {editEvent && (
              <EventForm
                event={editEvent}
                loading={formLoading}
                onSubmit={handleUpdateEvent}
                onCancel={() => setEditEvent(null)}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* DELETE CONFIRMATION DIALOG */}
        <ConfirmDialog
          open={deleteEventId !== null}
          studentName={deleteEventTitle}
          loading={deleteLoading}
          onCancel={() => {
            if (!deleteLoading) {
              setDeleteEventId(null);
              setDeleteEventTitle("");
            }
          }}
          onConfirm={handleDelete}
        />
      </Box>
    </ProtectedRoute>
  );
}