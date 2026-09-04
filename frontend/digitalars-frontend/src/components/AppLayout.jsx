import {
  AccountBalanceWalletOutlined,
  AccountCircleOutlined,
  AdminPanelSettingsOutlined,
  HomeOutlined,
  LogoutOutlined,
  ReceiptLongOutlined,
} from "@mui/icons-material";

import {
  AppBar,
  Avatar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  IconButton,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Toolbar,
  Typography,
} from "@mui/material";

import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const DRAWER_WIDTH = 260; // De 240 a 260 para que no corte texto

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

  // Distinción de etiquetas según resolución
  const adminDesktopItem = {
    label: "Gestión de Usuarios", // En vez de repetir "Administración"
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

  const currentPath = mobileNavItems.some(
    (item) => item.path === location.pathname,
  )
    ? location.pathname
    : "/";

  const renderNavButtons = (items) =>
    items.map((item) => {
      const isActive = location.pathname === item.path;
      return (
        <ListItemButton
          key={item.path}
          selected={isActive}
          onClick={() => navigate(item.path)}
          aria-current={isActive ? "page" : undefined}
          sx={{ minHeight: 48, mb: 0.5, borderRadius: 2 }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
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
        <AccountBalanceWalletOutlined color="primary" />
        <Typography
          variant="h6"
          component="span"
          fontWeight={700}
          sx={{ color: "#1E3A5F" }}
        >
          Digital ARS
        </Typography>
      </Box>

      <Divider />

      {/* Navegación Desktop: Administración arriba primero */}
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

      {/* Pie del Sidebar Desktop: Perfil + Botón sutil de Cerrar Sesión */}
      {/* Pie del Sidebar Desktop: Usuario + Salida */}
      <Box sx={{ mt: "auto" }}>
        <Divider />
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Avatar
            sx={{
              width: 38,
              height: 38,
              bgcolor: "primary.main",
              fontWeight: 600,
              fontSize: "0.85rem",
              flexShrink: 0,
            }}
          >
            {user?.firstName?.charAt(0)}
            {user?.lastName?.charAt(0)}
          </Avatar>

          <Box sx={{ minWidth: 0, flexGrow: 1, textAlign: "left" }}>
            <Typography
              variant="body2"
              fontWeight={600}
              noWrap
              sx={{ color: "text.primary", lineHeight: 1.2 }}
            >
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              noWrap
              display="block"
              sx={{ mt: 0.2 }}
            >
              {user?.email}
            </Typography>
          </Box>

          <IconButton
            size="small"
            title="Cerrar sesión"
            onClick={handleLogout}
            sx={{
              flexShrink: 0,
              color: "text.secondary",
              "&:hover": {
                color: "error.main",
                bgcolor: "error.lighter",
              },
            }}
          >
            <LogoutOutlined fontSize="small" />
          </IconButton>
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
          },
        }}
      >
        {desktopNavigation}
      </Drawer>

      {/* Header Mobile: Limpio */}
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          display: { xs: "block", md: "none" },
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          zIndex: (theme) => theme.zIndex.appBar,
        }}
      >
        <Toolbar sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AccountBalanceWalletOutlined color="primary" />
          <Typography
            variant="h6"
            component="span"
            fontWeight={700}
            sx={{ color: "#1E3A5F" }}
          >
            Digital ARS
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Contenedor Principal: Flexbox con Footer Sticky en Desktop */}
      <Box
        component="main"
        sx={{
          ml: { xs: 0, md: `${DRAWER_WIDTH}px` },
          pt: { xs: 8, md: 3 },
          pb: { xs: 10, md: 0 },
          px: { xs: 1.5, sm: 3 },
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          width: { xs: "100%", md: `calc(100% - ${DRAWER_WIDTH}px)` },
          overflowX: "hidden",
        }}
      >
        {/* Vista activa */}
        <Box sx={{ flexGrow: 1, pb: { md: 4 } }}>
          <Outlet />
        </Box>

        {/* Footer institucional discreto */}
        <Box
          component="footer"
          sx={{
            display: { xs: "none", md: "flex" },
            py: 2,
            mt: "auto",
            justifyContent: "space-between",
            alignItems: "center",
            opacity: 0.6,
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

      {/* Navegación Inferior Mobile Fija */}
      <BottomNavigation
        value={currentPath}
        onChange={(e, newPath) => {
          e.currentTarget?.blur?.(); // <- Quita el foco del botón tocado
          navigate(newPath);
        }}
        showLabels
        sx={{
          display: { xs: "flex", md: "none" },
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          height: 64,
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          zIndex: (theme) => theme.zIndex.appBar + 1,
        }}
      >
        {mobileNavItems.map((item) => (
          <BottomNavigationAction
            key={item.path}
            label={item.label}
            value={item.path}
            icon={item.icon}
            sx={{ minWidth: 0, px: 0.5 }}
          />
        ))}
      </BottomNavigation>
    </Box>
  );
}

export default AppLayout;
