"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface ConfirmDialogProps {
  open: boolean;
  studentName: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function ConfirmDialog({
  open,
  studentName,
  onCancel,
  onConfirm,
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={
        loading
          ? undefined
          : onCancel
      }
    >
      <DialogTitle>
        Delete Student
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          Are you sure you want to
          delete{" "}
          <strong>
            {studentName}
          </strong>
          ?
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          color="error"
          variant="contained"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading
            ? "Deleting..."
            : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}