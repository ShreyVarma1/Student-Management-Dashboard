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
import AddIcon from "@mui/icons-material/Add";

import ProtectedRoute from "../../../components/route/route";
import { eventService } from "../../../services/events_services";
import type { Event } from "../../../types/events";
import { useAuth } from "../../../context/auth_context";

export default function CalendarPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentDate, setCurrentDate] = useState(
    new Date()
  );

  const isAdmin = user?.role === "admin";

  useEffect(() => {
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

    loadEvents();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString(
    "default",
    {
      month: "long",
    }
  );

  const firstDay = new Date(
    year,
    month,
    1
  ).getDay();

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const calendarDays = useMemo(() => {
    const days: (
      | number
      | null
    )[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (
      let day = 1;
      day <= daysInMonth;
      day++
    ) {
      days.push(day);
    }

    return days;
  }, [firstDay, daysInMonth]);

  const getDateString = (
    day: number
  ) => {
    const monthNumber = String(
      month + 1
    ).padStart(2, "0");

    const dayNumber = String(day).padStart(
      2,
      "0"
    );

    return `${year}-${monthNumber}-${dayNumber}`;
  };

  const getEventsForDate = (
    day: number
  ) => {
    const dateString =
      getDateString(day);

    return events.filter(
      (event) => event.date === dateString
    );
  };

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(year, month - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(year, month + 1, 1)
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (
    day: number
  ) => {
    const dateEvents =
      getEventsForDate(day);

    if (dateEvents.length === 0) {
      return;
    }

    const selectedDate =
      getDateString(day);

    router.push(
      `/events?date=${selectedDate}`
    );
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Box
          sx={{
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <Box sx={{ padding: 4 }}>
          <Alert severity="error">
            {error}
          </Alert>
        </Box>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
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
            justifyContent:
              "space-between",
            alignItems: {
              xs: "flex-start",
              md: "center",
            },
            gap: 2,
            marginBottom: 3,
            flexDirection: {
              xs: "column",
              md: "row",
            },
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

            <Typography
              color="text.secondary"
              sx={{ marginTop: 1 }}
            >
              View all scheduled events
              and holidays.
            </Typography>
          </Box>

          {isAdmin && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() =>
                router.push(
                  "/events/add"
                )
              }
            >
              Add Event
            </Button>
          )}
        </Box>

        {/* CALENDAR */}

        <Card>
          <CardContent
            sx={{
              padding: {
                xs: 2,
                md: 4,
              },
            }}
          >
            {/* CALENDAR HEADER */}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "space-between",
                marginBottom: 3,
              }}
            >
              <Button
                variant="outlined"
                onClick={
                  goToPreviousMonth
                }
              >
                Previous
              </Button>

              <Box
                sx={{
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  {monthName} {year}
                </Typography>

                <Button
                  size="small"
                  onClick={goToToday}
                  sx={{
                    marginTop: 0.5,
                  }}
                >
                  Today
                </Button>
              </Box>

              <Button
                variant="outlined"
                onClick={
                  goToNextMonth
                }
              >
                Next
              </Button>
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
                            md: 110,
                          },
                        }}
                      />
                    );
                  }

                  const dayEvents =
                    getEventsForDate(
                      day
                    );

                  const hasEvent =
                    dayEvents.length > 0;

                  const today =
                    new Date();

                  const isToday =
                    today.getFullYear() ===
                      year &&
                    today.getMonth() ===
                      month &&
                    today.getDate() ===
                      day;

                  return (
                    <Box
                      key={day}
                      onClick={() =>
                        handleDateClick(
                          day
                        )
                      }
                      sx={{
                        minHeight: {
                          xs: 70,
                          md: 110,
                        },
                        border: "1px solid",
                        borderColor:
                          hasEvent
                            ? "primary.main"
                            : "divider",
                        borderRadius: 1,
                        padding: 1,
                        cursor: hasEvent
                          ? "pointer"
                          : "default",
                        backgroundColor:
                          hasEvent
                            ? "action.selected"
                            : "background.paper",
                        transition:
                          "0.2s",

                        "&:hover": hasEvent
                          ? {
                              backgroundColor:
                                "action.hover",
                            }
                          : {},
                      }}
                    >
                      {/* DAY NUMBER */}

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems:
                            "center",
                          marginBottom: 1,
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight:
                              isToday
                                ? 700
                                : 500,
                            width: 30,
                            height: 30,
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            borderRadius:
                              "50%",
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

                        {hasEvent && (
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius:
                                "50%",
                              backgroundColor:
                                "primary.main",
                            }}
                          />
                        )}
                      </Box>

                      {/* EVENTS */}

                      <Box>
                        {dayEvents
                          .slice(0, 2)
                          .map(
                            (event) => (
                              <Box
                                key={
                                  event.id
                                }
                                sx={{
                                  padding:
                                    0.5,
                                  marginBottom:
                                    0.5,
                                  borderRadius:
                                    0.5,
                                  backgroundColor:
                                    "primary.main",
                                  color:
                                    "primary.contrastText",
                                  overflow:
                                    "hidden",
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{
                                    display:
                                      "block",
                                    fontWeight:
                                      600,
                                    whiteSpace:
                                      "nowrap",
                                    overflow:
                                      "hidden",
                                    textOverflow:
                                      "ellipsis",
                                  }}
                                >
                                  {
                                    event.title
                                  }
                                </Typography>
                              </Box>
                            )
                          )}

                        {dayEvents.length >
                          2 && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            +
                            {dayEvents.length -
                              2}{" "}
                            more
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  );
                }
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </ProtectedRoute>
  );
}