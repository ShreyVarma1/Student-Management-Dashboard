"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  Alert,
  Box,
  Button,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";

import { DataGrid, GridColDef } from "@mui/x-data-grid";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";
import AddIcon from "@mui/icons-material/Add";

import { toast } from "react-toastify";

import { useStudents } from "../../hooks/use_students";
import { studentService } from "../../services/students_services";
import { authService } from "../../services/auth_services";

import ConfirmDialog from "../../components/dialog/dialog";
import Loading from "../../components/loading/loading";
import ProtectedRoute from "../../components/route/route";

// ---------------------------------------------------------------------------
// Helpers: persist deactivated student emails in localStorage so the toggle
// works for ALL students (including seed students without a login account).
// ---------------------------------------------------------------------------
const DEACTIVATED_KEY = "student-deactivated-accounts";

function getDeactivatedEmails(): Set<string> {
  try {
    const raw = localStorage.getItem(DEACTIVATED_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function saveDeactivatedEmails(emails: Set<string>): void {
  localStorage.setItem(DEACTIVATED_KEY, JSON.stringify([...emails]));
}

// ---------------------------------------------------------------------------

export default function StudentsPage() {
  const router = useRouter();

  const { students, loading, error, refreshStudents } = useStudents();

  const [deleteStudentId, setDeleteStudentId] = useState<number | null>(null);
  const [deleteStudentName, setDeleteStudentName] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Tracks which student emails are deactivated — drives the button toggle.
  const [deactivatedEmails, setDeactivatedEmails] = useState<Set<string>>(
    () => getDeactivatedEmails()
  );

  // One-time restore: brings Shrey Varma back if he was accidentally deleted.
  // After this runs once the flag is set and it never runs again.
  useEffect(() => {
    const FLAG = "shrey-varma-restored-v1";
    if (localStorage.getItem(FLAG)) return;

    const restore = async () => {
      const all = await studentService.getStudents();
      const exists = all.some((s) => s.email === "shrey@gmail.com");
      if (!exists) {
        try {
          await studentService.createStudent({
            firstName: "Shrey",
            lastName: "Varma",
            email: "shrey@gmail.com",
            phone: "9876543210",
            dateOfBirth: "2002-05-10",
            course: "React",
            batch: "Batch 1",
            startDate: "2026-01-10",
            trainer: "Rahul Sharma",
            experience: 1,
            status: "Active",
            score: 85,
            pendingAssignments: 2,
          });
          authService.activateStudentAccount("shrey@gmail.com");
          await refreshStudents();
        } catch {}
      }
      localStorage.setItem(FLAG, "true");
    };
    restore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------------------------------------------------------
  // Deactivate / Activate handlers
  // -------------------------------------------------------------------------
  const handleDeactivate = (email: string) => {
    // Block login if they have an auth account
    authService.deactivateStudentAccount(email);
    // Always record in our local deactivated set
    const next = new Set(deactivatedEmails);
    next.add(email.trim().toLowerCase());
    saveDeactivatedEmails(next);
    setDeactivatedEmails(next);
    toast.success("Student account deactivated");
  };

  const handleActivate = (email: string) => {
    // Restore login if they have an auth account
    authService.activateStudentAccount(email);
    // Remove from our local deactivated set
    const next = new Set(deactivatedEmails);
    next.delete(email.trim().toLowerCase());
    saveDeactivatedEmails(next);
    setDeactivatedEmails(next);
    toast.success("Student account activated");
  };

  // -------------------------------------------------------------------------
  // Delete handler
  // -------------------------------------------------------------------------
  const handleDelete = async () => {
    if (deleteStudentId === null) return;
    try {
      setDeleteLoading(true);
      await studentService.deleteStudent(deleteStudentId);
      toast.success("Student deleted successfully");
      setDeleteStudentId(null);
      setDeleteStudentName("");
      await refreshStudents();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Unable to delete student."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // -------------------------------------------------------------------------
  // Columns
  // -------------------------------------------------------------------------
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 1.2,
      valueGetter: (_value, row) => `${row.firstName} ${row.lastName}`,
    },
    { field: "email", headerName: "Email", flex: 1.4 },
    { field: "course", headerName: "Course", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "score", headerName: "Score", flex: 0.7 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 2,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const email = (params.row.email as string).trim().toLowerCase();
        const isDeactivated = deactivatedEmails.has(email);

        return (
          <Box sx={{ display: "flex", gap: 0.5, alignItems: "center", height: "100%" }}>
            {/* View */}
            <Tooltip title="View">
              <Button size="small" onClick={() => router.push(`/students/${params.row.id}`)}>
                <VisibilityIcon fontSize="small" />
              </Button>
            </Tooltip>

            {/* Edit */}
            <Tooltip title="Edit">
              <Button size="small" onClick={() => router.push(`/students/${params.row.id}/edit`)}>
                <EditIcon fontSize="small" />
              </Button>
            </Tooltip>

            {/* Deactivate ↔ Activate toggle */}
            {isDeactivated ? (
              <Tooltip title="Activate login">
                <Button size="small" color="success" onClick={() => handleActivate(params.row.email)}>
                  <CheckCircleIcon fontSize="small" />
                </Button>
              </Tooltip>
            ) : (
              <Tooltip title="Deactivate login">
                <Button size="small" color="warning" onClick={() => handleDeactivate(params.row.email)}>
                  <BlockIcon fontSize="small" />
                </Button>
              </Tooltip>
            )}

            {/* Permanent delete */}
            <Tooltip title="Delete permanently">
              <Button
                size="small"
                color="error"
                onClick={() => {
                  setDeleteStudentId(params.row.id);
                  setDeleteStudentName(`${params.row.firstName} ${params.row.lastName}`);
                }}
              >
                <DeleteIcon fontSize="small" />
              </Button>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Loading />
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Box sx={{ padding: 3 }}>
          <Alert severity="error" action={<Button color="inherit" size="small" onClick={refreshStudents}>Retry</Button>}>
            {error}
          </Alert>
        </Box>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <Box sx={{ padding: { xs: 2, md: 4 } }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3, flexWrap: "wrap", gap: 1 }}>
          <Typography variant="h4">Students</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => router.push("/students/add")}>
            Add Student
          </Button>
        </Box>

        {students.length === 0 ? (
          <Alert severity="info" action={<Button color="inherit" size="small" onClick={() => router.push("/students/add")}>Add Student</Button>}>
            No students found.
          </Alert>
        ) : (
          <Paper sx={{ width: "100%" }}>
            <DataGrid
              rows={students}
              columns={columns}
              autoHeight
              pageSizeOptions={[5, 10, 25]}
              initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
              disableRowSelectionOnClick
            />
          </Paper>
        )}

        <ConfirmDialog
          open={deleteStudentId !== null}
          studentName={deleteStudentName}
          loading={deleteLoading}
          onCancel={() => {
            if (deleteLoading) return;
            setDeleteStudentId(null);
            setDeleteStudentName("");
          }}
          onConfirm={handleDelete}
        />
      </Box>
    </ProtectedRoute>
  );
}
