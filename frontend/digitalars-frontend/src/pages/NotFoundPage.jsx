import { ArrowBackOutlined, SearchOffOutlined } from '@mui/icons-material';
import { Box, Button, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

/**
 * Página de recuperación para rutas que no existen.
 *
 * En lugar de mostrar un error técnico, ofrece un mensaje simple
 * y una acción clara para regresar a un lugar conocido de la aplicación.
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
        minHeight: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 3, md: 4 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 520,
          p: { xs: 3, sm: 5 },
          textAlign: 'center',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
        }}
      >
        <SearchOffOutlined
          color="primary"
          sx={{
            fontSize: 56,
            mb: 2,
          }}
        />

        <Typography
          variant="h4"
          component="h1"
          fontWeight={700}
          sx={{ color: '#1E3A5F' }}
        >
          Página no encontrada
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            mt: 2,
            mb: 4,
          }}
        >
          No pudimos encontrar la página que buscás.
        </Typography>

        <Button
          variant="contained"
          size="large"
          startIcon={<ArrowBackOutlined />}
          onClick={handleGoHome}
          sx={{ minHeight: 48 }}
        >
          Volver al inicio
        </Button>
      </Paper>
    </Box>
  );
}

export default NotFoundPage;