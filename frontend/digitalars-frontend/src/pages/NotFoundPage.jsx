import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import notFoundIllustration from '../assets/illustrations/not-found.svg';

/**
 * Página de recuperación para rutas que no existen.
 *
 * Presenta el error de forma visual y ofrece una acción clara
 * para regresar al Inicio sin exponer información técnica.
 */
function NotFoundPage() {
  const navigate = useNavigate();

  /**
   * Regresa al Inicio y reemplaza la URL inválida en el historial,
   * evitando que el botón "Atrás" vuelva inmediatamente al mismo error.
   */
  const handleGoHome = () => {
    navigate('/', { replace: true });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        justifyContent: 'center',
        px: { xs: 3, sm: 4 },
        py: { xs: 5, sm: 6 },
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 520,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          pt: { xs: 8, sm: 10, md: 12 },
        }}
      >
      <Typography
        component="h1"
        sx={{
          fontSize: { xs: '2.25rem', sm: '2.5rem' },
          lineHeight: 1.1,
          fontWeight: 500,
          color: 'text.primary',
        }}
      >
        OOPS!
      </Typography>

      <Typography
        sx={{
          mt: 1.5,
          fontSize: { xs: '1.125rem', sm: '1.25rem' },
          lineHeight: 1.4,
          fontWeight: 700,
          color: 'text.primary',
        }}
      >
        Página no encontrada
      </Typography>

      {/* La ilustración comunica el error antes de ofrecer la recuperación. */}
      <Box
        sx={{
          mt: 3,
          width: '100%',
          maxWidth: { xs: 340, sm: 380 },
          borderRadius: 4,
          px: { xs: 1, sm: 2 },
          py: { xs: 1, sm: 2 },

          // En modo oscuro aporta contraste a las zonas oscuras del SVG
          // sin modificar los colores originales de la ilustración.
          bgcolor: (theme) =>
            theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.08)'
              : 'transparent',
        }}
      >
        <Box
          component="img"
          src={notFoundIllustration}
          alt="Error 404, página no encontrada"
          sx={{
            display: 'block',
            width: '100%',
            height: 'auto',
          }}
        />
      </Box>

      <Button
        variant="contained"
        size="large"
        onClick={handleGoHome}
        sx={{
          width: { xs: '100%', sm: 245 },
          minHeight: 48,
          mt: 5,
          fontWeight: 600,
        }}
      >
        Volver al inicio
      </Button>
      </Box>
    </Box>
  );
}

export default NotFoundPage;