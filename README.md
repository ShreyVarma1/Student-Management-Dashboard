# Student Management Dashboard

A responsive Student Management Dashboard built using Next.js, React, TypeScript, Material UI (MUI), Formik, Yup and MUI DataGrid.

The application provides a complete authentication flow (register, login, logout) and a protected student management workflow with dashboard statistics, validation, search/filtering helpers, pagination, student details, editing and deletion.

---

## Tech Stack

- Next.js 16
- React 19
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

### Authentication

The application includes a client-side authentication system backed by `localStorage`.

#### Register

- Username, email, password and confirm password fields.
- Validates required fields.
- Password must be at least 6 characters.
- Password and confirm password must match.
- Username must be unique.
- Email must be unique.
- On success, the user is redirected to `/login?registered=true`, which shows a success message.

#### Login

- Email and password fields.
- Validates required fields.
- Checks credentials against registered users.
- On success, the session is stored and the user is redirected to `/dashboard`.
- Already-authenticated users are redirected away from the login page.

#### Logout

- Clears the stored session.
- Redirects the user to `/login`.

#### Protected Routes

Every student-related page (Dashboard, Students, Add Student, Student Details, Edit Student) is wrapped in a `ProtectedRoute` component.

If the user is not authenticated (and the auth state has finished loading), the user is redirected to `/login`. While the auth state is loading, a spinner is shown.

---

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
- View student
- Edit student
- Delete student
- Delete confirmation dialog
- Empty state

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
- Phone number must contain exactly 10 digits
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

The application provides two contexts:

- `AuthContext` - exposes `user`, `loading`, `isAuthenticated`, `login` and `logout`.
- `AppContext` - exposes `currentUser` and `setCurrentUser`.

The `AuthProvider` is responsible for the logged-in user and consumed by the Header and `ProtectedRoute` without prop drilling.

---

### Client-side Filtering Helpers

The project includes reusable filtering infrastructure:

- `useDebounce(value, delay)` - debounces a value.
- `filterStudents(students, filters)` - filters students by search (name/email), course, status and score range.

The score range options are:

```text
0-50
51-75
76-100
```

---

## Project Structure

```text
src/
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   │
│   ├── dashboard/
│   │   └── page.tsx
│   │
│   ├── login/
│   │   └── page.tsx
│   │
│   ├── register/
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
│   ├── dialog/
│   │   └── dialog.tsx
│   │
│   ├── form/
│   │   └── form.tsx
│   │
│   ├── header/
│   │   └── header.tsx
│   │
│   ├── loading/
│   │   └── loading.tsx
│   │
│   ├── route/
│   │   └── route.tsx
│   │
│   ├── sidebar/
│   │   └── sidebar.tsx
│   │
│   └── stats/
│       └── stats.tsx
│
├── context/
│   ├── auth_context.tsx
│   └── context.tsx
│
├── hooks/
│   ├── use_debounce.ts
│   └── use_students.ts
│
├── services/
│   ├── auth_services.ts
│   └── students_services.ts
│
├── types/
│   ├── auth.ts
│   └── students.ts
│
├── utils/
│   ├── stats.ts
│   └── students_filter.ts
│
└── validation/
    └── students_schema.ts
```

---

## Routing

The application contains the following routes:

| Route | Purpose |
|---|---|
| `/` | Redirects to `/login` |
| `/login` | Login page |
| `/register` | Register page |
| `/dashboard` | Protected dashboard statistics |
| `/students` | Protected student listing |
| `/students/add` | Protected add student |
| `/students/:id` | Protected student details |
| `/students/:id/edit` | Protected edit student |

---

## Data Storage

This project does not use a backend database.

Data is stored in the browser using `localStorage`.

### Students

Student data is stored under the key:

```text
student-management-students
```

The student logic is centralized inside:

```text
src/services/students_services.ts
```

Components do not directly access localStorage.

The service layer provides:

```text
getStudents()
getStudentById()
emailExists()
createStudent()
updateStudent()
deleteStudent()
```

### Authentication

Registered users are stored under the key:

```text
registeredUsers
```

The currently authenticated user is stored under the key:

```text
authenticatedUser
```

The authentication logic is centralized inside:

```text
src/services/auth_services.ts
```

The service layer provides:

```text
register()
login()
logout()
getCurrentUser()
isAuthenticated()
```

---

## Data Models

### Student

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

### User

Each registered user contains:

```text
id
username
email
password
```

### AuthUser

The authenticated user exposed to the application is a subset of the registered user:

```text
id
username
email
```

---

## Getting Started

### 1. Navigate to the project directory

```bash
cd sdma
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

### 4. Open the application

Open:

```text
http://localhost:3000
```

The app redirects to the login page. Create an account or log in to access the dashboard.

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

### Register

```text
/register
      ↓
Form Submission
      ↓
Client-side Validation
      ↓
Username + Email Uniqueness Check
      ↓
authService.register()
      ↓
localStorage (registeredUsers)
      ↓
Redirect to /login?registered=true
```

### Login

```text
/login
      ↓
Form Submission
      ↓
authService.login()
      ↓
Match Email + Password
      ↓
localStorage (authenticatedUser)
      ↓
AuthContext login()
      ↓
Redirect to /dashboard
```

### Protected Route

```text
ProtectedRoute
      ↓
is auth loading?
      ↓
  yes → Spinner
      ↓
  no  → is authenticated?
      ↓
  yes → Render page
      ↓
  no  → Redirect to /login
```

### Add Student

```text
/students/add
      ↓
ProtectedRoute
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
ProtectedRoute
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
- Authentication is implemented on the client only; passwords are stored in plain text in localStorage (for demo/assessment purposes only).
- Student IDs are sequential numbers starting from 1.
- Student email addresses must be unique.
- Score values range from 0 to 100.
- Phone numbers must contain exactly 10 digits.
- Student status can be Active, Completed or Inactive.
- Seed student data is provided when localStorage has not been initialized.
- Usernames and emails must be unique during registration.
- No backend API is required for the current implementation.

---

## Validation Rules

### Student Form

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
| Status | Required, must be Active, Completed or Inactive |
| Score | Required, 0-100 |
| Pending Assignments | Required, cannot be negative |

### Register Form

| Field | Rule |
|---|---|
| Username | Required, unique |
| Email | Required, unique |
| Password | Required, at least 6 characters |
| Confirm Password | Required, must match password |

### Login Form

| Field | Rule |
|---|---|
| Email | Required |
| Password | Required |

---

## Testing Checklist

Before considering the application complete, verify:

### Authentication

- [ ] Register page loads
- [ ] Register validation works
- [ ] Password length validation works
- [ ] Password match validation works
- [ ] Duplicate username is rejected
- [ ] Duplicate email is rejected
- [ ] Account is created successfully
- [ ] User is redirected to `/login?registered=true`
- [ ] Login page loads
- [ ] Login validation works
- [ ] Invalid credentials show an error
- [ ] Valid credentials log the user in
- [ ] User is redirected to `/dashboard`
- [ ] Header shows the logged-in username
- [ ] Logout works
- [ ] Logged-out users are redirected to `/login`

### Protected Routes

- [ ] Unauthenticated users are redirected to `/login`
- [ ] Authenticated users can access `/dashboard`
- [ ] Authenticated users can access `/students`
- [ ] Authenticated users can access `/students/add`
- [ ] Authenticated users can access `/students/:id`
- [ ] Authenticated users can access `/students/:id/edit`

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
- [ ] Email uniqueness works (excluding the current student)
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
git commit -m "Complete student management dashboard with authentication"
git push
```

---

## Author
Shrey Varma
Student Management Dashboard Assessment Project
