import * as Yup from "yup";

export const courseSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required("Course name is required."),

  description: Yup.string()
    .trim()
    .required("Course description is required."),

  duration: Yup.number()
    .typeError("Duration must be a number.")
    .required("Duration is required.")
    .positive("Duration must be greater than 0.")
    .integer("Duration must be a whole number."),

  trainer: Yup.string()
    .trim()
    .required("Trainer is required."),

  startDate: Yup.string()
    .required("Start date is required."),

  status: Yup.string()
    .oneOf(
      ["Active", "Completed", "Inactive"],
      "Invalid course status."
    )
    .required("Status is required."),

  capacity: Yup.number()
    .typeError("Capacity must be a number.")
    .required("Capacity is required.")
    .positive("Capacity must be greater than 0.")
    .integer("Capacity must be a whole number."),

  enrolledStudents: Yup.number()
    .typeError("Enrolled students must be a number.")
    .required("Enrolled students is required.")
    .min(
      0,
      "Enrolled students cannot be negative."
    )
    .integer(
      "Enrolled students must be a whole number."
    )
    .test(
      "capacity-check",
      "Enrolled students cannot exceed capacity.",
      function (value) {
        const { capacity } = this.parent;

        if (
          value === undefined ||
          capacity === undefined
        ) {
          return true;
        }

        return value <= capacity;
      }
    ),
});