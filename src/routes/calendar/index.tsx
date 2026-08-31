"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EventIcon from "@mui/icons-material/Event";
import AddIcon from "@mui/icons-material/Add";

import ProtectedRoute from "../../components/route/route";
import { eventService } from "../../services/events_services";
import type { Event } from "../../types/events";
import { useAuth } from "../../context/auth_context";

export default function CalendarPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await eventService.getEvents();

      setEvents(data);
    } catch {
      setError("Unable to load calendar events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const currentDate = new Date();

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const daysInMonth = new Date(
    currentYear,
    currentMonth + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentYear,
    currentMonth,
    1
  ).getDay();

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
  });

  const eventDates = useMemo(() => {
    return new Set(events.map((event) => event.date));
  }, [events]);

  const getDateString = (day: number) => {
    const month = String(currentMonth + 1).padStart(2, "0");
    const date = String(day).padStart(2, "0");

    return `${currentYear}-${month}-${date}`;
  };

  const getEventsForDate = (date: string) => {
    return events.filter((event) => event.date === date);
  };

  const handleDateClick = (date: string) => {
    const selectedEvents = getEventsForDate(date);

    if (selectedEvents.length === 0) {
      return;
    }

    router.push(`/events?date=${date}`);
  };

  const calendarDays = [];

  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
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
            marginBottom: 3,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <CalendarMonthIcon />
              Calendar
            </Typography>

            <Typography color="text.secondary">
              View upcoming events and holidays.
            </Typography>
          </Box>

          {user?.role === "admin" && (
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

        {/* LOADING */}

        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              padding: 6,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {/* ERROR */}

        {!loading && error && (
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
        )}

        {/* CALENDAR */}

        {!loading && !error && (
          <Card>
            <CardContent
              sx={{
                padding: {
                  xs: 2,
                  md: 4,
                },
              }}
            >
              {/* MONTH HEADER */}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: 3,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  {monthName} {currentYear}
                </Typography>
              </Box>

              {/* WEEK DAYS */}

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(7, 1fr)",
                  gap: 1,
                  marginBottom: 1,
                }}
              >
                {[
                  "Sun",
                  "Mon",
                  "Tue",
                  "Wed",
                  "Thu",
                  "Fri",
                  "Sat",
                ].map((day) => (
                  <Box
                    key={day}
                    sx={{
                      textAlign: "center",
                      fontWeight: 700,
                      padding: 1,
                    }}
                  >
                    {day}
                  </Box>
                ))}
              </Box>

              {/* CALENDAR DAYS */}

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(7, 1fr)",
                  gap: 1,
                }}
              >
                {calendarDays.map(
                  (day, index) => {
                    if (day === null) {
                      return (
                        <Box
                          key={`empty-${index}`}
                          sx={{
                            minHeight: {
                              xs: 70,
                              sm: 100,
                            },
                          }}
                        />
                      );
                    }

                    const date =
                      getDateString(day);

                    const dayEvents =
                      getEventsForDate(date);

                    const hasEvent =
                      eventDates.has(date);

                    const isToday =
                      day ===
                        currentDate.getDate() &&
                      currentMonth ===
                        currentDate.getMonth() &&
                      currentYear ===
                        currentDate.getFullYear();

                    return (
                      <Box
                        key={date}
                        onClick={() =>
                          handleDateClick(date)
                        }
                        sx={{
                          minHeight: {
                            xs: 70,
                            sm: 100,
                          },
                          border: "1px solid",
                          borderColor:
                            "divider",
                          borderRadius: 2,
                          padding: 1,
                          cursor: hasEvent
                            ? "pointer"
                            : "default",
                          backgroundColor:
                            hasEvent
                              ? "primary.light"
                              : "background.paper",
                          transition:
                            "0.2s",
                          "&:hover": hasEvent
                            ? {
                                transform:
                                  "translateY(-2px)",
                                boxShadow: 2,
                              }
                            : {},
                        }}
                      >
                        {/* DATE NUMBER */}

                        <Typography
                          sx={{
                            fontWeight: isToday
                              ? 700
                              : 500,
                            display: "inline-flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            backgroundColor:
                              isToday
                                ? "primary.main"
                                : "transparent",
                            color: isToday
                              ? "primary.contrastText"
                              : "text.primary",
                          }}
                        >
                          {day}
                        </Typography>

                        {/* EVENTS */}

                        {dayEvents.map(
                          (event) => (
                            <Box
                              key={event.id}
                              sx={{
                                display: "flex",
                                alignItems:
                                  "center",
                                gap: 0.5,
                                marginTop: 1,
                                overflow:
                                  "hidden",
                              }}
                            >
                              <EventIcon
                                sx={{
                                  fontSize: 15,
                                }}
                              />

                              <Typography
                                variant="caption"
                                sx={{
                                  fontWeight: 600,
                                  overflow:
                                    "hidden",
                                  textOverflow:
                                    "ellipsis",
                                  whiteSpace:
                                    "nowrap",
                                }}
                              >
                                {event.title}
                              </Typography>
                            </Box>
                          )
                        )}
                      </Box>
                    );
                  }
                )}
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </ProtectedRoute>
  );
}