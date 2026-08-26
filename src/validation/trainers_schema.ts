import * as Yup from "yup";

export const trainerSchema = Yup.object({
  firstName: Yup.string()
    .trim()
    .required("First name is required"),

  lastName: Yup.string()
    .trim()
    .required("Last name is required"),

  email: Yup.string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),

  phone: Yup.string()
    .matches(
      /^[6-9][0-9]{9}$/,
      "Enter a valid 10-digit Indian mobile number"
    )
    .required("Phone is required"),

  specialization: Yup.string()
    .trim()
    .required("Specialization is required"),

  experience: Yup.number()
    .typeError("Experience must be a number")
    .min(0, "Experience cannot be negative")
    .required("Experience is required"),

  status: Yup.string()
    .oneOf(
      ["Active", "Completed", "Inactive"],
      "Invalid status"
    )
    .required("Status is required"),
});