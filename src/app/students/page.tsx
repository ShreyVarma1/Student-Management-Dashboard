"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";

import { useStudents } from "../../hooks/use_students";
import { useDebounce } from "../../hooks/use_debounce";

import { filterStudents } from "../../utils/students_filter";

import type {
  StudentFilters,
} from "../../types/students";

export default function StudentsPage() {
  const router = useRouter();

  const {
    students,
    loading,
    error,
  } = useStudents();

  const [filters, setFilters] =
    useState<StudentFilters>({
      search: "",
      course: "",
      status: "",
      scoreRange: "",
    });

  const [appliedFilters, setAppliedFilters] =
    useState<StudentFilters>({
      search: "",
      course: "",
      status: "",
      scoreRange: "",
    });

  const debouncedSearch =
    useDebounce(filters.search, 300);

  const filteredStudents = useMemo(() => {
    return filterStudents(
      students,
      {
        ...appliedFilters,
        search: debouncedSearch,
      }
    );
  }, [
    students,
    appliedFilters,
    debouncedSearch,
  ]);

  const courses = useMemo(() => {
    return Array.from(
      new Set(
        students.map(
          (student) => student.course
        )
      )
    );
  }, [students]);

  const handleApplyFilters = () => {
    setAppliedFilters({
      ...filters,
      search: debouncedSearch,
    });
  };

  const handleResetFilters = () => {
    const emptyFilters: StudentFilters = {
      search: "",
      course: "",
      status: "",
      scoreRange: "",
    };

    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 180,
      valueGetter: (
        _value,
        row
      ) =>
        `${row.firstName} ${row.lastName}`,
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
      ),
    },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          padding: 5,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: 3 }}>
        <Alert severity="error">
          {error}
        </Alert>
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
          <Typography variant="h4">
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

      <Paper
        sx={{
          padding: 2,
          marginBottom: 3,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "2fr 1fr 1fr 1fr",
            },
            gap: 2,
          }}
        >
          <TextField
            label="Search by name or email"
            value={filters.search}
            onChange={(event) =>
              setFilters({
                ...filters,
                search: event.target.value,
              })
            }
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>
              Course
            </InputLabel>

            <Select
              value={filters.course}
              label="Course"
              onChange={(event) =>
                setFilters({
                  ...filters,
                  course: event.target.value,
                })
              }
            >
              <MenuItem value="">
                All Courses
              </MenuItem>

              {courses.map((course) => (
                <MenuItem
                  key={course}
                  value={course}
                >
                  {course}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>
              Status
            </InputLabel>

            <Select
              value={filters.status}
              label="Status"
              onChange={(event) =>
                setFilters({
                  ...filters,
                  status:
                    event.target.value as StudentFilters["status"],
                })
              }
            >
              <MenuItem value="">
                All Statuses
              </MenuItem>

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
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>
              Score
            </InputLabel>

            <Select
              value={filters.scoreRange}
              label="Score"
              onChange={(event) =>
                setFilters({
                  ...filters,
                  scoreRange:
                    event.target.value as StudentFilters["scoreRange"],
                })
              }
            >
              <MenuItem value="">
                All Scores
              </MenuItem>

              <MenuItem value="0-50">
                0–50
              </MenuItem>

              <MenuItem value="51-75">
                51–75
              </MenuItem>

              <MenuItem value="76-100">
                76–100
              </MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            marginTop: 2,
          }}
        >
          <Button
            variant="contained"
            onClick={handleApplyFilters}
          >
            Apply
          </Button>

          <Button
            variant="outlined"
            onClick={handleResetFilters}
          >
            Reset
          </Button>
        </Box>
      </Paper>

      {filteredStudents.length === 0 ? (
        <Alert severity="info">
          No students found matching your
          search or filters.
        </Alert>
      ) : (
        <Paper>
          <DataGrid
            rows={filteredStudents}
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
      )}
    </Box>
  );
}