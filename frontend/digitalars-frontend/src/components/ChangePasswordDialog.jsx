import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";

const INITIAL_PASSWORDS = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function ChangePasswordDialog({ open, onClose, onSave, saving }) {
  const [passwords, setPasswords] = useState(INITIAL_PASSWORDS);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [errors, setErrors] = useState({});

  const handleClose = () => {
    if (saving) return;
    setPasswords(INITIAL_PASSWORDS);
    setErrors({});
    setShowCurrent(false);
    setShowNew(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!passwords.currentPassword) {
      errs.currentPassword = "Ingresá tu contraseña actual.";
    }
    if (!passwords.newPassword) {
      errs.newPassword = "Ingresá la nueva contraseña.";
    } else if (passwords.newPassword.length < 6) {
      errs.newPassword = "Debe tener al menos 6 caracteres.";
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      errs.confirmPassword = "Las contraseñas no coinciden.";
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const success = await onSave(passwords);
    if (success) {
      handleClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      disableRestoreFocus
      slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}
    >
      <DialogTitle sx={{ fontWeight: 700, color: "text.primary" }}>
        Cambiar Contraseña
      </DialogTitle>

      <form onSubmit={handleSubmit} noValidate>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}
        >
          <TextField
            label="Contraseña Actual"
            type={showCurrent ? "text" : "password"}
            fullWidth
            disabled={saving}
            value={passwords.currentPassword}
            onChange={(e) =>
              setPasswords((prev) => ({
                ...prev,
                currentPassword: e.target.value,
              }))
            }
            error={Boolean(errors.currentPassword)}
            helperText={errors.currentPassword}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => setShowCurrent((prev) => !prev)}
                    >
                      {showCurrent ? (
                        <VisibilityOffOutlined />
                      ) : (
                        <VisibilityOutlined />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            label="Nueva Contraseña"
            type={showNew ? "text" : "password"}
            fullWidth
            disabled={saving}
            value={passwords.newPassword}
            onChange={(e) =>
              setPasswords((prev) => ({ ...prev, newPassword: e.target.value }))
            }
            error={Boolean(errors.newPassword)}
            helperText={errors.newPassword || "Mínimo 6 caracteres."}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => setShowNew((prev) => !prev)}
                    >
                      {showNew ? (
                        <VisibilityOffOutlined />
                      ) : (
                        <VisibilityOutlined />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            label="Confirmar Nueva Contraseña"
            type="password"
            fullWidth
            disabled={saving}
            value={passwords.confirmPassword}
            onChange={(e) =>
              setPasswords((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
            error={Boolean(errors.confirmPassword)}
            helperText={errors.confirmPassword}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={saving} color="inherit">
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={saving}
            sx={{ fontWeight: 600 }}
          >
            {saving ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Actualizar"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default ChangePasswordDialog;
