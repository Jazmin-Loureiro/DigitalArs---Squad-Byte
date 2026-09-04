import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  Card,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

import {
  Clear as ClearIcon,
  PeopleAltOutlined as PeopleIcon,
  PersonAddOutlined,
  Search as SearchIcon,
} from "@mui/icons-material";

import userService from "../services/userService";
import UserTable from "../components/UserTable";
import UserFormDialog from "../components/UserFormDialog";
import ConfirmDialog from "../components/ConfirmDialog";
import { useAuth } from "../hooks/useAuth";
import FeedbackSnackbar from "../components/FeedbackSnackbar";

function AdminPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Estados de modales
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [selectedUser, setSelectedUser] = useState(null);
  const [saving, setSaving] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Notificaciones
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers(page + 1, rowsPerPage, search);
      const list = data.items || data.data || [];
      const total = data.totalCount ?? data.totalItems ?? list.length;
      setUsers(list);
      setTotalCount(total);
    } catch {
      setSnackbar({
        open: true,
        message: "Error al cargar los usuarios desde la API.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenCreate = () => {
    setFormMode("create");
    setSelectedUser(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (user) => {
    setFormMode("edit");
    setSelectedUser(user);
    setFormOpen(true);
  };

  const handleSaveUser = async (formData) => {
    try {
      setSaving(true);
      const isCreate = formMode === "create";

      if (isCreate) {
        await userService.createUser({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          password: formData.password,
          roleId: Number(formData.roleId),
        });
      } else {
        await userService.updateUser(selectedUser.id, {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
        });
      }

      setSnackbar({
        open: true,
        message: `Usuario ${isCreate ? "creado" : "actualizado"} exitosamente.`,
        severity: "success",
      });
      setFormOpen(false);
      fetchUsers();
    } catch (error) {
      const msg =
        error.response?.data?.message || "Error al guardar los cambios.";
      setSnackbar({ open: true, message: msg, severity: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleOpenDelete = (user) => {
    setUserToDelete(user);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      setDeleting(true);
      await userService.deleteUser(userToDelete.id);
      setSnackbar({
        open: true,
        message: "Usuario dado de baja exitosamente.",
        severity: "success",
      });
      setDeleteOpen(false);
      fetchUsers();
    } catch (error) {
      const msg =
        error.response?.data?.message || "No se pudo dar de baja al usuario.";
      setSnackbar({ open: true, message: msg, severity: "error" });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
        <PeopleIcon sx={{ color: "primary.dark", fontSize: 32 }} />
        <Typography
          variant="h4"
          component="h1"
          fontWeight={700}
          sx={{ color: "#1E3A5F" }}
        >
          Gestión de Usuarios
        </Typography>
      </Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Administrá el acceso, roles y estados de los usuarios de Digital ARS.
      </Typography>

      <Card
        elevation={0}
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        {/* Barra de herramientas: Búsqueda y Botón de Acción */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            gap: 2,
            mb: 3,
          }}
        >
          <TextField
            size="small"
            placeholder="Buscar por nombre o correo..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            sx={{
              width: { xs: "100%", sm: 320 },
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "background.paper",
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: search ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearch("")}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              },
            }}
          />

          {/* Botón de acción con estilo fintech */}
          <Button
            variant="contained"
            startIcon={<PersonAddOutlined />}
            onClick={handleOpenCreate}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.9rem",
              borderRadius: 2,
              px: 2.5,
              py: 1,
              bgcolor: "#1E3A5F",
              boxShadow: "0 2px 8px rgba(30, 58, 95, 0.25)",
              "&:hover": {
                bgcolor: "#152a45",
                boxShadow: "0 4px 12px rgba(30, 58, 95, 0.35)",
              },
            }}
          >
            Crear usuario
          </Button>
        </Box>

        <UserTable
          users={users}
          totalCount={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          loading={loading}
          currentUserId={currentUser?.id}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      </Card>

      <UserFormDialog
        open={formOpen}
        mode={formMode}
        user={selectedUser}
        saving={saving}
        onClose={() => setFormOpen(false)}
        onSave={handleSaveUser}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Confirmar Baja de Usuario"
        content={`¿Estás seguro de que querés dar de baja a ${userToDelete?.firstName || ""} ${userToDelete?.lastName || ""} (${userToDelete?.email || ""})?`}
        confirmText="Confirmar Baja"
        confirmColor="error"
        loading={deleting}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      <FeedbackSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </Box>
  );
}

export default AdminPage;
