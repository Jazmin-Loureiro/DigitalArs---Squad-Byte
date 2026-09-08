import { Alert, Snackbar } from "@mui/material";

function FeedbackSnackbar({
  open,
  message,
  severity = "success",
  onClose,
  autoHideDuration = 4000,
}) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{ width: "100%", borderRadius: 2 }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

export default FeedbackSnackbar;
