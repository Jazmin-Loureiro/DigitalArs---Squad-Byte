import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import {
  ChevronRightRounded,
  DarkModeOutlined,
  HelpOutlineRounded,
  LockOutlined,
  LogoutRounded,
  NotificationsNoneRounded,
  PersonOutlineRounded,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import userService from "../services/userService";
import UserFormDialog from "../components/UserFormDialog";
import ChangePasswordDialog from "../components/ChangePasswordDialog";
import ConfirmDialog from "../components/ConfirmDialog";
import FeedbackSnackbar from "../components/FeedbackSnackbar";
import AppearanceSwitch from '../components/AppearanceSwitch';

function ProfilePage() {
  const navigate = useNavigate();
  const { updateUser, logout } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await userService.getMyProfile();
        if (isMounted) setProfile(data);
      } catch {
        if (isMounted) {
          setSnackbar({
            open: true,
            message: "No pudimos obtener los datos de tu perfil.",
            severity: "error",
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSaveInfo = async (formData) => {
    try {
      setSaving(true);
      const updated = await userService.updateMyProfile({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
      });

      setProfile((prev) => ({ ...prev, ...updated }));
      if (updateUser) {
        updateUser({
          firstName: updated.firstName,
          lastName: updated.lastName,
        });
      }

      setActiveModal(null);
      setSnackbar({
        open: true,
        message: "Datos personales actualizados con éxito.",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message:
          err.response?.data?.message || "Error al actualizar los datos.",
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSavePassword = async ({ currentPassword, newPassword }) => {
    try {
      setSaving(true);
      await userService.updateMyProfile({
        firstName: profile.firstName,
        lastName: profile.lastName,
        currentPassword,
        newPassword,
      });

      setSnackbar({
        open: true,
        message: "Contraseña actualizada con éxito.",
        severity: "success",
      });
      return true;
    } catch (err) {
      setSnackbar({
        open: true,
        message:
          err.response?.data?.message || "La contraseña actual es incorrecta.",
        severity: "error",
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
        <CircularProgress size={36} />
      </Box>
    );
  }

  const initials =
    `${profile?.firstName?.charAt(0) || ""}${profile?.lastName?.charAt(0) || ""}`.toUpperCase();

  const menuItems = [
    {
      label: "Datos personales",
      icon: <PersonOutlineRounded />,
      action: () => setActiveModal("info"),
    },
    {
      label: "Seguridad y Claves",
      icon: <LockOutlined />,
      action: () => setActiveModal("password"),
    },
    {
      label: "Notificaciones",
      icon: <NotificationsNoneRounded />,
      action: () => setNotificationsEnabled((prev) => !prev),
      customEnd: (
        <Switch
          edge="end"
          color="primary"
          checked={notificationsEnabled}
          onChange={(e) => setNotificationsEnabled(e.target.checked)}
        />
      ),
    },
    {
      label: "Modo oscuro",
      icon: <DarkModeOutlined />,
      customEnd: <AppearanceSwitch />,
    },
    {
      label: "Ayuda y Soporte",
      icon: <HelpOutlineRounded />,
      action: () =>
        setSnackbar({
          open: true,
          message: "Canal de soporte: soporte@digitalars.com",
          severity: "info",
        }),
    },
    {
      label: "Cerrar sesión",
      icon: <LogoutRounded />,
      action: () => setActiveModal("logout"),
      color: "error.main",
      mobileOnly: true,
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        py: { xs: 2, md: 4 },
        px: { xs: 2, md: 3 },
      }}
    >
      {/* Título de página consistente con el resto de las secciones principales. */}
      <Typography
        component="h1"
        variant="h1"
        sx={{
          mb: { xs: 3, md: 4 },
        }}
      >
        Perfil
      </Typography>

      <Box
        sx={{
          width: "100%",
          maxWidth: 480,
          mx: "auto",
        }}
      >
      {/* Resumen del perfil */}
      <Stack sx={{ alignItems: "center", mb: 3 }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: "primary.main",
            color: "primary.contrastText",
            fontSize: "1.65rem",
            fontWeight: 700,
            boxShadow: 2,
            mb: 1.5,
          }}
        >
          {initials || "U"}
        </Avatar>

        <Typography
          variant="h5"
          fontWeight={700}
          color="text.primary"
          sx={{ textAlign: "center" }}
        >
          {profile?.firstName} {profile?.lastName}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.2, mb: 1.5 }}
        >
          {profile?.email}
        </Typography>

        <Chip
          label="Cuenta Verificada"
          size="small"
          variant="outlined"
          color="primary"
          sx={{ fontWeight: 600, borderRadius: 4, px: 0.5 }}
        />
      </Stack>

      {/* Menú del perfil presentado como una lista simple.
          Los divisores separan acciones sin agregar contenedores innecesarios. */}
      <List disablePadding>
        {menuItems.map((item, index) => (
          <Box
            key={item.label}
            sx={{
              display: item.mobileOnly ? { xs: "block", md: "none" } : "block",
            }}
          >
            {index > 0 && <Divider />}

            <ListItem disablePadding secondaryAction={item.customEnd}>
              <ListItemButton
                onClick={item.action}
                sx={{
                  minHeight: 64,
                  px: 1,
                  py: 1.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 48,
                    color: item.color || "text.primary",
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.label}
                  slotProps={{
                    primary: {
                      fontWeight: 600,
                      color: item.color || "text.primary",
                    },
                  }}
                />

                {!item.customEnd && (
                  <ChevronRightRounded
                    sx={{
                      color: item.color ? "error.main" : "text.secondary",
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          </Box>
        ))}
      </List>

      {/* Modales */}
      <UserFormDialog
        open={activeModal === "info"}
        mode="edit"
        user={profile}
        saving={saving}
        onClose={() => setActiveModal(null)}
        onSave={handleSaveInfo}
      />

      <ChangePasswordDialog
        open={activeModal === "password"}
        saving={saving}
        onClose={() => setActiveModal(null)}
        onSave={handleSavePassword}
      />

      <ConfirmDialog
        open={activeModal === "logout"}
        title="¿Cerrar sesión?"
        content="¿Estás seguro de que deseás salir de tu cuenta de Digital ARS?"
        confirmText="Cerrar sesión"
        confirmColor="error"
        onConfirm={() => {
          logout();
          navigate("/login", { replace: true });
        }}
        onClose={() => setActiveModal(null)}
      />

      <FeedbackSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
      </Box>
    </Box>
  );
}

export default ProfilePage;
