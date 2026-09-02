import { ArrowForwardOutlined } from '@mui/icons-material';
import { Box, Paper, Typography } from '@mui/material';

/**
 * Página temporal para el flujo de transferencia.
 *
 * HU-24 únicamente necesita que el Dashboard pueda navegar hacia
 * un destino válido. La funcionalidad real de transferencia corresponde
 * a HU-26.
 */
function TransferPage() {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 720,
        mx: 'auto',
        p: { xs: 3, md: 4 },
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        fontWeight={700}
        sx={{ color: '#1E3A5F', mb: 3 }}
      >
        Transferir dinero
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          textAlign: 'center',
        }}
      >
        <ArrowForwardOutlined
          color="primary"
          sx={{ fontSize: 48, mb: 2 }}
        />

        <Typography
          variant="h6"
          component="p"
          fontWeight={600}
          sx={{ color: '#1E3A5F' }}
        >
          Próximamente vas a poder realizar transferencias desde acá.
        </Typography>
      </Paper>
    </Box>
  );
}

export default TransferPage;