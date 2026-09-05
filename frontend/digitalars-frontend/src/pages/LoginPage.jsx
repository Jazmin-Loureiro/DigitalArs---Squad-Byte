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
  Paper,
  TextField,
  Typography,
} from '@mui/material';

import {
  AccountBalanceWalletOutlined,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from '@mui/icons-material';

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
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <AccountBalanceWalletOutlined
                sx={{
                  color: 'white',
                  fontSize: 32,
                }}
              />
            </Box>

            <Typography
              variant="h4"
              component="h1"
              fontWeight={700}
              sx={{ color: '#1E3A5F' }}
            >
              Digital ARS
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 1, textAlign: 'center' }}
            >
              Ingresá a tu cuenta
            </Typography>
          </Box>

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
              margin="normal"
              disabled={loading}
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
              margin="normal"
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
                mt: 3,
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

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 4, textAlign: 'center' }}
          >
            Tu información está protegida.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default LoginPage;