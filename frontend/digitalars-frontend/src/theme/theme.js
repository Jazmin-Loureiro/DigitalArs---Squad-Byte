import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563EB',
      dark: '#1E3A5F',
      light: '#EAF4FF',
    },
    secondary: {
      main: '#3B82F6',
    },
    success: {
      main: '#16A34A',
    },
    warning: {
      main: '#D97706',
    },
    error: {
      main: '#DC2626',
    },
    background: {
      default: '#F7F9FC',
      paper: '#FFFFFF',
    },
  },

  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },

  shape: {
    borderRadius: 12,
  },

  spacing: 8,
});

export default theme;