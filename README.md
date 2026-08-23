# Student Management Dashboard

A responsive Student Management Dashboard built using Next.js, React, TypeScript, Material UI, Formik, Yup and MUI DataGrid.

The application allows users to manage students through a complete CRUD workflow with dashboard statistics, validation, search/filtering, pagination, student details, editing and deletion.

---

## Tech Stack

- Next.js
- React
- TypeScript
- Material UI (MUI)
- MUI DataGrid
- MUI Icons
- Formik
- Yup
- React Toastify
- Browser localStorage

---

## Features

### Dashboard

The dashboard provides live student statistics:

- Total Students
- Active Students
- Completed Students
- Average Score
- Pending Assignments

The statistics are calculated dynamically from the student data.

---

### Student Management

The Students page provides:

- Student listing
- MUI DataGrid
- Pagination
- Sorting
- Search/filtering
- Course filtering
- Status filtering
- Score filtering
- View student
- Edit student
- Delete student
- Delete confirmation dialog

---

### Add Student

The Add Student page contains a 3-step Formik Stepper.

#### Step 1 - Personal Information

- First Name
- Last Name
- Email
- Phone
- Date of Birth

#### Step 2 - Course Information

- Course
- Batch
- Start Date
- Trainer

#### Step 3 - Academic Information

- Experience
- Status
- Score
- Pending Assignments

---

### Form Validation

Yup validation is used for the student form.

Validation includes:

- Required first name
- Required last name
- Required email
- Valid email format
- Unique email
- Required phone number
- Phone number must contain 10 digits
- Required date of birth
- Required course
- Required batch
- Required start date
- Required trainer
- Experience cannot be negative
- Score must be between 0 and 100
- Pending assignments cannot be negative
- Valid student status

---

### Edit Student

The Edit Student page reuses the same Formik + Yup + Stepper form used by the Add Student page.

Existing student information is automatically loaded into the form.

Users can:

- Modify student information
- Navigate through the three steps
- Validate the updated information
- Save changes
- Return to the Students page

---

### Student Details

The Student Details page displays:

- Full name
- Email
- Phone
- Date of birth
- Course
- Batch
- Start date
- Trainer
- Experience
- Status
- Score
- Pending assignments
- Academic progress

It also provides:

- Edit button
- Back button

---

### Delete Student

Students can be deleted from the Students page.

The delete process includes:

1. User clicks Delete
2. Confirmation dialog appears
3. User confirms deletion
4. Student is removed
5. Success toast is displayed
6. Student list is refreshed

---

### Notifications

React Toastify is used for user feedback.

Examples:

- Student added successfully
- Student updated successfully
- Student deleted successfully
- Duplicate email
- Student not found
- Operation failure

---

### Loading, Error and Empty States

The application provides appropriate UI states for:

#### Loading

A loading indicator is displayed while student data is being loaded.

#### Error

An error message and Retry button are displayed when data cannot be loaded.

#### Empty

When there are no students, the application displays an empty-state message and an option to add a student.

---

### Shared Application Context

React `useContext` is used for shared application information.

The application currently provides the current user through:

`AppContext`

Example:

```text
Admin
```

This information can be consumed by components such as the Header without prop drilling.

---

## Project Structure

```text
src/
│
├── app/
│   ├── page.tsx
│   │
│   ├── dashboard/
│   │   └── page.tsx
│   │
│   └── students/
│       ├── page.tsx
│       │
│       ├── add/
│       │   └── page.tsx
│       │
│       └── [id]/
│           ├── page.tsx
│           └── edit/
│               └── page.tsx
│
├── components/
│   ├── ConfirmDialog/
│   │   └── ConfirmDialog.tsx
│   │
│   ├── Loading/
│   │   └── Loading.tsx
│   │
│   ├── StatCard/
│   │   └── StatCard.tsx
│   │
│   ├── StudentForm/
│   │   └── StudentForm.tsx
│   │
│   └── header/
│       └── header.tsx
│
├── context/
│   └── AppContext.tsx
│
├── hooks/
│   └── useStudents.ts
│
├── services/
│   └── studentService.ts
│
├── types/
│   └── student.ts
│
├── utils/
│   └── studentStats.ts
│
└── validation/
    └── studentSchema.ts
```

---

## Routing

The application contains the following routes:

| Route | Purpose |
|---|---|
| `/` | Redirects to Dashboard |
| `/dashboard` | Dashboard statistics |
| `/students` | Student listing |
| `/students/add` | Add student |
| `/students/:id` | Student details |
| `/students/:id/edit` | Edit student |

---

## Data Storage

This project does not use a backend database.

Student data is stored in the browser using:

```text
localStorage
```

The localStorage logic is centralized inside:

```text
src/services/studentService.ts
```

Components do not directly access localStorage.

The service layer provides:

```text
getStudents()
getStudentById()
createStudent()
updateStudent()
deleteStudent()
emailExists()
```

---

## Data Model

Each student contains:

```text
id
firstName
lastName
email
phone
dateOfBirth
course
batch
startDate
trainer
experience
status
score
pendingAssignments
```

Student status can be:

```text
Active
Completed
Inactive
```

Score is represented as a percentage from:

```text
0 - 100
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
```

### 2. Open the project

```bash
cd student-management-dashboard
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

### 5. Open the application

Open:

```text
http://localhost:3000
```

---

## Production Build

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

---

## Application Flow

### Add Student

```text
/students/add
      ↓
Formik
      ↓
Yup Validation
      ↓
3-Step Stepper
      ↓
Email Uniqueness Check
      ↓
studentService.createStudent()
      ↓
localStorage
      ↓
Success Toast
      ↓
/students
```

### Edit Student

```text
/students/:id/edit
      ↓
getStudentById()
      ↓
Load Existing Student
      ↓
Formik Initial Values
      ↓
3-Step Stepper
      ↓
Yup Validation
      ↓
studentService.updateStudent()
      ↓
localStorage
      ↓
Success Toast
      ↓
/students
```

### Delete Student

```text
/students
      ↓
Delete
      ↓
Confirmation Dialog
      ↓
studentService.deleteStudent()
      ↓
localStorage
      ↓
Success Toast
      ↓
Refresh Student List
```

---

## Assumptions

- The application uses localStorage instead of a backend database.
- Student IDs are generated automatically.
- Student email addresses must be unique.
- Score values range from 0 to 100.
- Phone numbers must contain exactly 10 digits.
- Student status can be Active, Completed or Inactive.
- Seed student data is provided when localStorage has not been initialized.
- The current application user is represented as `Admin`.
- No authentication system is implemented.
- No backend API is required for the current implementation.

---

## Validation Rules

| Field | Rule |
|---|---|
| First Name | Required |
| Last Name | Required |
| Email | Required, valid format, unique |
| Phone | Required, exactly 10 digits |
| Date of Birth | Required |
| Course | Required |
| Batch | Required |
| Start Date | Required |
| Trainer | Required |
| Experience | Required, cannot be negative |
| Status | Required |
| Score | Required, 0-100 |
| Pending Assignments | Required, cannot be negative |

---

## Testing Checklist

Before considering the application complete, verify:

### Dashboard

- [ ] Dashboard loads correctly
- [ ] Total students is correct
- [ ] Active students is correct
- [ ] Completed students is correct
- [ ] Average score is correct
- [ ] Pending assignments are correct

### Students

- [ ] Students load correctly
- [ ] DataGrid displays students
- [ ] Sorting works
- [ ] Pagination works
- [ ] Search/filtering works
- [ ] Course filtering works
- [ ] Status filtering works

### Add Student

- [ ] Step 1 validation works
- [ ] Step 2 validation works
- [ ] Step 3 validation works
- [ ] Next button works
- [ ] Back button works
- [ ] Email validation works
- [ ] Duplicate email is rejected
- [ ] Student is created successfully
- [ ] Success toast appears
- [ ] User is redirected to `/students`

### Student Details

- [ ] Details page loads
- [ ] Student information is displayed
- [ ] Status is displayed
- [ ] Score is displayed
- [ ] Progress bar is displayed
- [ ] Edit button works
- [ ] Back button works

### Edit Student

- [ ] Existing values are pre-filled
- [ ] Stepper works
- [ ] Validation works
- [ ] Email uniqueness works
- [ ] Changes are saved
- [ ] Success toast appears
- [ ] User is redirected to `/students`
- [ ] Changes persist after refresh

### Delete Student

- [ ] Delete button works
- [ ] Confirmation dialog appears
- [ ] Cancel works
- [ ] Delete works
- [ ] Success toast appears
- [ ] Student disappears from the list

### UI States

- [ ] Loading state works
- [ ] Error state works
- [ ] Retry button works
- [ ] Empty state works
- [ ] Layout works on smaller screens

---

## Final Verification

Run:

```bash
npm run build
```

If the build succeeds, check:

```bash
git status
```

Then commit the final changes:

```bash
git add .
git commit -m "Complete student management dashboard"
git push
```

---

## Author

Student Management Dashboard Assessment Project