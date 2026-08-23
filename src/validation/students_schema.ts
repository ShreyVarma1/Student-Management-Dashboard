import * as Yup from "yup";

export const studentSchema =
  Yup.object({
    firstName: Yup.string()
      .trim()
      .required(
        "First name is required"
      ),

    lastName: Yup.string()
      .trim()
      .required(
        "Last name is required"
      ),

    email: Yup.string()
      .trim()
      .email(
        "Enter a valid email address"
      )
      .required("Email is required"),

    phone: Yup.string()
      .matches(
        /^[0-9]{10}$/,
        "Phone must contain exactly 10 digits"
      )
      .required("Phone is required"),

    dateOfBirth: Yup.string()
      .required(
        "Date of birth is required"
      ),

    course: Yup.string()
      .trim()
      .required("Course is required"),

    batch: Yup.string()
      .trim()
      .required("Batch is required"),

    startDate: Yup.string()
      .required(
        "Start date is required"
      ),

    trainer: Yup.string()
      .trim()
      .required("Trainer is required"),

    experience: Yup.number()
      .typeError(
        "Experience must be a number"
      )
      .min(
        0,
        "Experience cannot be negative"
      )
      .required(
        "Experience is required"
      ),

    status: Yup.string()
      .oneOf(
        [
          "Active",
          "Completed",
          "Inactive",
        ],
        "Invalid status"
      )
      .required("Status is required"),

    score: Yup.number()
      .typeError(
        "Score must be a number"
      )
      .min(
        0,
        "Score cannot be below 0"
      )
      .max(
        100,
        "Score cannot exceed 100"
      )
      .required("Score is required"),

    pendingAssignments: Yup.number()
      .typeError(
        "Pending assignments must be a number"
      )
      .min(
        0,
        "Cannot be negative"
      )
      .required(
        "Pending assignments are required"
      ),
  });