import { Box, Typography } from '@mui/material';

/**
 * Página temporal de Mi perfil.
 *
 * En HU-23 funciona únicamente como destino de navegación.
 * La gestión real de los datos del usuario corresponde a HU-28.
 */
function ProfilePage() {
  return (
    <Box sx={{ p: { xs: 3, md: 4 } }}>
      <Typography
        variant="h4"
        component="h1"
        fontWeight={700}
        sx={{ color: '#1E3A5F' }}
      >
        Mi perfil
      </Typography>

      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Esta sección estará disponible próximamente.
      </Typography>
    </Box>
  );
}

export default ProfilePage;