import {
  AccountBalanceWalletOutlined,
  AccountCircleOutlined,
  AdminPanelSettingsOutlined,
  HomeOutlined,
  LogoutOutlined,
  ReceiptLongOutlined,
} from '@mui/icons-material';

import {
  AppBar,
  Avatar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';

import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';

// Ancho fijo de la navegación lateral en desktop.
const DRAWER_WIDTH = 240;

/**
 * Layout principal para usuarios autenticados.
 *
 * Desktop:
 * - navegación lateral persistente;
 * - identidad del usuario;
 * - acción explícita para cerrar sesión.
 *
 * Mobile:
 * - header simplificado;
 * - navegación inferior con icono + texto.
 *
 * Outlet representa el contenido de la página activa.
 */
function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

/**
 * Destinos principales disponibles para todos los usuarios autenticados.
 *
 * Depositar y Transferir no forman parte de esta navegación porque
 * son acciones financieras que estarán disponibles desde Inicio.
 */
const navigationItems = [
  {
    label: 'Inicio',
    path: '/',
    icon: <HomeOutlined />,
  },
  {
    label: 'Movimientos',
    path: '/movimientos',
    icon: <ReceiptLongOutlined />,
  },
  {
    label: 'Mi perfil',
    path: '/perfil',
    icon: <AccountCircleOutlined />,
  },
];

/**
 * Los administradores reciben un destino adicional en la navegación.
 * La visibilidad del enlace mejora la experiencia, pero la seguridad
 * real sigue estando en ProtectedRoute: ocultar un enlace por sí solo
 * no impide que alguien intente acceder directamente a una URL.
 */
if (user?.roleName?.toLowerCase() === 'admin') {
  navigationItems.push({
    label: 'Administración',
    path: '/admin',
    icon: <AdminPanelSettingsOutlined />,
  });
}

  /**
   * Cierra la sesión mediante AuthProvider y devuelve al usuario
   * al Login. El uso de replace evita conservar la página privada
   * anterior como destino inmediato del botón "Atrás".
   */
  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  /**
   * Determina qué destino de navegación corresponde a la ruta actual.
   * Esto permite mantener un estado seleccionado visible.
   */
  const currentPath = navigationItems.some(
    (item) => item.path === location.pathname
  )
    ? location.pathname
    : '/';

  /**
   * Contenido compartido de la navegación desktop.
   * Cada opción utiliza texto además de icono para reducir ambigüedad.
   */
  const desktopNavigation = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Identidad de Digital ARS */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 3,
          py: 3,
        }}
      >
        <AccountBalanceWalletOutlined color="primary" />

        <Typography
          variant="h6"
          component="span"
          fontWeight={700}
          sx={{ color: '#1E3A5F' }}
        >
          Digital ARS
        </Typography>
      </Box>

      <Divider />

      {/* Navegación principal */}
      <List sx={{ px: 1.5, py: 2 }}>
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <ListItemButton
              key={item.path}
              selected={isActive}
              onClick={() => navigate(item.path)}
              aria-current={isActive ? 'page' : undefined}
              sx={{
                minHeight: 48,
                mb: 0.5,
                borderRadius: 2,
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>

              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>

      {/* Empuja la identidad y logout hacia el pie del sidebar. */}
      <Box sx={{ mt: 'auto' }}>
        <Divider />

        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              mb: 2,
            }}
          >
            <Avatar sx={{ width: 40, height: 40 }}>
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Typography fontWeight={600} noWrap>
                {user?.firstName} {user?.lastName}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                noWrap
              >
                {user?.email}
              </Typography>
            </Box>
          </Box>

          <Button
            fullWidth
            startIcon={<LogoutOutlined />}
            onClick={handleLogout}
            sx={{
              justifyContent: 'flex-start',
              minHeight: 44,
            }}
          >
            Cerrar sesión
          </Button>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar desktop. Se oculta en pantallas pequeñas. */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        {desktopNavigation}
      </Drawer>

      {/* Header mobile. */}
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          display: { xs: 'block', md: 'none' },
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <AccountBalanceWalletOutlined
            color="primary"
            sx={{ mr: 1 }}
          />

          <Typography
            variant="h6"
            component="span"
            fontWeight={700}
            sx={{
              color: '#1E3A5F',
              flexGrow: 1,
            }}
          >
            Digital ARS
          </Typography>

          {/*
           * En mobile usamos una acción explícita en lugar de hacer
           * que el avatar cierre sesión, evitando una interacción ambigua.
           */}
          <Button
            onClick={handleLogout}
            startIcon={<LogoutOutlined />}
            size="small"
          >
            Salir
          </Button>
        </Toolbar>
      </AppBar>

      {/* Área donde React Router renderiza la página activa. */}
      <Box
        component="main"
        sx={{
          ml: { xs: 0, md: `${DRAWER_WIDTH}px` },
          pt: { xs: 8, md: 0 },
          pb: { xs: 9, md: 0 },
          minHeight: '100vh',
        }}
      >
        <Outlet />
      </Box>

      {/* Navegación inferior para mobile. */}
      <BottomNavigation
        value={currentPath}
        onChange={(_, newPath) => navigate(newPath)}
        showLabels
        sx={{
          display: { xs: 'flex', md: 'none' },
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          height: 72,
          borderTop: '1px solid',
          borderColor: 'divider',
          zIndex: (theme) => theme.zIndex.appBar,
        }}
      >
        {navigationItems.map((item) => (
          <BottomNavigationAction
            key={item.path}
            label={item.label}
            value={item.path}
            icon={item.icon}
          />
        ))}
      </BottomNavigation>
    </Box>
  );
}

export default AppLayout;