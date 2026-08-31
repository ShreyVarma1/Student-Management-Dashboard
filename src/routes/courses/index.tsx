"use client";

import {
  Box,
  Button,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  DataGrid,
  GridColDef,
  GridToolbar,
} from "@mui/x-data-grid";

import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import ProtectedRoute from "../../components/route/route";

import {
  courseService,
} from "../../services/courses_services";

import { useCourses } from "../../hooks/use_courses";

import type {
  Course,
} from "../../types/courses";

export default function CoursesPage() {
  const router = useRouter();

  // --------------------------------
  // COURSES HOOK
  // --------------------------------

  const {
    courses,
    loading,
    error,
    refreshCourses,
  } = useCourses();

  // --------------------------------
  // DELETE COURSE
  // --------------------------------

  const handleDelete = async (
    id: number
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this course?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await courseService.deleteCourse(id);

      toast.success(
        "Course deleted successfully"
      );

      await refreshCourses();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to delete course."
      );
    }
  };

  // --------------------------------
  // DATA GRID COLUMNS
  // --------------------------------

  const columns: GridColDef<Course>[] = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
    },

    {
      field: "name",
      headerName: "Course Name",
      flex: 1,
      minWidth: 180,
    },

    {
      field: "trainer",
      headerName: "Trainer",
      flex: 1,
      minWidth: 180,
    },

    {
      field: "duration",
      headerName: "Duration",
      flex: 1,
      minWidth: 140,

      valueFormatter: (value) =>
        `${value} weeks`,
    },

    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 130,
    },

    {
      field: "enrolledStudents",
      headerName: "Students",
      type: "number",
      width: 120,
    },

    // --------------------------------
    // ACTIONS
    // --------------------------------

    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      width: 160,

      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            gap: 0.5,
            alignItems: "center",
            height: "100%",
          }}
        >
          {/* VIEW */}

          <Tooltip title="View Course">
            <IconButton
              size="small"
              color="primary"
              onClick={() =>
                router.push(
                  `/courses/${params.row.id}`
                )
              }
            >
              <VisibilityIcon
                fontSize="small"
              />
            </IconButton>
          </Tooltip>

          {/* EDIT */}

          <Tooltip title="Edit Course">
            <IconButton
              size="small"
              color="primary"
              onClick={() =>
                router.push(
                  `/courses/${params.row.id}/edit`
                )
              }
            >
              <EditIcon
                fontSize="small"
              />
            </IconButton>
          </Tooltip>

          {/* DELETE */}

          <Tooltip title="Delete Course">
            <IconButton
              size="small"
              color="error"
              onClick={() =>
                handleDelete(
                  params.row.id
                )
              }
            >
              <DeleteIcon
                fontSize="small"
              />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  // --------------------------------
  // PAGE
  // --------------------------------

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <Box
        sx={{
          padding: {
            xs: 2,
            md: 4,
          },
        }}
      >
        {/* PAGE HEADER */}

        <Box
          sx={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: 3,
            gap: 2,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
            }}
          >
            Courses
          </Typography>

          {/* ADD COURSE */}

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() =>
              router.push(
                "/courses/add"
              )
            }
          >
            Add Course
          </Button>
        </Box>

        {/* ERROR */}

        {error && (
          <Box
            sx={{
              marginBottom: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography
              color="error"
            >
              {error}
            </Typography>

            <Button
              variant="outlined"
              size="small"
              onClick={refreshCourses}
            >
              Retry
            </Button>
          </Box>
        )}

        {/* COURSE TABLE */}

        <Paper
          sx={{
            width: "100%",
          }}
        >
          <DataGrid
            rows={courses}
            columns={columns}
            loading={loading}
            autoHeight
            disableRowSelectionOnClick
            pageSizeOptions={[
              5,
              10,
              25,
            ]}
            initialState={{
              pagination: {
                paginationModel: {
                  page: 0,
                  pageSize: 10,
                },
              },
            }}
            slots={{
              toolbar: GridToolbar,
            }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
          />
        </Paper>
      </Box>
    </ProtectedRoute>
  );
}