import {
  AccountBalanceWalletOutlined,
  AddOutlined,
  ArrowForwardOutlined,
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
import { useColorScheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';

import { useAuth } from '../hooks/useAuth';
import accountService from '../services/accountService';
import transactionService from '../services/transactionService';
import { useNavigate } from 'react-router-dom';

import digitalArsLogo from '../assets/brand/digital-ars-logo.svg';
import balanceWallet from '../assets/illustrations/balance-wallet.svg';
import {
  formatCurrency,
  getTransactionPresentation,
  getTransactionTitle,
  getTransactionSubtext,
} from '../utils/transactionUtils';

/**
 * Dashboard principal de Digital ARS.
 *
 * Presenta al usuario la información más importante de su cuenta
 * después de iniciar sesión. En HU-24 comenzamos por el saldo disponible
 * y sus estados de carga/error.
 */
function HomePage() {
  const { user } = useAuth();
  const { mode } = useColorScheme();

  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBalance, setShowBalance] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [areTransactionsLoading, setAreTransactionsLoading] = useState(true);
  const [transactionsError, setTransactionsError] = useState('');

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
 * Obtiene los cinco movimientos más recientes del usuario.
 *
 * El backend ya los devuelve ordenados de más reciente a más antiguo,
 * por lo que el Dashboard solo solicita la primera página.
 */
useEffect(() => {
  let isMounted = true;

  const fetchRecentTransactions = async () => {
    try {
      setAreTransactionsLoading(true);
      setTransactionsError('');

      const data = await transactionService.getMyTransactions(1, 5);

      if (isMounted) {
        setTransactions(data.items ?? []);
      }
    } catch (requestError) {
      console.error(
        'Error al obtener los movimientos recientes:',
        requestError,
      );

      if (isMounted) {
        setTransactions([]);
        setTransactionsError(
          'No pudimos consultar tus movimientos en este momento.',
        );
      }
    } finally {
      if (isMounted) {
        setAreTransactionsLoading(false);
      }
    }
  };

  fetchRecentTransactions();

  return () => {
    isMounted = false;
  };
}, []);
  // formatCurrency, getTransactionPresentation y formatTransactionDate
  // se importan desde utils/transactionUtils.js para evitar duplicación.

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 1200,
        mx: 'auto',
        px: { xs: 2, sm: 3, md: 4 },
        pt: { xs: 2, md: 2 },
        pb: { xs: 3, md: 2 },
      }}
    >
      {/* Marca Digital ARS. El símbolo se mantiene como asset vectorial y
    el nombre como texto para conservar escalabilidad y accesibilidad. */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          display: { xs: 'flex', md: 'none' },
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Box
          component="img"
          src={digitalArsLogo}
          alt=""
          aria-hidden="true"
          sx={{
            width: 32,
            height: 32,
            flexShrink: 0,
          }}
        />

        <Typography
          variant="h4"
          component="p"
          fontWeight={700}
          color="text.primary"
        >
          Digital ARS
        </Typography>
      </Stack>

      {/* Encabezado del Dashboard */}
      <Box sx={{ mb: { xs: 3, md: 3.5 } }}>
        <Typography
          variant="h4"
          component="h1"
          fontWeight={700}
          color="text.primary"
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
          position: 'relative',
          overflow: 'hidden',
          minHeight: { xs: 210, sm: 230 },
          p: { xs: 2.5, sm: 4 },
          bgcolor: 'background.brandSoft',
          borderRadius: 3,
        }}
      >
        <Stack
          direction="row"
          spacing={0.5}
          sx={{
            mb: 2,
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            fontWeight={700}
            color="text.primary"
          >
            Saldo disponible
          </Typography>

          <IconButton
            onClick={() => setShowBalance((previous) => !previous)}
            aria-label={
              showBalance
                ? 'Ocultar saldo disponible'
                : 'Mostrar saldo disponible'
            }
            size="small"
          >
            {showBalance ? (
              <VisibilityOffOutlined />
            ) : (
              <VisibilityOutlined />
            )}
          </IconButton>
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
            <Typography
              variant="h3"
              component="p"
              fontWeight={700}
              sx={{
                color: 'text.primary',
                fontSize: {
                  xs: '2rem',
                  sm: '3rem',
                },
              }}
            >
              {showBalance ? formatCurrency(account.money) : '$ ••••••••'}
            </Typography>
        )}
        {/* Ilustración decorativa del saldo. Se posiciona fuera del flujo para
    no competir con la información financiera principal. */}
        <Box
          component="img"
          src={balanceWallet}
          alt=""
          aria-hidden="true"
          sx={{
            position: 'absolute',
            right: { xs: -18, sm: 24 },
            bottom: { xs: 8, sm: 16 },
            width: { xs: 150, sm: 200 },
            maxHeight: '80%',
            objectFit: 'contain',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        />
      </Paper>
      {/* Acciones principales de la cuenta. En HU-24 funcionan como puntos de entrada. Los flujos completos de depósito y transferencia corresponden a HU-25 y HU-26. */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: { xs: 1.5, sm: 2 },
          mt: 3,
        }}
      >
        <Button
          variant="contained"
          size="large"
          startIcon={
            <AddOutlined
              sx={{
                display: { xs: 'none', sm: 'block' },
              }}
            />
          }
          onClick={() => navigate('/depositar')}
          sx={{
            minHeight: 56,
            px: { xs: 1, sm: 2.5 },
            fontWeight: 600,
            fontSize: { xs: '0.8125rem', sm: '1rem' },
            whiteSpace: 'nowrap',
          }}
        >
          Ingresar dinero
        </Button>
        <Button
          variant="outlined"
          size="large"
          startIcon={
            <ArrowForwardOutlined
              sx={{
                display: { xs: 'none', sm: 'block' },
              }}
            />
          }
          onClick={() => navigate('/transferir')}
          sx={{
            minHeight: 56,
            px: { xs: 1, sm: 2.5 },
            fontWeight: 600,
            fontSize: { xs: '0.8125rem', sm: '1rem' },
            whiteSpace: 'nowrap',
          }}
        >
          Transferir dinero
        </Button>
      </Box>
      {/* Resumen de los últimos movimientos obtenidos desde el endpoint implementado en HU-17. */}
      <Box sx={{ mt: 4 }}>
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            mb: 2,
          }}
        >
        {/* Encabezado compacto de actividad reciente. El acceso al historial
            permanece visible en la misma fila en todos los tamaños. */}
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: 'center' }}
          >
            <Typography
              variant="h5"
              component="h2"
              fontWeight={700}
              sx={{
                color: 'text.primary',
                fontSize: {
                  xs: '1.125rem',
                  sm: '1.5rem',
                },
                whiteSpace: 'nowrap',
              }}
            >
              Últimos movimientos
            </Typography>
          </Stack>

          <Button
            onClick={() => navigate('/movimientos')}
            endIcon={<ArrowForwardOutlined />}
            sx={{
              flexShrink: 0,
              minWidth: 'auto',
              px: { xs: 0.5, sm: 1 },
              textTransform: 'none',
              whiteSpace: 'nowrap',
              fontWeight: 600,
              fontSize: { xs: '0.8125rem', sm: '1rem' },
            }}
          >
            Ver todos
          </Button>
        </Stack>
        <Paper
          elevation={0}
          sx={{
            px: 0,
            bgcolor: 'transparent',
          }}
        >
          {/* Mientras se consultan los movimientos mostramos un estado de carga. */}
          {areTransactionsLoading ? (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <CircularProgress size={28} />
            </Box>
          ) : transactionsError ? (
            <Alert severity="error" sx={{ my: 2 }}>
              {transactionsError}
            </Alert>
          ) : transactions.length === 0 ? (
            /* Este estado solo se muestra cuando la API responde sin movimientos. */
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography
                variant="body1"
                fontWeight={600}
                color="text.primary"
              >
                Todavía no hay movimientos para mostrar
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Cuando realices una operación, vas a poder verla acá.
              </Typography>
            </Box>
          ) : (
            /* Los movimientos llegan ordenados del más reciente al más antiguo. */
            <Box>
              {transactions.map((transaction, index) => {
                const presentation =
                  getTransactionPresentation(transaction, mode);
                const TransactionIcon = presentation.Icon;
                const title = getTransactionTitle(transaction);
                const subtext = getTransactionSubtext(transaction);

                return (
                  <Box
                    key={transaction.id}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: '40px minmax(0, 1fr) auto',
                        sm: '44px minmax(0, 1fr) auto',
                      },
                      alignItems: 'center',
                      columnGap: { xs: 1.25, sm: 2 },
                      py: { xs: 1.5, sm: 1.5 },
                      borderBottom:
                        index < transactions.length - 1
                          ? '1px solid'
                          : 'none',
                      borderColor: 'divider',
                    }}
                  >
                    {/* Badge circular con borde tenue */}
                    <Box
                      sx={{
                        width: { xs: 40, sm: 44 },
                        height: { xs: 40, sm: 44 },
                        flexShrink: 0,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid',
                        borderColor:
                          presentation.borderColor || presentation.iconColor,
                        bgcolor: presentation.iconBackground,
                        color: presentation.iconColor,
                      }}
                    >
                      <TransactionIcon fontSize="small" />
                    </Box>
                    {/* Título y subtexto (concepto • fecha) */}
                    <Box
                      sx={{
                        flex: 1,
                        minWidth: 0,
                        textAlign: 'left',
                      }}
                    >
                      <Typography
                        variant="body1"
                        fontWeight={700}
                        noWrap
                        sx={{
                          color: 'text.primary',
                          lineHeight: 1.3,
                          fontSize: { xs: '0.875rem', sm: '0.95rem' },
                        }}
                      >
                        {title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        noWrap
                        sx={{
                          fontSize: { xs: '0.8rem', sm: '0.85rem' },
                          mt: 0.2,
                        }}
                      >
                        {subtext}
                      </Typography>
                    </Box>
                    {/* El signo y el color diferencian ingresos y egresos. */}
                    <Typography
                      variant="body1"
                      sx={{
                        flexShrink: 0,
                        textAlign: 'right',
                        fontWeight: 700,
                        color: presentation.amountColor,
                        whiteSpace: 'nowrap',
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                      }}
                    >
                      {presentation.sign}
                      {formatCurrency(transaction.amount)}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
}

export default HomePage;