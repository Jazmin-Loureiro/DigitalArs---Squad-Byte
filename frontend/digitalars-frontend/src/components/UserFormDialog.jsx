import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

function UserFormDialog({ open, mode, user, saving, onClose, onSave }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    roleId: 2,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      if (mode === "edit" && user) {
        setFormData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          password: "",
          roleId: user.roleId || 2,
        });
      } else {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          roleId: 2,
        });
      }
      setErrors({});
    }
  }, [open, mode, user]);

  const validate = () => {
    const errs = {};
    if (!formData.firstName.trim())
      errs.firstName = "El nombre es obligatorio.";
    if (!formData.lastName.trim())
      errs.lastName = "El apellido es obligatorio.";

    if (mode === "create") {
      if (!formData.email.trim()) {
        errs.email = "El email es obligatorio.";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errs.email = "Formato de correo inválido.";
      }
      if (!formData.password) {
        errs.password = "La contraseña es obligatoria.";
      } else if (formData.password.length < 6) {
        errs.password = "Mínimo 6 caracteres.";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(formData);
  };

  return (
    <Dialog
      open={open}
      onClose={() => !saving && onClose()}
      maxWidth="sm"
      fullWidth
      disableRestoreFocus
    >
      <DialogTitle sx={{ fontWeight: 700, color: "#1E3A5F" }}>
        {mode === "create" ? "Nuevo Usuario" : "Editar Usuario"}
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <DialogContent
          dividers
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <TextField
              fullWidth
              label="Nombre"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              error={Boolean(errors.firstName)}
              helperText={errors.firstName}
              disabled={saving}
            />
            <TextField
              fullWidth
              label="Apellido"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              error={Boolean(errors.lastName)}
              helperText={errors.lastName}
              disabled={saving}
            />
          </Box>

          <TextField
            fullWidth
            label="Correo electrónico"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            error={Boolean(errors.email)}
            helperText={errors.email}
            disabled={saving || mode === "edit"}
          />

          {mode === "create" && (
            <>
              <TextField
                fullWidth
                label="Contraseña"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                error={Boolean(errors.password)}
                helperText={errors.password}
                disabled={saving}
              />
              <FormControl fullWidth disabled={saving}>
                <InputLabel id="role-select-label">Rol</InputLabel>
                <Select
                  labelId="role-select-label"
                  value={formData.roleId}
                  label="Rol"
                  onChange={(e) =>
                    setFormData({ ...formData, roleId: e.target.value })
                  }
                >
                  <MenuItem value={1}>Administrador</MenuItem>
                  <MenuItem value={2}>Usuario Regular</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} disabled={saving} color="inherit">
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? (
              <CircularProgress size={22} color="inherit" />
            ) : mode === "create" ? (
              "Crear"
            ) : (
              "Guardar"
            )}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default UserFormDialog;
