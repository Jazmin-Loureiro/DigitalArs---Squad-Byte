import {
  AccountBalanceWalletOutlined,
  CheckCircleOutlineOutlined,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import accountService from '../services/accountService';

const MAX_DEPOSIT_AMOUNT = 500000;

/**
 * Página para realizar depósitos en la cuenta del usuario autenticado.
 *
 * Permite ingresar el monto y un concepto opcional, valida los datos
 * antes de enviarlos y muestra una confirmación clara cuando la
 * operación finaliza correctamente.
 */
function DepositPage() {
  const navigate = useNavigate();

  const [amount, setAmount] = useState('');
  const [concept, setConcept] = useState('');
  const [amountError, setAmountError] = useState('');
  const [conceptError, setConceptError] = useState('');
  const [requestError, setRequestError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [depositResult, setDepositResult] = useState(null);

  /**
   * Formatea importes utilizando la convención monetaria argentina.
   */
  const formatCurrency = (value) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
    }).format(value ?? 0);

  /**
   * Valida el monto antes de enviar la operación al backend.
   *
   * Estas validaciones anticipan las reglas de HU-15 para brindar
   * feedback inmediato, aunque el backend continúa siendo la fuente
   * definitiva de validación.
   */
  const validateAmount = () => {
    const normalizedAmount = amount.replace(',', '.').trim();

    if (!normalizedAmount) {
      setAmountError('Ingresá un monto.');
      return null;
    }

    if (!/^\d+([.,]\d{1,2})?$/.test(amount.trim())) {
      setAmountError('Ingresá un monto válido con hasta 2 decimales.');
      return null;
    }

    const numericAmount = Number(normalizedAmount);

    if (numericAmount <= 0) {
      setAmountError('El monto debe ser mayor a cero.');
      return null;
    }

    if (numericAmount > MAX_DEPOSIT_AMOUNT) {
      setAmountError(
        `El monto máximo por operación es ${formatCurrency(MAX_DEPOSIT_AMOUNT)}.`,
      );
      return null;
    }

    setAmountError('');
    return numericAmount;
  };

  /**
   * Valida el concepto opcional según el límite definido por el backend.
   */
  const validateConcept = () => {
    if (concept.length > 200) {
      setConceptError('El concepto puede tener hasta 200 caracteres.');
      return false;
    }

    setConceptError('');
    return true;
  };

  /**
   * Envía el depósito y conserva el resultado para mostrar una
   * confirmación explícita sin redirigir automáticamente al usuario.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    setRequestError('');

    const numericAmount = validateAmount();
    const isConceptValid = validateConcept();

    if (numericAmount === null || !isConceptValid) {
      return;
    }

    try {
      setIsSubmitting(true);

      const result = await accountService.deposit(
        numericAmount,
        concept.trim(),
      );

      setDepositResult(result);
    } catch (error) {
      console.error('Error al realizar el depósito:', error);

      const backendMessage =
        error.response?.data?.message ||
        error.response?.data?.title ||
        'No pudimos realizar el depósito en este momento. Intentá nuevamente.';

      setRequestError(backendMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Permite comenzar otro depósito sin abandonar la pantalla.
   */
  const handleNewDeposit = () => {
    setAmount('');
    setConcept('');
    setAmountError('');
    setConceptError('');
    setRequestError('');
    setDepositResult(null);
  };

  /**
   * Una vez completada la operación mostramos un estado de éxito
   * independiente del formulario para evitar dudas sobre el resultado.
   */
  if (depositResult) {
    return (
      <Box
        sx={{
          width: '100%',
          maxWidth: 720,
          mx: 'auto',
          px: { xs: 3, md: 4 },
          pt: { xs: 4, md: 6 },
          pb: { xs: 3, md: 4 },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            textAlign: 'center',
          }}
        >
          <CheckCircleOutlineOutlined
            color="success"
            sx={{
              fontSize: 64,
              mb: 2,
            }}
          />

          <Typography
            variant="h4"
            component="h1"
            fontWeight={700}
            sx={{
              color: '#1E3A5F',
              fontSize: {
                xs: '1.75rem',
                sm: '2.125rem',
              },
            }}
          >
            Depósito realizado
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 2 }}>
            Ingresaste {formatCurrency(depositResult.amount)} a tu cuenta.
          </Typography>

          <Box
            sx={{
              mt: 4,
              p: 3,
              borderRadius: 2,
              bgcolor: '#F7F9FC',
            }}
          >
            <Typography color="text.secondary">
              Nuevo saldo
            </Typography>

            <Typography
              variant="h4"
              component="p"
              fontWeight={700}
              sx={{
                color: '#1E3A5F',
                mt: 1,
              }}
            >
              {formatCurrency(depositResult.newBalance)}
            </Typography>
          </Box>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{
              mt: 4,
              justifyContent: 'center',
            }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/')}
              sx={{
                minHeight: 48,
                fontWeight: 600,
              }}
            >
              Volver al inicio
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={handleNewDeposit}
              sx={{
                minHeight: 48,
                fontWeight: 600,
              }}
            >
              Hacer otro depósito
            </Button>
          </Stack>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 720,
        mx: 'auto',
        p: { xs: 3, md: 4 },
      }}
    >
      <Box
        component="nav"
        aria-label="Ruta de navegación"
        sx={{
          mb: 4,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: 'text.secondary',
        }}
      >
        <Button
          onClick={() => navigate('/')}
          sx={{
            minWidth: 'auto',
            p: 0,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Inicio
        </Button>

        <Typography
          component="span"
          color="text.secondary"
          aria-hidden="true"
        >
          /
        </Typography>

        <Typography
          component="span"
          color="text.secondary"
          aria-current="page"
        >
          Depositar dinero
        </Typography>
      </Box>
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h4"
          component="h1"
          fontWeight={700}
          sx={{
            color: '#1E3A5F',
            fontSize: {
              xs: '1.75rem',
              sm: '2.125rem',
            },
          }}
        >
          Depositar dinero
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Sumá dinero a tu cuenta de Digital ARS.
        </Typography>
      </Box>

      <Paper
        component="form"
        onSubmit={handleSubmit}
        noValidate
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
            alignItems: 'center',
            mb: 3,
          }}
        >
          <AccountBalanceWalletOutlined color="primary" />

          <Typography
            variant="h6"
            component="h2"
            fontWeight={600}
            sx={{ color: '#1E3A5F' }}
          >
            Datos del depósito
          </Typography>
        </Stack>

        {requestError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {requestError}
          </Alert>
        )}

        <TextField
          label="Monto a depositar"
          value={amount}
          onChange={(event) => {
            const value = event.target.value;

            /**
             * Solo permite dígitos y un único separador decimal.
             * Aceptamos punto o coma porque ambos son habituales al ingresar
             * importes, aunque luego normalizamos el valor antes de enviarlo.
             */
            if (/^\d*[.,]?\d*$/.test(value)) {
              setAmount(value);

              if (amountError) {
                setAmountError('');
              }
            }
          }}
          error={Boolean(amountError)}
          helperText={
            amountError ||
            `Máximo por operación: ${formatCurrency(MAX_DEPOSIT_AMOUNT)}`
          }
          placeholder="0,00"
          fullWidth
          autoFocus
          disabled={isSubmitting}
          inputMode="decimal"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            },
            htmlInput: {
              'aria-label': 'Monto a depositar',
            },
          }}
        />

        <TextField
          label="Concepto (opcional)"
          value={concept}
          onChange={(event) => {
            setConcept(event.target.value);

            if (conceptError) {
              setConceptError('');
            }
          }}
          error={Boolean(conceptError)}
          helperText={
            conceptError || `${concept.length}/200 caracteres`
          }
          placeholder="Ej.: Ahorro"
          fullWidth
          disabled={isSubmitting}
          slotProps={{
            htmlInput: {
              maxLength: 201,
            },
          }}
          sx={{ mt: 3 }}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={isSubmitting}
          sx={{
            mt: 4,
            minHeight: 56,
            fontWeight: 600,
          }}
        >
          {isSubmitting ? (
            <Stack
              direction="row"
              spacing={1.5}
              sx={{ alignItems: 'center' }}
            >
              <CircularProgress size={22} color="inherit" />
              <span>Procesando...</span>
            </Stack>
          ) : (
            'Depositar dinero'
          )}
        </Button>
      </Paper>
    </Box>
  );
}

export default DepositPage;