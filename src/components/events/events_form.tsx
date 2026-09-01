"use client";

import {
  useEffect,
} from "react";

import {
  useFormik,
} from "formik";

import {
  Alert,
  Box,
  Button,
  MenuItem,
  TextField,
} from "@mui/material";

import type {
  Event,
  EventInput,
} from "../../types/events";

import {
  eventSchema,
} from "../../validation/events_schema";

interface EventFormProps {
  event?: Event;
  loading?: boolean;
  onSubmit: (
    data: EventInput
  ) => Promise<void>;
  onCancel: () => void;
}

export default function EventForm({
  event,
  loading = false,
  onSubmit,
  onCancel,
}: EventFormProps) {
  const formik = useFormik<EventInput>({
    initialValues: {
      title: event?.title ?? "",
      description:
        event?.description ?? "",
      date: event?.date ?? "",
      type: event?.type ?? ("Event" as Event["type"]),
    },

    validationSchema: eventSchema,

    enableReinitialize: true,

    onSubmit: async (values) => {
      await onSubmit({
        title: values.title.trim(),
        description:
          values.description.trim(),
        date: values.date,
        type: values.type,
      });
    },
  });

  useEffect(() => {
    if (!event) {
      formik.resetForm();
    }
  }, [event]);

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <TextField
        fullWidth
        label="Event Title"
        name="title"
        value={formik.values.title}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.title &&
          Boolean(formik.errors.title)
        }
        helperText={
          formik.touched.title &&
          formik.errors.title
        }
        disabled={loading}
      />

      <TextField
        fullWidth
        multiline
        minRows={3}
        label="Description"
        name="description"
        value={
          formik.values.description
        }
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.description &&
          Boolean(
            formik.errors.description
          )
        }
        helperText={
          formik.touched.description &&
          formik.errors.description
        }
        disabled={loading}
      />

      <TextField
        fullWidth
        type="date"
        label="Date"
        name="date"
        value={formik.values.date}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.date &&
          Boolean(formik.errors.date)
        }
        helperText={
          formik.touched.date &&
          formik.errors.date
        }
        disabled={loading}
        slotProps={{
          inputLabel: {
            shrink: true,
          },
        }}
      />

      <TextField
        select
        fullWidth
        label="Event Type"
        name="type"
        value={formik.values.type}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.type &&
          Boolean(formik.errors.type)
        }
        helperText={
          formik.touched.type &&
          formik.errors.type
        }
        disabled={loading}
      >
        <MenuItem value="Event">
          Event
        </MenuItem>

        <MenuItem value="Holiday">
          Holiday
        </MenuItem>

        <MenuItem value="Exam">
          Exam
        </MenuItem>

        <MenuItem value="Workshop">
          Workshop
        </MenuItem>

        <MenuItem value="Meeting">
          Meeting
        </MenuItem>

        <MenuItem value="Other">
          Other
        </MenuItem>
      </TextField>

      {formik.status && (
        <Alert severity="error">
          {formik.status}
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          marginTop: 1,
        }}
      >
        <Button
          type="button"
          variant="outlined"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="contained"
          disabled={
            loading ||
            formik.isSubmitting
          }
        >
          {loading || formik.isSubmitting
            ? "Saving..."
            : event
            ? "Update Event"
            : "Create Event"}
        </Button>
      </Box>
    </Box>
  );
}