import { Box, Typography } from '@mui/material';

/**
 * Página temporal de Movimientos.
 *
 * En HU-23 solo necesitamos que exista como destino de navegación
 * para validar el funcionamiento del AppLayout.
 *
 * Su contenido funcional se implementará posteriormente en HU-27.
 */
function MovementsPage() {
  return (
    <Box sx={{ p: { xs: 3, md: 4 } }}>
      <Typography
        variant="h4"
        component="h1"
        fontWeight={700}
        sx={{ color: '#1E3A5F' }}
      >
        Movimientos
      </Typography>

      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Esta sección estará disponible próximamente.
      </Typography>
    </Box>
  );
}

export default MovementsPage;