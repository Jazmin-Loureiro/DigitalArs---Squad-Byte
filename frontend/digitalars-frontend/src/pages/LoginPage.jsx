import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';

import {
  VisibilityOffOutlined,
  VisibilityOutlined,
} from '@mui/icons-material';

import digitalArsLogo from '../assets/brand/digital-ars-logo.svg';
import { useAuth } from '../hooks/useAuth';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Ingresá tu correo electrónico.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Ingresá un correo electrónico válido.';
    }

    if (!password) {
      newErrors.password = 'Ingresá tu contraseña.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoginError('');

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const data = await login(email.trim(), password);

      const roleName = data.user?.roleName?.toLowerCase();

      if (roleName === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setLoginError(
          'El correo electrónico o la contraseña son incorrectos.'
        );
      } else {
        setLoginError(
          'No pudimos iniciar sesión. Intentá nuevamente.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        justifyContent: 'center',
        px: { xs: 3, sm: 4 },
        py: { xs: 5, sm: 7 },
      }}
    >
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          width: '100%',
          maxWidth: 480,
        }}
      >
        {/* Identidad de Digital ARS y contexto de acceso. */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            mt: { xs: 4, sm: 6 },
            mb: { xs: 5.5, sm: 6 },
          }}
        >
        {/* Marca: isotipo + nombre, separados para controlar su escala. */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            component="img"
            src={digitalArsLogo}
            alt=""
            aria-hidden="true"
            sx={{
              width: { xs: 72, sm: 80 },
              height: 'auto',
              display: 'block',
            }}
          />

          <Typography
            component="div"
            sx={{
              mt: 1.25,
              fontSize: { xs: '2rem', sm: '2.25rem' },
              lineHeight: 1.1,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'text.primary',
            }}
          >
            Digital{' '}
            <Box
              component="span"
              sx={{
                color: 'primary.main',
              }}
            >
              ARS
            </Box>
          </Typography>
        </Box>

        <Typography
          variant="body1"
          color="text.primary"
          sx={{
            mt: 2,
            maxWidth: 360,
            lineHeight: 1.5,
          }}
        >
          Tu dinero en pesos, seguro y siempre disponible.
        </Typography>
        </Box>

        <Typography
          component="h1"
          sx={{
            mb: 3,
            fontSize: { xs: '1rem', sm: '1.125rem' },
            lineHeight: 1.4,
            fontWeight: 700,
          }}
        >
          Ingresá a tu cuenta
        </Typography>

        {loginError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {loginError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);

              if (errors.email) {
                setErrors((previous) => ({
                  ...previous,
                  email: '',
                }));
              }
            }}
            error={Boolean(errors.email)}
            helperText={errors.email}
            autoComplete="email"
            placeholder="nombre@ejemplo.com"
            disabled={loading}
            sx={{ mb: 2.5 }}
          />

          <TextField
            fullWidth
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);

              if (errors.password) {
                setErrors((previous) => ({
                  ...previous,
                  password: '',
                }));
              }
            }}
            error={Boolean(errors.password)}
            helperText={errors.password}
            autoComplete="current-password"
            disabled={loading}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowPassword((previous) => !previous)
                      }
                      edge="end"
                      aria-label={
                        showPassword
                          ? 'Ocultar contraseña'
                          : 'Mostrar contraseña'
                      }
                    >
                      {showPassword ? (
                        <VisibilityOffOutlined />
                      ) : (
                        <VisibilityOutlined />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            sx={{
              mt: 4,
              minHeight: 48,
              fontWeight: 600,
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Ingresar'
            )}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default LoginPage;