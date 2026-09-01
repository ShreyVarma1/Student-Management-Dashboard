import * as Yup from "yup";

export const eventSchema = Yup.object({
  title: Yup.string()
    .trim()
    .required("Event title is required.")
    .min(
      3,
      "Event title must be at least 3 characters."
    )
    .max(
      100,
      "Event title cannot exceed 100 characters."
    ),

  description: Yup.string()
    .trim()
    .required("Event description is required.")
    .min(
      5,
      "Description must be at least 5 characters."
    )
    .max(
      500,
      "Description cannot exceed 500 characters."
    ),

  date: Yup.string()
    .required("Event date is required."),

  type: Yup.string()
    .oneOf(
      [
        "Event",
        "Holiday",
        "Exam",
        "Workshop",
        "Meeting",
        "Other",
      ],
      "Please select a valid event type."
    )
    .required("Event type is required."),
});