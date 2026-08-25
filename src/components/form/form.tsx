"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Alert,
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
} from "@mui/material";

import {
  Formik,
  Form,
  FormikHelpers,
} from "formik";

import type {
  StudentInput,
} from "../../types/students";

import {
  studentSchema,
} from "../../validation/students_schema";

import {
  studentService,
} from "../../services/students_services";

interface StudentFormProps {
  initialValues: StudentInput;

  submitLabel: string;

  onSubmit: (
    values: StudentInput,
    formikHelpers: FormikHelpers<StudentInput>
  ) => Promise<void>;
  studentId?: string;
}

const steps = [
  "Personal Information",
  "Course Information",
  "Academic Information",
];

export default function StudentForm({
  initialValues,
  submitLabel,
  onSubmit,
  studentId
}: StudentFormProps) {        
  const [activeStep, setActiveStep] =
    useState(0);

  const [emailError, setEmailError] =
    useState("");

  const [checkingEmail, setCheckingEmail] =
    useState(false);

  /*
   * Fields belonging to each step.
   */
  const stepFields: Array<
    Array<keyof StudentInput>
  > = [
    [
      "firstName",
      "lastName",
      "email",
      "phone",
      "dateOfBirth",
    ],

    [
      "course",
      "batch",
      "startDate",
      "trainer",
    ],

    [
      "experience",
      "status",
      "score",
      "pendingAssignments",
    ],
  ];

  /*
   * Validate only the fields
   * belonging to the current step.
   */
  const validateStep = async (
    values: StudentInput
  ): Promise<boolean> => {
    try {
      for (const field of stepFields[activeStep]) {
        await studentSchema.validateAt(
          field,
          values
        );
      }

      return true;
    } catch {
      return false;
    }
  };

  /*
   * Check whether the email already exists.
   */
  const checkEmail = async (
    email: string
  ): Promise<boolean> => {
    if (!email) {
      return false;
    }

    try {
      /*
       * First validate the email format.
       */
      await studentSchema.validateAt(
        "email",
        { email }
      );

      setCheckingEmail(true);
      setEmailError("");

      const exists =
        await studentService.emailExists(
          email,
          studentId === undefined
            ? undefined
            : Number(studentId)
        );

      if (exists) {
        setEmailError(
          "This email is already registered."
        );
      }

      return !exists;
    } catch {
      return false;
    } finally {
      setCheckingEmail(false);
    }
  };

  /*
   * Whenever initialValues change,
   * start the form from Step 1.
   */
  useEffect(() => {
    setActiveStep(0);
    setEmailError("");
  }, [initialValues]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={studentSchema}
      enableReinitialize
      validateOnBlur
      validateOnChange={false}
      onSubmit={onSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        setFieldTouched,
        isSubmitting,
      }) => (
        <Form>
          {/* ========================= */}
          {/* STEPPER */}
          {/* ========================= */}

          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{
              marginBottom: 4,
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* ========================= */}
          {/* EMAIL ERROR */}
          {/* ========================= */}

          {emailError && (
            <Alert
              severity="error"
              sx={{
                marginBottom: 2,
              }}
            >
              {emailError}
            </Alert>
          )}

          {/* ========================= */}
          {/* STEP 1 */}
          {/* PERSONAL INFORMATION */}
          {/* ========================= */}

          {activeStep === 0 && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "1fr 1fr",
                },
                gap: 2,
              }}
            >
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={values.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.firstName &&
                  Boolean(errors.firstName)
                }
                helperText={
                  touched.firstName
                    ? errors.firstName
                    : ""
                }
              />

              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={values.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.lastName &&
                  Boolean(errors.lastName)
                }
                helperText={
                  touched.lastName
                    ? errors.lastName
                    : ""
                }
              />

              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={values.email}
                onChange={(event) => {
                  handleChange(event);
                  setEmailError("");
                }}
                onBlur={async (event) => {
                  handleBlur(event);

                  await checkEmail(
                    event.target.value
                  );
                }}
                error={
                  Boolean(
                    touched.email &&
                      errors.email
                  ) ||
                  Boolean(emailError)
                }
                helperText={
                  emailError ||
                  (checkingEmail
                    ? "Checking email..."
                    : touched.email
                    ? errors.email
                    : "")
                }
              />

              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.phone &&
                  Boolean(errors.phone)
                }
                helperText={
                  touched.phone
                    ? errors.phone
                    : ""
                }
              />

              <TextField
                fullWidth
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={values.dateOfBirth}
                onChange={handleChange}
                onBlur={handleBlur}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                error={
                  touched.dateOfBirth &&
                  Boolean(errors.dateOfBirth)
                }
                helperText={
                  touched.dateOfBirth
                    ? errors.dateOfBirth
                    : ""
                }
              />
            </Box>
          )}

          {/* ========================= */}
          {/* STEP 2 */}
          {/* COURSE INFORMATION */}
          {/* ========================= */}

          {activeStep === 1 && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "1fr 1fr",
                },
                gap: 2,
              }}
            >
              <FormControl
                fullWidth
                error={
                  touched.course &&
                  Boolean(errors.course)
                }
              >
                <InputLabel>
                  Course
                </InputLabel>

                <Select
                  name="course"
                  value={values.course}
                  label="Course"
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <MenuItem value="React">
                    React
                  </MenuItem>

                  <MenuItem value="Next.js">
                    Next.js
                  </MenuItem>

                  <MenuItem value="TypeScript">
                    TypeScript
                  </MenuItem>

                  <MenuItem value="JavaScript">
                    JavaScript
                  </MenuItem>

                  <MenuItem value="Node.js">
                    Node.js
                  </MenuItem>
                </Select>

                <FormHelperText>
                  {touched.course
                    ? errors.course
                    : ""}
                </FormHelperText>
              </FormControl>

              <TextField
                fullWidth
                label="Batch"
                name="batch"
                value={values.batch}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.batch &&
                  Boolean(errors.batch)
                }
                helperText={
                  touched.batch
                    ? errors.batch
                    : ""
                }
              />

              <TextField
                fullWidth
                label="Start Date"
                name="startDate"
                type="date"
                value={values.startDate}
                onChange={handleChange}
                onBlur={handleBlur}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                error={
                  touched.startDate &&
                  Boolean(errors.startDate)
                }
                helperText={
                  touched.startDate
                    ? errors.startDate
                    : ""
                }
              />

              <TextField
                fullWidth
                label="Trainer"
                name="trainer"
                value={values.trainer}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.trainer &&
                  Boolean(errors.trainer)
                }
                helperText={
                  touched.trainer
                    ? errors.trainer
                    : ""
                }
              />
            </Box>
          )}

          {/* ========================= */}
          {/* STEP 3 */}
          {/* ACADEMIC INFORMATION */}
          {/* ========================= */}

          {activeStep === 2 && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "1fr 1fr",
                },
                gap: 2,
              }}
            >
              <TextField
                fullWidth
                label="Experience (years)"
                name="experience"
                type="number"
                value={values.experience}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.experience &&
                  Boolean(errors.experience)
                }
                helperText={
                  touched.experience
                    ? errors.experience
                    : ""
                }
              />

              <FormControl
                fullWidth
                error={
                  touched.status &&
                  Boolean(errors.status)
                }
              >
                <InputLabel>
                  Status
                </InputLabel>

                <Select
                  name="status"
                  value={values.status}
                  label="Status"
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <MenuItem value="Active">
                    Active
                  </MenuItem>

                  <MenuItem value="Completed">
                    Completed
                  </MenuItem>

                  <MenuItem value="Inactive">
                    Inactive
                  </MenuItem>
                </Select>

                <FormHelperText>
                  {touched.status
                    ? errors.status
                    : ""}
                </FormHelperText>
              </FormControl>

              <TextField
                fullWidth
                label="Score"
                name="score"
                type="number"
                value={values.score}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.score &&
                  Boolean(errors.score)
                }
                helperText={
                  touched.score
                    ? errors.score
                    : ""
                }
              />

              <TextField
                fullWidth
                label="Pending Assignments"
                name="pendingAssignments"
                type="number"
                value={
                  values.pendingAssignments
                }
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.pendingAssignments &&
                  Boolean(
                    errors.pendingAssignments
                  )
                }
                helperText={
                  touched.pendingAssignments
                    ? errors.pendingAssignments
                    : ""
                }
              />
            </Box>
          )}

          {/* ========================= */}
          {/* BUTTONS */}
          {/* ========================= */}

          <Box
            sx={{
              display: "flex",
              justifyContent:
                "space-between",
              marginTop: 4,
            }}
          >
            {/* BACK BUTTON */}

            <Button
              type="button"
              disabled={activeStep === 0}
              onClick={() => {
                setActiveStep(
                  (previous) =>
                    previous - 1
                );
              }}
            >
              Back
            </Button>

            {/* ========================= */}
            {/* NEXT BUTTON */}
            {/* ========================= */}

            {activeStep <
            steps.length - 1 ? (
              <Button
                type="button"
                variant="contained"
                onClick={async (event) => {
                  /*
                   * VERY IMPORTANT:
                   * Prevent this button from
                   * submitting the Formik form.
                   */
                  event.preventDefault();
                  event.stopPropagation();

                  /*
                   * Validate only the
                   * current step.
                   */
                  const valid =
                    await validateStep(
                      values
                    );

                  /*
                   * If current step is invalid,
                   * mark its fields as touched
                   * so validation messages appear.
                   */
                  if (!valid) {
                    for (
                      const field of
                        stepFields[
                          activeStep
                        ]
                    ) {
                      await setFieldTouched(
                        field,
                        true
                      );
                    }

                    return;
                  }

                  /*
                   * Check email only after
                   * Personal Information.
                   */
                  if (
                    activeStep === 0
                  ) {
                    const emailValid =
                      await checkEmail(
                        values.email
                      );

                    if (!emailValid) {
                      await setFieldTouched(
                        "email",
                        true
                      );

                      return;
                    }
                  }

                  /*
                   * IMPORTANT:
                   *
                   * We are ONLY moving to
                   * the next step here.
                   *
                   * No createStudent()
                   * No submitForm()
                   * No form submission.
                   */
                  setActiveStep(
                    (previous) =>
                      previous + 1
                  );
                }}
              >
                Next
              </Button>
            ) : (
              /* ========================= */
              /* FINAL SUBMIT BUTTON */
              /* ========================= */

              <Button
                type="submit"
                variant="contained"
                disabled={
                  isSubmitting ||
                  Boolean(emailError)
                }
              >
                {submitLabel}
              </Button>
            )}
          </Box>
        </Form>
      )}
    </Formik>
  );
}