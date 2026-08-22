"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";

type Student = {
  id: string | number;
  firstName: string;
  lastName: string;
  email: string;
  course: string;
  status: string;
  score: number;
};

function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    fetch("/api/students")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Failed to load students");
        }

        return response.json();
      })
      .then((data: Student[] | { students: Student[] }) => {
        if (active) {
          setStudents(Array.isArray(data) ? data : data.students);
        }
      })
      .catch((fetchError: unknown) => {
        if (active) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Failed to load students"
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return { students, loading, error };
}

export default function StudentsPage() {
  const router = useRouter();

  const {
    students,
    loading,
    error,
  } = useStudents();

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 180,
      valueGetter: (
        _value,
        row
      ) => `${row.firstName} ${row.lastName}`,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 220,
    },
    {
      field: "course",
      headerName: "Course",
      flex: 1,
      minWidth: 140,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
      minWidth: 120,
    },
    {
      field: "score",
      headerName: "Score",
      flex: 0.6,
      minWidth: 100,
      type: "number",
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      flex: 1.2,
      minWidth: 220,
      renderCell: (
        params: GridRenderCellParams
      ) => {
        return (
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
              variant="outlined"
              onClick={() =>
                router.push(
                  `/students/${params.row.id}`
                )
              }
            >
              View
            </Button>

            <Button
              size="small"
              variant="outlined"
              onClick={() =>
                router.push(
                  `/students/${params.row.id}/edit`
                )
              }
            >
              Edit
            </Button>

            <Button
              size="small"
              variant="outlined"
              color="error"
            >
              Delete
            </Button>
          </Box>
        );
      },
    },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: 3 }}>
        <Typography
          variant="h6"
          color="error"
        >
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 3,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            gutterBottom
          >
            Students
          </Typography>

          <Typography variant="body2">
            Manage all students
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() =>
            router.push("/students/add")
          }
        >
          Add Student
        </Button>
      </Box>

      <Paper>
        <DataGrid
          rows={students}
          columns={columns}
          getRowId={(row) => row.id}
          initialState={{
            pagination: {
              paginationModel: {
                page: 0,
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          autoHeight
        />
      </Paper>
    </Box>
  );
}