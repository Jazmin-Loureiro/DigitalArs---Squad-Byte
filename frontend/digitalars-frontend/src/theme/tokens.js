/**
 * Design Tokens — Digital ARS
 *
 * Este archivo contiene los valores visuales fundamentales de la aplicación.
 * No incluye configuración específica de Material UI para mantener separados
 * los tokens de diseño de su implementación.
 *
 * La misma estructura puede utilizarse como referencia para las variables
 * del Design System en Figma.
 */

/**
 * Colores primitivos de marca.
 *
 * La identidad visual de Digital ARS utiliza una escala Sky.
 * Estos valores no cambian entre los modos claro y oscuro.
 */
export const brandColors = {
  50: '#F0F9FF',
  100: '#DFF2FE',
  200: '#B8E6FE',
  300: '#74D4FF',
  400: '#00BCFF',
  500: '#00A6F4',
  600: '#0084D1',
  700: '#0069A8',
  800: '#00598A',
  900: '#024A70',
  950: '#052F4A',
};

/**
 * Escala neutral.
 *
 * Se utiliza para fondos, superficies, textos y divisores.
 * Mantener los neutrales separados de la marca permite modificar
 * la identidad visual sin afectar la jerarquía general de la interfaz.
 */
export const neutralColors = {
  0: '#FFFFFF',
  50: '#F8FAFC',
  100: '#F1F5F9',
  200: '#E2E8F0',
  300: '#CBD5E1',
  400: '#94A3B8',
  500: '#64748B',
  600: '#475569',
  700: '#334155',
  800: '#1E293B',
  900: '#0F172A',
  950: '#020617',
};

/**
 * Colores semánticos.
 *
 * Estos colores comunican estados del sistema y no deben reemplazarse
 * por colores de marca. Por ejemplo, el rojo queda reservado para
 * errores o acciones destructivas y no para representar egresos.
 */
export const semanticColors = {
  success: {
    light: {
      main: '#00875A',
      soft: '#ECFDF3',
      text: '#027A48',
    },
    dark: {
      main: '#32D583',
      soft: '#053321',
      text: '#6CE9A6',
    },
  },

  warning: {
    light: {
      main: '#B54708',
      soft: '#FFFAEB',
      text: '#93370D',
    },
    dark: {
      main: '#FDB022',
      soft: '#3A2503',
      text: '#FEC84B',
    },
  },

  error: {
    light: {
      main: '#D92D20',
      soft: '#FEF3F2',
      text: '#B42318',
    },
    dark: {
      main: '#F97066',
      soft: '#3B1111',
      text: '#FDA29B',
    },
  },
};

/**
 * Colores categóricos de movimientos.
 *
 * A diferencia de los colores semánticos (success, warning, error),
 * estos tokens identifican tipos de operaciones propias de Digital ARS.
 *
 * Cada categoría define variantes para Light y Dark para mantener
 * diferenciación visual y contraste adecuado en ambos esquemas.
 */
export const transactionColors = {
  deposit: {
    light: {
      icon: '#7C3AED',
      iconBackground: '#F3E8FF',
      border: '#D8B4FE',
      amount: semanticColors.success.light.text,
    },
    dark: {
      icon: '#C4B5FD',
      iconBackground: '#2E1065',
      border: '#6D28D9',
      amount: semanticColors.success.dark.text,
    },
  },

  incoming: {
    light: {
      icon: semanticColors.success.light.text,
      iconBackground: '#DCFCE7',
      border: '#86EFAC',
      amount: semanticColors.success.light.text,
    },
    dark: {
      icon: semanticColors.success.dark.text,
      iconBackground: '#052E16',
      border: '#166534',
      amount: semanticColors.success.dark.text,
    },
  },

  outgoing: {
    light: {
      icon: brandColors[600],
      iconBackground: brandColors[100],
      border: brandColors[300],
      amount: neutralColors[900],
    },
    dark: {
      icon: brandColors[300],
      iconBackground: brandColors[950],
      border: brandColors[700],
      amount: neutralColors[50],
    },
  },

  default: {
    light: {
      icon: neutralColors[600],
      iconBackground: neutralColors[100],
      border: neutralColors[300],
      amount: neutralColors[900],
    },
    dark: {
      icon: neutralColors[300],
      iconBackground: neutralColors[700],
      border: neutralColors[600],
      amount: neutralColors[50],
    },
  },
};

/**
 * Tokens semánticos del modo claro.
 *
 * Los componentes deberían consumir estos roles en lugar de colores
 * primitivos siempre que sea posible. De esta manera pueden adaptarse
 * automáticamente al esquema de color activo.
 */
export const lightTokens = {
  background: {
    default: neutralColors[50],
    paper: neutralColors[0],
    subtle: neutralColors[100],
    brandSoft: brandColors[100],
  },

  text: {
    primary: neutralColors[900],
    secondary: neutralColors[500],
    disabled: neutralColors[400],
    brand: brandColors[700],
  },

  border: {
    default: neutralColors[300],
    subtle: neutralColors[200],
  },

  divider: neutralColors[300],

  action: {
    primary: brandColors[700],
    primaryHover: brandColors[800],
    selected: brandColors[100],
    disabled: neutralColors[300],
  },

  icon: {
    primary: brandColors[700],
    secondary: neutralColors[500],
  },

  success: semanticColors.success.light,
  warning: semanticColors.warning.light,
  error: semanticColors.error.light,
};

/**
 * Tokens semánticos del modo oscuro.
 *
 * Dark mode no invierte simplemente los colores del modo claro.
 * Utiliza superficies y niveles de contraste definidos específicamente
 * para conservar jerarquía, legibilidad e identidad de marca.
 */
export const darkTokens = {
  background: {
    default: neutralColors[900],
    paper: neutralColors[800],
    subtle: neutralColors[700],
    brandSoft: brandColors[950],
  },

  text: {
    primary: neutralColors[50],
    secondary: neutralColors[300],
    disabled: neutralColors[500],
    brand: brandColors[300],
  },

  border: {
    default: neutralColors[600],
    subtle: neutralColors[700],
  },

  divider: neutralColors[600],

  action: {
    primary: brandColors[300],
    primaryHover: brandColors[200],
    selected: brandColors[950],
    disabled: neutralColors[600],
  },

  icon: {
    primary: brandColors[300],
    secondary: neutralColors[300],
  },

  success: semanticColors.success.dark,
  warning: semanticColors.warning.dark,
  error: semanticColors.error.dark,
};

/**
 * Escala de radios utilizada por los componentes.
 */
export const radii = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
};

/**
 * Escala de espaciado basada en múltiplos de 4 y alineada
 * con la unidad base de 8 px utilizada por Material UI.
 */
export const spacing = {
  50: 4,
  100: 8,
  150: 12,
  200: 16,
  300: 24,
  400: 32,
  500: 40,
  600: 48,
  800: 64,
};

/**
 * Elevaciones del sistema.
 *
 * Digital ARS prioriza superficies limpias, divisores y diferencias
 * de fondo antes que sombras pronunciadas.
 */
export const shadows = {
  none: 'none',
  low: '0 2px 8px rgba(15, 23, 42, 0.06)',
  card: '0 4px 14px rgba(15, 23, 42, 0.10)',
  dialog: '0 16px 32px rgba(15, 23, 42, 0.18)',
};

/**
 * Tamaños mínimos para elementos interactivos.
 *
 * Se priorizan áreas cómodas de interacción y accesibilidad,
 * especialmente considerando el público objetivo de Digital ARS.
 */
export const sizing = {
  minTouchTarget: 44,
  controlHeight: 48,
};

/**
 * Exportación agrupada para casos en los que resulte conveniente
 * consumir todos los tokens desde una única referencia.
 */
export const tokens = {
  brand: brandColors,
  neutral: neutralColors,
  semantic: semanticColors,
  transaction: transactionColors,
  light: lightTokens,
  dark: darkTokens,
  radii,
  spacing,
  shadows,
  sizing,
};

export default tokens;