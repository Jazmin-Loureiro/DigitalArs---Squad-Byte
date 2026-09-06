import {
  AccountCircleOutlined,
  AdminPanelSettingsOutlined,
  HomeOutlined,
  LogoutOutlined,
  ReceiptLongOutlined,
} from "@mui/icons-material";

import {
  Avatar,
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Tooltip,
  Typography,
} from "@mui/material";

import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ActionButton from "../components/ActionButton";
import digitalArsLogo from "../assets/brand/digital-ars-logo.svg";

const DRAWER_WIDTH = 270;

function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const isAdmin = user?.roleName?.toLowerCase() === "admin";

  const personalItems = [
    { label: "Inicio", path: "/", icon: <HomeOutlined /> },
    {
      label: "Movimientos",
      path: "/movimientos",
      icon: <ReceiptLongOutlined />,
    },
    { label: "Mi perfil", path: "/perfil", icon: <AccountCircleOutlined /> },
  ];

  const adminDesktopItem = {
    label: "Gestión de Usuarios",
    path: "/admin",
    icon: <AdminPanelSettingsOutlined />,
  };

  const adminMobileItem = {
    label: "Admin",
    path: "/admin",
    icon: <AdminPanelSettingsOutlined />,
  };

  const mobileNavItems = isAdmin
    ? [...personalItems, adminMobileItem]
    : personalItems;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const renderNavButtons = (items) =>
    items.map((item) => {
      const isActive = location.pathname === item.path;
      return (
        <ListItemButton
          key={item.path}
          selected={isActive}
          onClick={() => navigate(item.path)}
          aria-current={isActive ? "page" : undefined}
          sx={{
            minHeight: 46,
            mb: 0.5,
            borderRadius: "radii.sm",
            "&.Mui-selected": {
              bgcolor: "action.selected",
              color: "primary.main",
              "& .MuiListItemIcon-root": { color: "primary.main" },
              "&:hover": { bgcolor: "action.selected" },
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 40,
              color: isActive ? "primary.main" : "text.secondary",
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText
            primary={item.label}
            slotProps={{
              primary: {
                fontSize: "0.92rem",
                fontWeight: isActive ? 600 : 500,
              },
            }}
          />
        </ListItemButton>
      );
    });

  const desktopNavigation = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 3, py: 3 }}
      >
        <Box
          component="img"
          src={digitalArsLogo}
          alt=""
          aria-hidden="true"
          sx={{
            width: 28,
            height: 28,
            flexShrink: 0,
          }}
        />
        <Typography
          variant="h6"
          component="span"
          fontWeight={700}
          color="text.primary"
        >
          Digital ARS
        </Typography>
      </Box>

      <Divider />

      {/* Navegación Desktop */}
      <List sx={{ px: 1.5, py: 2 }}>
        {isAdmin && (
          <>
            <ListSubheader
              disableSticky
              sx={{
                bgcolor: "transparent",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: "uppercase",
                color: "text.secondary",
                px: 1,
                lineHeight: "28px",
              }}
            >
              Administración
            </ListSubheader>
            {renderNavButtons([adminDesktopItem])}
            <Divider sx={{ my: 1.5, mx: 1 }} />
            <ListSubheader
              disableSticky
              sx={{
                bgcolor: "transparent",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: "uppercase",
                color: "text.secondary",
                px: 1,
                lineHeight: "28px",
              }}
            >
              Mi Cuenta
            </ListSubheader>
          </>
        )}
        {renderNavButtons(personalItems)}
      </List>

      {/* Pie del Sidebar Desktop */}
      <Box sx={{ mt: "auto" }}>
        <Divider />
        <Box
          sx={{
            p: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              fontWeight: 600,
              fontSize: "0.82rem",
              flexShrink: 0,
            }}
          >
            {user?.firstName?.charAt(0)}
            {user?.lastName?.charAt(0)}
          </Avatar>

          <Box sx={{ minWidth: 0, flex: 1, overflow: "hidden" }}>
            <Typography
              variant="body2"
              fontWeight={600}
              noWrap
              sx={{
                color: "text.primary",
                lineHeight: 1.2,
                fontSize: "0.86rem",
              }}
              title={`${user?.firstName} ${user?.lastName}`}
            >
              {user?.firstName} {user?.lastName}
            </Typography>

            <Tooltip title={user?.email || ""} arrow placement="top">
              <Typography
                variant="caption"
                color="text.secondary"
                noWrap
                display="block"
                sx={{
                  mt: 0.2,
                  fontSize: "0.74rem",
                  cursor: "default",
                }}
              >
                {user?.email}
              </Typography>
            </Tooltip>
          </Box>

          <ActionButton
            title="Cerrar sesión"
            onClick={handleLogout}
            sx={{
              flexShrink: 0,
              color: "text.secondary",
              "&:hover": {
                color: "error.main",
                bgcolor: "background.subtle",
              },
            }}
          >
            <LogoutOutlined fontSize="small" />
          </ActionButton>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        width: "100%",
        overflowX: "hidden",
      }}
    >
      {/* Sidebar Desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            bgcolor: "background.paper",
            borderColor: "divider",
          },
        }}
      >
        {desktopNavigation}
      </Drawer>

      {/* Contenedor Principal */}
      <Box
        component="main"
        sx={{
          ml: { xs: 0, md: `${DRAWER_WIDTH}px` },
          pt: 3,
          pb: { xs: 14, md: 3 },
          px: { xs: 2, sm: 3 }, // 16px en mobile
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          width: { xs: "100%", md: `calc(100% - ${DRAWER_WIDTH}px)` },
          overflowX: "hidden",
        }}
      >
        <Box sx={{ flex: "1 0 auto", width: "100%" }}>
          <Outlet />
        </Box>

        {/* Footer Desktop */}
        <Box
          component="footer"
          sx={{
            display: { xs: "none", md: "flex" },
            py: 2.5,
            mt: "auto",
            justifyContent: "space-between",
            alignItems: "center",
            opacity: 0.6,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            © 2026 Digital ARS · Todos los derechos reservados
          </Typography>
          <Typography variant="caption" color="text.secondary">
            v1.0.0
          </Typography>
        </Box>
      </Box>

      {/* 1. Cortina degradada: visible solo en mobile */}
      <Box
        sx={{
          display: { xs: "block", md: "none !important" },
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: 120,
          pointerEvents: "none",
          zIndex: (theme) => theme.zIndex.appBar,
          background:
            "linear-gradient(to top, var(--mui-palette-background-default) 15%, transparent 100%)",
        }}
      />

      {/* 2. Menú Flotante Cápsula: visible solo en mobile */}
      <Box
        component="nav"
        aria-label="Navegación móvil"
        sx={{
          display: { xs: "flex", md: "none !important" },
          position: "fixed",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          width: "calc(100% - 32px)",
          maxWidth: 400,
          p: "6px",
          borderRadius: "999px",
          overflow: "hidden",
          zIndex: (theme) => theme.zIndex.appBar + 1,
          justifyContent: "space-between",
          alignItems: "center",
          gap: 0.5,
          bgcolor: "rgba(255, 255, 255, 0.82)",
          border: "1px solid rgba(0, 0, 0, 0.08)",
          boxShadow:
            "0 10px 25px rgba(15, 23, 42, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          ":root.dark &, .dark &": {
            bgcolor: "rgba(30, 41, 59, 0.82)",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            boxShadow:
              "0 12px 30px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
          },
        }}
      >
        {mobileNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Box
              key={item.path}
              onClick={() => navigate(item.path)}
              sx={{
                flex: "1 1 0",
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: "7px",
                px: "4px",
                borderRadius: "999px",
                cursor: "pointer",
                userSelect: "none",
                WebkitTapHighlightColor: "transparent",
                transition: "all 0.2s ease-in-out",
                bgcolor: isActive ? "rgba(0, 105, 168, 0.12)" : "transparent",
                color: isActive ? "primary.main" : "text.secondary",
                ":root.dark &, .dark &": {
                  bgcolor: isActive ? "rgba(0, 188, 255, 0.2)" : "transparent",
                  color: isActive ? "primary.main" : "text.secondary",
                },
                "&:hover": {
                  color: "primary.main",
                },
                "&:active": {
                  transform: "scale(0.95)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "& svg": {
                    fontSize: "1.3rem",
                    transition: "transform 0.2s ease",
                    transform: isActive ? "scale(1.08)" : "scale(1)",
                  },
                }}
              >
                {item.icon}
              </Box>
              <Typography
                component="span"
                sx={{
                  fontSize: "0.68rem",
                  fontWeight: isActive ? 700 : 500,
                  mt: "3px",
                  lineHeight: 1,
                  color: "inherit",
                }}
              >
                {item.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default AppLayout;
