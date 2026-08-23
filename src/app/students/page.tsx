"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  Alert,
  Box,
  Button,
  Paper,
  Typography,
} from "@mui/material";

import {
  DataGrid,
  GridColDef,
} from "@mui/x-data-grid";

import VisibilityIcon from
  "@mui/icons-material/Visibility";

import EditIcon from
  "@mui/icons-material/Edit";

import DeleteIcon from
  "@mui/icons-material/Delete";

import AddIcon from
  "@mui/icons-material/Add";

import {
  toast,
} from "react-toastify";

import {
  useStudents,
} from "../../hooks/use_students";

import {
  studentService,
} from "../../services/students_services";

import ConfirmDialog from
  "../../components/dialog/dialog";

import Loading from
  "../../components/loading/loading";

export default function StudentsPage() {
  const router = useRouter();

  const {
    students,
    loading,
    error,
    refreshStudents,
  } = useStudents();

  const [
    deleteStudentId,
    setDeleteStudentId,
  ] = useState<number | null>(
    null
  );

  const [
    deleteStudentName,
    setDeleteStudentName,
  ] = useState("");

  const [
    deleteLoading,
    setDeleteLoading,
  ] = useState(false);

  const handleDelete = async () => {
    if (
      deleteStudentId === null
    ) {
      return;
    }

    try {
      setDeleteLoading(true);

      await studentService.deleteStudent(
        deleteStudentId
      );

      toast.success(
        "Student deleted successfully"
      );

      setDeleteStudentId(null);
      setDeleteStudentName("");

      await refreshStudents();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to delete student."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 1.2,
      valueGetter: (
        _value,
        row
      ) =>
        `${row.firstName} ${row.lastName}`,
    },

    {
      field: "email",
      headerName: "Email",
      flex: 1.4,
    },

    {
      field: "course",
      headerName: "Course",
      flex: 1,
    },

    {
      field: "status",
      headerName: "Status",
      flex: 1,
    },

    {
      field: "score",
      headerName: "Score",
      flex: 0.7,
    },

    {
      field: "actions",
      headerName: "Actions",
      flex: 1.5,
      sortable: false,
      filterable: false,

      renderCell: (
        params
      ) => (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            height: "100%",
          }}
        >
          <Button
            size="small"
            onClick={() =>
              router.push(
                `/students/${params.row.id}`
              )
            }
            title="View"
          >
            <VisibilityIcon fontSize="small" />
          </Button>

          <Button
            size="small"
            onClick={() =>
              router.push(
                `/students/${params.row.id}/edit`
              )
            }
            title="Edit"
          >
            <EditIcon fontSize="small" />
          </Button>

          <Button
            size="small"
            color="error"
            onClick={() => {
              setDeleteStudentId(
                params.row.id
              );

              setDeleteStudentName(
                `${params.row.firstName} ${params.row.lastName}`
              );
            }}
            title="Delete"
          >
            <DeleteIcon fontSize="small" />
          </Button>
        </Box>
      ),
    },
  ];

  if (loading) {
    return (
      <Loading />
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: 3 }}>
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={
                refreshStudents
              }
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: {
          xs: 2,
          md: 4,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: 3,
        }}
      >
        <Typography variant="h4">
          Students
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() =>
            router.push(
              "/students/add"
            )
          }
        >
          Add Student
        </Button>
      </Box>

      {students.length === 0 ? (
        <Alert
          severity="info"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() =>
                router.push(
                  "/students/add"
                )
              }
            >
              Add Student
            </Button>
          }
        >
          No students found.
        </Alert>
      ) : (
        <Paper
          sx={{
            width: "100%",
          }}
        >
          <DataGrid
            rows={students}
            columns={columns}
            autoHeight
            pageSizeOptions={[
              5,
              10,
              25,
            ]}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                  page: 0,
                },
              },
            }}
            disableRowSelectionOnClick
          />
        </Paper>
      )}

      <ConfirmDialog
        open={
          deleteStudentId !== null
        }
        studentName={
          deleteStudentName
        }
        loading={
          deleteLoading
        }
        onCancel={() => {
          if (
            deleteLoading
          ) {
            return;
          }

          setDeleteStudentId(
            null
          );

          setDeleteStudentName(
            ""
          );
        }}
        onConfirm={
          handleDelete
        }
      />
    </Box>
  );
}