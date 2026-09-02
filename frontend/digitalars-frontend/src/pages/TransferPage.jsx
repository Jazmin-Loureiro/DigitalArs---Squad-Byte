import {
  AccountBalanceOutlined,
  SwapHorizOutlined,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Página para iniciar una transferencia desde la cuenta del usuario.
 *
 * El flujo se divide en dos etapas:
 * 1. Ingreso y validación de los datos.
 * 2. Confirmación explícita antes de ejecutar la operación.
 *
 * La integración HTTP se incorporará cuando HU-16 esté disponible,
 * evitando acoplar el frontend a un contrato de API todavía no implementado.
 */
function TransferPage() {
  const navigate = useNavigate();

  const continueButtonRef = useRef(null);
  const [destinationAccountId, setDestinationAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [destinationError, setDestinationError] = useState('');
  const [amountError, setAmountError] = useState('');
  const [requestError, setRequestError] = useState('');
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

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
   * Normaliza el separador decimal antes de convertir el monto.
   */
  const getNumericAmount = () =>
    Number(amount.replace(',', '.').trim());

  /**
   * Valida el identificador de la cuenta destinataria.
   *
   * HU-16 define destinationAccountId como identificador del destino,
   * por lo que evitamos permitir caracteres que no correspondan a un ID.
   */
  const validateDestination = () => {
    const trimmedDestination = destinationAccountId.trim();

    if (!trimmedDestination) {
      setDestinationError('Ingresá la cuenta destinataria.');
      return false;
    }

    if (!/^\d+$/.test(trimmedDestination)) {
      setDestinationError('Ingresá un número de cuenta válido.');
      return false;
    }

    if (Number(trimmedDestination) <= 0) {
      setDestinationError('Ingresá un número de cuenta válido.');
      return false;
    }

    setDestinationError('');
    return true;
  };

  /**
   * Valida el monto antes de avanzar a la confirmación.
   *
   * Las reglas que dependan del backend, como saldo insuficiente,
   * se validarán finalmente al ejecutar la transferencia.
   */
  const validateAmount = () => {
    const normalizedAmount = amount.replace(',', '.').trim();

    if (!normalizedAmount) {
      setAmountError('Ingresá un monto.');
      return false;
    }

    if (!/^\d+([.,]\d{1,2})?$/.test(amount.trim())) {
      setAmountError('Ingresá un monto válido con hasta 2 decimales.');
      return false;
    }

    if (Number(normalizedAmount) <= 0) {
      setAmountError('El monto debe ser mayor a cero.');
      return false;
    }

    setAmountError('');
    return true;
  };
  /**
   * Valida el formulario y abre la confirmación.
   * En esta instancia todavía no se ejecuta ninguna transferencia.
   */
  const handleContinue = (event) => {
    event.preventDefault();

    setRequestError('');

    const isDestinationValid = validateDestination();
    const isAmountValid = validateAmount();

    if (
      !isDestinationValid ||
      !isAmountValid
    ) {
      return;
    }
    /**
     * Quitamos el foco del botón antes de abrir el Dialog para evitar
     * que quede enfocado dentro del contenido que MUI oculta mediante
     * aria-hidden mientras el modal está activo.
     */
    continueButtonRef.current?.blur();
    setIsConfirmationOpen(true);
  };

  /**
   * Regresa al formulario conservando los datos para que el usuario
   * pueda revisarlos o corregirlos antes de confirmar.
   */
  const handleCloseConfirmation = () => {
    setIsConfirmationOpen(false);
  };

  /**
   * HU-16 todavía no está disponible.
   *
   * Este handler será reemplazado por la llamada real al servicio de
   * transferencias cuando conozcamos y verifiquemos el contrato final.
   */
  const handleConfirmTransfer = () => {
    setIsConfirmationOpen(false);
    setRequestError(
      'La transferencia todavía no está disponible. La integración se completará cuando el servicio de transferencias esté habilitado.',
    );
  };

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
          Transferir dinero
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
            textAlign: 'center',
          }}
        >
          Transferir dinero
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            mt: 1,
            textAlign: 'center',
          }}
        >
          Enviá dinero desde tu cuenta de Digital ARS.
        </Typography>
      </Box>

      <Paper
        component="form"
        onSubmit={handleContinue}
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
          <SwapHorizOutlined color="primary" />

          <Typography
            variant="h6"
            component="h2"
            fontWeight={600}
            sx={{ color: '#1E3A5F' }}
          >
            Datos de la transferencia
          </Typography>
        </Stack>

        {requestError && (
          <Alert severity="info" sx={{ mb: 3 }}>
            {requestError}
          </Alert>
        )}

        <TextField
          label="Cuenta destinataria"
          value={destinationAccountId}
          onChange={(event) => {
            const value = event.target.value;

            // El identificador de cuenta admite únicamente dígitos.
            if (/^\d*$/.test(value)) {
              setDestinationAccountId(value);

              if (destinationError) {
                setDestinationError('');
              }
            }
          }}
          error={Boolean(destinationError)}
          helperText={
            destinationError ||
            'Ingresá el número de cuenta de la persona destinataria.'
          }
          placeholder="Ej.: 123"
          fullWidth
          autoFocus
          inputMode="numeric"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <AccountBalanceOutlined />
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          label="Monto a transferir"
          value={amount}
          onChange={(event) => {
            const value = event.target.value;

            /**
             * Solo permite dígitos y un único separador decimal.
             * El monto se normaliza antes de utilizarlo.
             */
            if (/^\d*[.,]?\d*$/.test(value)) {
              setAmount(value);

              if (amountError) {
                setAmountError('');
              }
            }
          }}
          error={Boolean(amountError)}
          helperText={amountError || 'Ingresá el monto que querés enviar.'}
          placeholder="0,00"
          fullWidth
          inputMode="decimal"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            },
          }}
          sx={{ mt: 3 }}
        />

        <TextField
          label="Descripción (opcional)"
          value={description}
          onChange={(event) => {
            setDescription(event.target.value);
          }}
          helperText="Podés agregar brevemente el motivo de la transferencia."
          placeholder="Ej.: Pago de servicios"
          fullWidth
          sx={{ mt: 3 }}
        />

        <Button
          ref={continueButtonRef}
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          sx={{
            mt: 4,
            minHeight: 56,
            fontWeight: 600,
          }}
        >
          Continuar
        </Button>
      </Paper>

      <Dialog
        open={isConfirmationOpen}
        onClose={handleCloseConfirmation}
        fullWidth
        maxWidth="sm"
        aria-labelledby="transfer-confirmation-title"
      >
        <DialogTitle
          id="transfer-confirmation-title"
          sx={{
            color: '#1E3A5F',
            fontWeight: 700,
            pb: 1,
          }}
        >
          Confirmar transferencia
        </DialogTitle>

        <DialogContent>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Revisá los datos antes de continuar.
          </Typography>

          <Stack spacing={2.5}>
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Cuenta destinataria
              </Typography>

              <Typography fontWeight={600} sx={{ mt: 0.5 }}>
                Cuenta {destinationAccountId}
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Monto
              </Typography>

              <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                  mt: 0.5,
                  color: '#1E3A5F',
                }}
              >
                {formatCurrency(getNumericAmount())}
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Descripción
              </Typography>

              <Typography fontWeight={600} sx={{ mt: 0.5 }}>
                {description.trim() || 'Sin descripción'}
              </Typography>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            pt: 1,
            gap: 1,
            flexDirection: {
              xs: 'column-reverse',
              sm: 'row',
            },
          }}
        >
          <Button
            onClick={handleCloseConfirmation}
            variant="outlined"
            size="large"
            sx={{
              minHeight: 48,
              width: {
                xs: '100%',
                sm: 'auto',
              },
              fontWeight: 600,
            }}
          >
            Volver y editar
          </Button>

          <Button
            onClick={handleConfirmTransfer}
            variant="contained"
            size="large"
            sx={{
              minHeight: 48,
              width: {
                xs: '100%',
                sm: 'auto',
              },
              fontWeight: 600,
            }}
          >
            Confirmar transferencia
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TransferPage;