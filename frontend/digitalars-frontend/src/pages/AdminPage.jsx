import { Box, Typography } from '@mui/material';

/**
 * Página temporal del área de Administración.
 *
 * En HU-23 permite validar el acceso restringido por rol y la
 * navegación específica para usuarios Admin.
 *
 * La gestión real de usuarios se implementará posteriormente en HU-29.
 */
function AdminPage() {
  return (
    <Box sx={{ p: { xs: 3, md: 4 } }}>
      <Typography
        variant="h4"
        component="h1"
        fontWeight={700}
        sx={{ color: '#1E3A5F' }}
      >
        Administración
      </Typography>

      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Esta sección está disponible únicamente para administradores.
      </Typography>
    </Box>
  );
}

export default AdminPage;