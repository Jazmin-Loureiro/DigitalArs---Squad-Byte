import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

/**
 * Diálogo de confirmación genérico y reutilizable para toda la app.
 */
function ConfirmDialog({
  open,
  title = "Confirmar acción",
  content = "¿Estás seguro de que deseás continuar?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmColor = "primary", // 'error' | 'primary' | 'warning'
  loading = false,
  onClose,
  onConfirm,
}) {
  return (
    <Dialog
      open={open}
      onClose={() => !loading && onClose()}
      maxWidth="xs"
      fullWidth
      disableRestoreFocus
    >
      <DialogTitle sx={{ fontWeight: 700, color: `${confirmColor}.main` }}>
        {title}
      </DialogTitle>

      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={loading} color="inherit">
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          color={confirmColor}
          variant="contained"
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            confirmText
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
