import {
  AccountBalanceWalletOutlined,
  AddOutlined,
  ArrowForwardOutlined,
  ReceiptLongOutlined,
  RefreshOutlined,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

import { useAuth } from '../hooks/useAuth';
import accountService from '../services/accountService';
import { useNavigate } from 'react-router-dom';

/**
 * Dashboard principal de Digital ARS.
 *
 * Presenta al usuario la información más importante de su cuenta
 * después de iniciar sesión. En HU-24 comenzamos por el saldo disponible
 * y sus estados de carga/error.
 */
function HomePage() {
  const { user } = useAuth();

  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBalance, setShowBalance] = useState(true);

  /**
   * Consulta la cuenta del usuario autenticado.
   *
   * Se mantiene esta lógica separada para poder reutilizarla cuando
   * el usuario necesite reintentar la consulta después de un error.
   */
  const loadAccount = async () => {
    try {
      setIsLoading(true);
      setError('');

      const accountData = await accountService.getMyAccount();

      setAccount(accountData);
    } catch (requestError) {
      console.error('Error al obtener la cuenta:', requestError);

      setAccount(null);
      setError('No pudimos consultar tu saldo en este momento.');
    } finally {
      setIsLoading(false);
    }
  };

/**
 * Carga la cuenta cuando se monta el Dashboard.
 *
 * La consulta inicial se realiza dentro del efecto para evitar
 * actualizaciones síncronas de estado desde useEffect.
 */
  useEffect(() => {
    let isMounted = true;

    const fetchAccount = async () => {
      try {
        const accountData = await accountService.getMyAccount();

        if (isMounted) {
          setAccount(accountData);
        }
      } catch (requestError) {
        console.error('Error al obtener la cuenta:', requestError);

        if (isMounted) {
          setAccount(null);
          setError('No pudimos consultar tu saldo en este momento.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchAccount();

    // Evita actualizar el estado si el usuario abandona el Dashboard
    // antes de que finalice la petición a la API.
    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Formatea el saldo utilizando la convención monetaria argentina.
   *
   * Ejemplo:
   * 250000.5 → $ 250.000,50
   */
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
    }).format(amount ?? 0);

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 1100,
        mx: 'auto',
        p: { xs: 3, md: 4 },
      }}
    >
      {/* Encabezado del Dashboard */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          fontWeight={700}
          sx={{ color: '#1E3A5F' }}
        >
          Hola, {user?.firstName || 'bienvenido'}
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Este es el resumen de tu cuenta.
        </Typography>
      </Box>

      {/* Tarjeta principal de saldo */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{
            mb: 2,
            alignItems: 'center',
          }}
        >
          <AccountBalanceWalletOutlined color="primary" />

          <Typography
            variant="h6"
            component="h2"
            fontWeight={600}
            sx={{ color: '#1E3A5F' }}
          >
            Saldo disponible
          </Typography>
        </Stack>

        {/* Mientras la API responde mostramos un estado de carga explícito. */}
        {isLoading && (
          <Stack
            direction="row"
            spacing={2}
            sx={{
              minHeight: 64,
              alignItems: 'center',
            }}
          >
            <CircularProgress size={28} />

            <Typography color="text.secondary">
              Consultando tu saldo...
            </Typography>
          </Stack>
        )}

        {/* Si la consulta falla, ofrecemos una acción clara de recuperación. */}
        {!isLoading && error && (
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                size="small"
                startIcon={<RefreshOutlined />}
                onClick={loadAccount}
              >
                Reintentar
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* El saldo solo se muestra cuando la cuenta fue obtenida correctamente. */}
        {!isLoading && !error && account && (
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: 'center',
            }}
          >
            <Typography
              variant="h3"
              component="p"
              fontWeight={700}
              sx={{
                color: '#1E3A5F',
                fontSize: {
                  xs: '2rem',
                  sm: '3rem',
                },
              }}
            >
              {showBalance ? formatCurrency(account.money) : '$ ••••••••'}
            </Typography>

            <IconButton
              onClick={() => setShowBalance((previous) => !previous)}
              aria-label={
                showBalance
                  ? 'Ocultar saldo disponible'
                  : 'Mostrar saldo disponible'
              }
              size="large"
            >
              {showBalance ? (
                <VisibilityOffOutlined />
              ) : (
                <VisibilityOutlined />
              )}
            </IconButton>
          </Stack>
        )}
      </Paper>
      {/* Acciones principales de la cuenta. En HU-24 funcionan como puntos de entrada. Los flujos completos de depósito y transferencia corresponden a HU-25 y HU-26. */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
          },
          gap: 2,
          mt: 3,
        }}
      >
        <Button
          variant="contained"
          size="large"
          startIcon={<AddOutlined />}
          onClick={() => navigate('/depositar')}
          sx={{
            minHeight: 56,
            fontWeight: 600,
          }}
        >
          Depositar
        </Button>

        <Button
          variant="outlined"
          size="large"
          startIcon={<ArrowForwardOutlined />}
          onClick={() => navigate('/transferir')}
          sx={{
            minHeight: 56,
            fontWeight: 600,
          }}
        >
          Transferir
        </Button>
      </Box>
      {/* Resumen de movimientos recientes. La API actual todavía no expone los movimientos del usuario, por lo que HU-24 presenta un estado vacío real en lugar de simular operaciones que no provienen del backend. */}
    <Box sx={{ mt: 5 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{
          alignItems: {
            xs: 'flex-start',
            sm: 'center',
          },
          justifyContent: 'space-between',
          gap: {
            xs: 1,
            sm: 2,
          },
          mb: 2,
        }}
      >
        {/* Título de la sección. En mobile ocupa su propia línea para conservar legibilidad y evitar que compita por espacio con la acción "Ver todos". */}
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: 'center' }}
        >
          <ReceiptLongOutlined
              color="primary"
              sx={{
                display: {
                xs: 'none',
                sm: 'block',
                },
                }}
          />

          <Typography
            variant="h5"
            component="h2"
            fontWeight={700}
            sx={{
              color: '#1E3A5F',
              fontSize: {
                xs: '1.35rem',
                sm: '1.5rem',
              },
            }}
          >
            Últimos movimientos
          </Typography>
        </Stack>

        <Button
          onClick={() => navigate('/movimientos')}
          endIcon={<ArrowForwardOutlined />}
          sx={{
            alignSelf: {
              xs: 'flex-start',
              sm: 'center',
            },
            textTransform: 'none',
            whiteSpace: 'nowrap',
            fontWeight: 600,
          }}
        >
          Ver todos
        </Button>
      </Stack>

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
        <ReceiptLongOutlined
          sx={{
            fontSize: 44,
            color: 'text.disabled',
            mb: 1,
          }}
        />

        <Typography
          variant="h6"
          component="p"
          fontWeight={600}
          sx={{ color: '#1E3A5F' }}
        >
          Todavía no hay movimientos para mostrar
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            mt: 1,
            maxWidth: 480,
            mx: 'auto',
          }}
        >
          Cuando realices una operación, vas a poder verla acá.
        </Typography>
      </Paper>
    </Box>
    </Box>
  );
}

export default HomePage;