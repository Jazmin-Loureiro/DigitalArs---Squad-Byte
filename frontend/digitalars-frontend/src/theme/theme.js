import { createTheme } from '@mui/material/styles';
import {
  brandColors,
  darkTokens,
  lightTokens,
  radii,
  semanticColors,
  shadows,
  sizing,
  transactionColors,
} from './tokens';

/**
 * Tema principal de Digital ARS.
 *
 * Los esquemas Light y Dark comparten los mismos tokens primitivos
 * de marca, pero utilizan tokens semánticos diferentes para fondos,
 * superficies, textos y estados interactivos.
 *
 * Los componentes deben consumir roles del theme (por ejemplo,
 * text.primary o background.paper) en lugar de colores hardcodeados.
 */
const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'class',
  },

  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: lightTokens.action.primary,
          dark: lightTokens.action.primaryHover,
          light: brandColors[100],
          contrastText: '#FFFFFF',
        },

        secondary: {
          main: brandColors[500],
          dark: brandColors[600],
          light: brandColors[200],
          contrastText: '#0F172A',
        },

        background: {
          default: lightTokens.background.default,
          paper: lightTokens.background.paper,
          subtle: lightTokens.background.subtle,
          brandSoft: lightTokens.background.brandSoft,
        },

        text: {
          primary: lightTokens.text.primary,
          secondary: lightTokens.text.secondary,
          disabled: lightTokens.text.disabled,
        },

        divider: lightTokens.divider,

        success: {
          main: semanticColors.success.light.main,
        },

        warning: {
          main: semanticColors.warning.light.main,
        },

        error: {
          main: semanticColors.error.light.main,
        },

        action: {
          selected: lightTokens.action.selected,
          disabled: lightTokens.action.disabled,
        },

        transaction: {
          deposit: transactionColors.deposit.light,
          incoming: transactionColors.incoming.light,
          outgoing: transactionColors.outgoing.light,
          default: transactionColors.default.light,
        },
      },
    },

    dark: {
      palette: {
        primary: {
          main: darkTokens.action.primary,
          dark: brandColors[400],
          light: brandColors[200],
          contrastText: '#0F172A',
        },

        secondary: {
          main: brandColors[400],
          dark: brandColors[500],
          light: brandColors[200],
          contrastText: '#0F172A',
        },

        background: {
          default: darkTokens.background.default,
          paper: darkTokens.background.paper,
          subtle: darkTokens.background.subtle,
          brandSoft: darkTokens.background.brandSoft,
        },

        text: {
          primary: darkTokens.text.primary,
          secondary: darkTokens.text.secondary,
          disabled: darkTokens.text.disabled,
        },

        divider: darkTokens.divider,

        success: {
          main: semanticColors.success.dark.main,
        },

        warning: {
          main: semanticColors.warning.dark.main,
        },

        error: {
          main: semanticColors.error.dark.main,
        },

        action: {
          selected: darkTokens.action.selected,
          disabled: darkTokens.action.disabled,
        },

        transaction: {
          deposit: transactionColors.deposit.dark,
          incoming: transactionColors.incoming.dark,
          outgoing: transactionColors.outgoing.dark,
          default: transactionColors.default.dark,
        },
      },
    },
  },

  /**
   * Inter continúa siendo la tipografía principal.
   * Se mantienen fallbacks seguros en caso de que la fuente
   * todavía no haya cargado.
   */
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',

    h1: {
      fontSize: '1.75rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },

    h2: {
      fontSize: '1.5rem',
      fontWeight: 700,
      lineHeight: 1.3,
    },

    h3: {
      fontSize: '1.25rem',
      fontWeight: 700,
      lineHeight: 1.3,
    },

    h4: {
      fontSize: '1.125rem',
      fontWeight: 700,
      lineHeight: 1.4,
    },

    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },

    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },

    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
    },

    button: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
      textTransform: 'none',
    },
  },

  shape: {
    borderRadius: radii.md,
  },

  spacing: 8,

  /**
   * Overrides globales de los componentes base.
   *
   * Solo se definen decisiones que deben mantenerse consistentes
   * en toda la aplicación. Los estilos específicos de cada pantalla
   * continúan perteneciendo a sus componentes.
   */
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minWidth: 320,
        },
      },
    },

    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },

      styleOverrides: {
        root: {
          minHeight: sizing.controlHeight,
          borderRadius: radii.sm,
          paddingInline: 20,
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          minWidth: sizing.minTouchTarget,
          minHeight: sizing.minTouchTarget,
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          minHeight: sizing.controlHeight,
          borderRadius: radii.sm,
        },
      },
    },

    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: radii.lg,
          boxShadow: shadows.dialog,
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          opacity: 1,
        },
      },
    },
  },
});

export default theme;