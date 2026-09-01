"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { toast } from "react-toastify";

import ProtectedRoute from "../../../components/route/route";
import EventForm from "../../../components/events/events_form";
import { eventService } from "../../../services/events_services";
import type { EventInput } from "../../../types/events";

export default function AddEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: EventInput) => {
    try {
      setLoading(true);
      await eventService.createEvent(data);
      toast.success("Event created successfully.");
      router.push("/events");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to create event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <Box sx={{ padding: { xs: 2, md: 4 }, maxWidth: 800, mx: "auto" }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push("/events")}
          sx={{ mb: 2 }}
        >
          Back to Events
        </Button>

        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Add New Event
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Create a new event, exam, workshop, or holiday.
        </Typography>

        <Card sx={{ p: 2 }}>
          <CardContent>
            <EventForm
              loading={loading}
              onSubmit={handleSubmit}
              onCancel={() => router.push("/events")}
            />
          </CardContent>
        </Card>
      </Box>
    </ProtectedRoute>
  );
}