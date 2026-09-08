import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
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
    let ignore = false;

    const load = async () => {
      try {
        setLoading(true);
        const data = await userService.getUsers(page + 1, rowsPerPage, search);
        if (!ignore) {
          const list = data.items || data.data || [];
          const total = data.totalCount ?? data.totalItems ?? list.length;
          setUsers(list);
          setTotalCount(total);
        }
      } catch {
        if (!ignore) {
          setSnackbar({
            open: true,
            message: "Error al cargar los usuarios desde la API.",
            severity: "error",
          });
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      ignore = true;
    };
  }, [page, rowsPerPage, search]);

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
    <Box
      sx={{
        width: "100%",
        maxWidth: 1100,
        mx: "auto",
        px: { xs: 2, md: 4 },
        pt: { xs: 3, md: 4 },
        pb: { xs: 3, md: 4 },
      }}
    >
      {/* Encabezado de página idéntico a MovementsPage */}
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Typography
          component="h1"
          variant="h2"
          sx={{
            mb: { xs: 0, md: 1 },
            textAlign: "left",
          }}
        >
          Gestión de Usuarios
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            display: { xs: "none", md: "block" },
            textAlign: "left",
          }}
        >
          Administrá el acceso, roles y estados de los usuarios de Digital ARS.
        </Typography>
      </Box>

      {/* Contenedor plano sin Card pesada */}
      <Box>
        {/* Barra de herramientas: Búsqueda y Botón */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            gap: 1.5,
            mb: 2,
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
              width: { xs: "100%", sm: 300 },
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "background.paper",
                fontSize: "0.84rem",
              },
              "& .MuiInputBase-input": {
                py: "7.5px",
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
                    <IconButton
                      size="small"
                      aria-label="Limpiar búsqueda"
                      onClick={() => setSearch("")}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              },
            }}
          />

          <Button
            variant="contained"
            startIcon={<PersonAddOutlined />}
            onClick={handleOpenCreate}
            sx={{
              whiteSpace: "nowrap",
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
      </Box>

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
