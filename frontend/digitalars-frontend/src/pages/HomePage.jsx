import { Box, Button, Typography } from '@mui/material';

function HomePage() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" color="primary">
        Digital ARS
      </Typography>

      <Typography sx={{ mt: 2 }}>
        Frontend funcionando correctamente.
      </Typography>

      <Button variant="contained" sx={{ mt: 3 }}>
        Continuar
      </Button>
    </Box>
  );
}

export default HomePage;