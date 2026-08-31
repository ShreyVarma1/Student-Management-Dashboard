"use client";
import {useState,} from "react";
import {useRouter,} from "next/navigation";
import {  Alert,  Box,  Button,  Paper,  Typography,} from "@mui/material";
import {  DataGrid, GridColDef,} from "@mui/x-data-grid";
import VisibilityIcon from  "@mui/icons-material/Visibility";
import EditIcon from  "@mui/icons-material/Edit";
import DeleteIcon from  "@mui/icons-material/Delete";
import AddIcon from  "@mui/icons-material/Add";
import { toast,} from "react-toastify";
import {useTrainers,} from "../../hooks/use_trainers";
import {  trainerService,} from "../../services/trainers_services";
import ConfirmDialog from  "../../components/dialog/dialog";
import Loading from  "../../components/loading/loading";
import ProtectedRoute from  "../../components/route/route";

export default function TrainersPage() {
  const router = useRouter();

  const {
    trainers,
    loading,
    error,
    refreshTrainers,
  } = useTrainers();

  const [
    deleteTrainerId,
    setDeleteTrainerId,
  ] = useState<number | null>(
    null
  );

  const [
    deleteTrainerName,
    setDeleteTrainerName,
  ] = useState("");

  const [
    deleteLoading,
    setDeleteLoading,
  ] = useState(false);

  const handleDelete = async () => {
    if (
      deleteTrainerId === null
    ) {
      return;
    }

    try {
      setDeleteLoading(true);

      trainerService.deleteTrainer(
        deleteTrainerId
      );

      toast.success(
        "Trainer deleted successfully"
      );

      setDeleteTrainerId(null);
      setDeleteTrainerName("");

      refreshTrainers();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to delete trainer."
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
      flex: 1.5,
    },

    {
      field: "phone",
      headerName: "Phone",
      flex: 1,
    },

    {
      field: "specialization",
      headerName: "Specialization",
      flex: 1.4,
    },

    {
      field: "experience",
      headerName: "Experience",
      flex: 1,
      valueFormatter: (
        value
      ) =>
        `${value} years`,
    },

    {
      field: "status",
      headerName: "Status",
      flex: 0.9,
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
                `/trainers/${params.row.id}`
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
                `/trainers/${params.row.id}/edit`
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
              setDeleteTrainerId(
                params.row.id
              );

              setDeleteTrainerName(
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
      <ProtectedRoute allowedRoles={["admin"]}>
        <Loading />
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <Box sx={{ padding: 3 }}>
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={
                  refreshTrainers
                }
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        </Box>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
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
            Trainers
          </Typography>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() =>
              router.push(
                "/trainers/add"
              )
            }
          >
            Add Trainer
          </Button>
        </Box>

        {trainers.length === 0 ? (
          <Alert
            severity="info"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() =>
                  router.push(
                    "/trainers/add"
                  )
                }
              >
                Add Trainer
              </Button>
            }
          >
            No trainers found.
          </Alert>
        ) : (
          <Paper
            sx={{
              width: "100%",
            }}
          >
            <DataGrid
              rows={trainers}
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
            deleteTrainerId !== null
          }
          studentName={
            deleteTrainerName
          }
          loading={
            deleteLoading
          }
          onCancel={() => {
            if (deleteLoading) {
              return;
            }

            setDeleteTrainerId(
              null
            );

            setDeleteTrainerName(
              ""
            );
          }}
          onConfirm={
            handleDelete
          }
        />
      </Box>
    </ProtectedRoute>
  );
}