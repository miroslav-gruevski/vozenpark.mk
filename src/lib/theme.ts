'use client';

import { createTheme, alpha } from '@mui/material/styles';

// Material Design 3 (Material You) Color System
// Using a tonal palette based on primary seed color
const md3Colors = {
  // Primary tonal palette
  primary: {
    main: '#1A73E8',      // Primary40
    light: '#4285F4',     // Primary50
    dark: '#1557B0',      // Primary30
    container: '#D3E3FD', // PrimaryContainer
    onContainer: '#041E49', // OnPrimaryContainer
  },
  // Secondary tonal palette
  secondary: {
    main: '#5F6368',      // Secondary40
    light: '#80868B',     // Secondary50
    dark: '#3C4043',      // Secondary30
    container: '#E8EAED', // SecondaryContainer
    onContainer: '#1F1F1F',
  },
  // Tertiary (accent)
  tertiary: {
    main: '#1E8E3E',      // Green for success states
    container: '#CEEAD6',
  },
  // Error
  error: {
    main: '#D93025',
    light: '#EA4335',
    dark: '#B31412',
    container: '#F9DEDC',
    onContainer: '#410E0B',
  },
  // Warning
  warning: {
    main: '#F9AB00',
    light: '#FBBC04',
    dark: '#E37400',
    container: '#FEF7E0',
  },
  // Success
  success: {
    main: '#1E8E3E',
    light: '#34A853',
    dark: '#137333',
    container: '#CEEAD6',
  },
  // Surface colors (MD3)
  surface: {
    default: '#FFFFFF',
    variant: '#F1F3F4',
    container: '#F8F9FA',
    containerHigh: '#E8EAED',
  },
  // On colors
  onSurface: '#1F1F1F',
  onSurfaceVariant: '#5F6368',
  outline: '#DADCE0',
  outlineVariant: '#E8EAED',
};

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: md3Colors.primary.main,
      light: md3Colors.primary.light,
      dark: md3Colors.primary.dark,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: md3Colors.secondary.main,
      light: md3Colors.secondary.light,
      dark: md3Colors.secondary.dark,
      contrastText: '#FFFFFF',
    },
    success: {
      main: md3Colors.success.main,
      light: md3Colors.success.light,
      dark: md3Colors.success.dark,
    },
    warning: {
      main: md3Colors.warning.main,
      light: md3Colors.warning.light,
      dark: md3Colors.warning.dark,
    },
    error: {
      main: md3Colors.error.main,
      light: md3Colors.error.light,
      dark: md3Colors.error.dark,
    },
    background: {
      default: md3Colors.surface.container,
      paper: md3Colors.surface.default,
    },
    text: {
      primary: md3Colors.onSurface,
      secondary: md3Colors.onSurfaceVariant,
    },
    divider: md3Colors.outline,
  },
  typography: {
    // Google Sans inspired typography
    fontFamily: '"Google Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    // MD3 Type Scale
    h1: {
      fontSize: '3.5rem', // 56px - Display Large
      fontWeight: 400,
      lineHeight: 1.12,
      letterSpacing: '-0.25px',
    },
    h2: {
      fontSize: '2.8rem', // 45px - Display Medium
      fontWeight: 400,
      lineHeight: 1.15,
      letterSpacing: 0,
    },
    h3: {
      fontSize: '2.25rem', // 36px - Display Small
      fontWeight: 400,
      lineHeight: 1.22,
      letterSpacing: 0,
    },
    h4: {
      fontSize: '2rem', // 32px - Headline Large
      fontWeight: 400,
      lineHeight: 1.25,
      letterSpacing: 0,
    },
    h5: {
      fontSize: '1.75rem', // 28px - Headline Medium
      fontWeight: 400,
      lineHeight: 1.28,
      letterSpacing: 0,
    },
    h6: {
      fontSize: '1.5rem', // 24px - Headline Small
      fontWeight: 400,
      lineHeight: 1.33,
      letterSpacing: 0,
    },
    subtitle1: {
      fontSize: '1rem', // 16px - Title Medium
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0.15px',
    },
    subtitle2: {
      fontSize: '0.875rem', // 14px - Title Small
      fontWeight: 500,
      lineHeight: 1.43,
      letterSpacing: '0.1px',
    },
    body1: {
      fontSize: '1rem', // 16px - Body Large
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.5px',
    },
    body2: {
      fontSize: '0.875rem', // 14px - Body Medium
      fontWeight: 400,
      lineHeight: 1.43,
      letterSpacing: '0.25px',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      fontSize: '0.875rem',
      letterSpacing: '0.1px',
    },
    caption: {
      fontSize: '0.75rem', // 12px - Body Small
      fontWeight: 400,
      lineHeight: 1.33,
      letterSpacing: '0.4px',
    },
    overline: {
      fontSize: '0.6875rem', // 11px - Label Small
      fontWeight: 500,
      lineHeight: 1.45,
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
    },
  },
  shape: {
    // MD3 uses larger border radius
    borderRadius: 16, // Medium shape
  },
  shadows: [
    'none',
    // MD3 Elevation levels with tonal surface tint
    '0 1px 2px rgba(0,0,0,0.1)',
    '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
    '0 3px 6px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)',
    '0 6px 12px rgba(0,0,0,0.12), 0 3px 6px rgba(0,0,0,0.08)',
    '0 8px 16px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.08)',
    '0 12px 24px rgba(0,0,0,0.12), 0 6px 12px rgba(0,0,0,0.08)',
    '0 12px 24px rgba(0,0,0,0.12), 0 6px 12px rgba(0,0,0,0.08)',
    '0 12px 24px rgba(0,0,0,0.12), 0 6px 12px rgba(0,0,0,0.08)',
    '0 12px 24px rgba(0,0,0,0.12), 0 6px 12px rgba(0,0,0,0.08)',
    '0 12px 24px rgba(0,0,0,0.12), 0 6px 12px rgba(0,0,0,0.08)',
    '0 12px 24px rgba(0,0,0,0.12), 0 6px 12px rgba(0,0,0,0.08)',
    '0 12px 24px rgba(0,0,0,0.12), 0 6px 12px rgba(0,0,0,0.08)',
    '0 12px 24px rgba(0,0,0,0.12), 0 6px 12px rgba(0,0,0,0.08)',
    '0 12px 24px rgba(0,0,0,0.12), 0 6px 12px rgba(0,0,0,0.08)',
    '0 12px 24px rgba(0,0,0,0.12), 0 6px 12px rgba(0,0,0,0.08)',
    '0 12px 24px rgba(0,0,0,0.12), 0 6px 12px rgba(0,0,0,0.08)',
    '0 12px 24px rgba(0,0,0,0.12), 0 6px 12px rgba(0,0,0,0.08)',
    '0 12px 24px rgba(0,0,0,0.12), 0 6px 12px rgba(0,0,0,0.08)',
    '0 12px 24px rgba(0,0,0,0.12), 0 6px 12px rgba(0,0,0,0.08)',
    '0 12px 24px rgba(0,0,0,0.12), 0 6px 12px rgba(0,0,0,0.08)',
    '0 12px 24px rgba(0,0,0,0.12), 0 6px 12px rgba(0,0,0,0.08)',
    '0 12px 24px rgba(0,0,0,0.12), 0 6px 12px rgba(0,0,0,0.08)',
    '0 12px 24px rgba(0,0,0,0.12), 0 6px 12px rgba(0,0,0,0.08)',
    '0 12px 24px rgba(0,0,0,0.12), 0 6px 12px rgba(0,0,0,0.08)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20, // MD3 Full shape for buttons
          padding: '10px 24px',
          minHeight: 40,
        },
        contained: {
          background: `linear-gradient(135deg, ${md3Colors.primary.main} 0%, ${md3Colors.primary.dark} 100%)`,
          boxShadow: `0 4px 14px ${alpha(md3Colors.primary.main, 0.35)}`,
          '&:hover': {
            background: `linear-gradient(135deg, ${md3Colors.primary.light} 0%, ${md3Colors.primary.main} 100%)`,
            boxShadow: `0 6px 20px ${alpha(md3Colors.primary.main, 0.45)}`,
          },
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${md3Colors.primary.main} 0%, ${md3Colors.primary.dark} 100%)`,
          boxShadow: `0 4px 14px ${alpha(md3Colors.primary.main, 0.35)}`,
          '&:hover': {
            background: `linear-gradient(135deg, ${md3Colors.primary.light} 0%, ${md3Colors.primary.main} 100%)`,
            boxShadow: `0 6px 20px ${alpha(md3Colors.primary.main, 0.45)}`,
          },
        },
        outlined: {
          borderWidth: 1,
          '&:hover': {
            borderWidth: 1,
            backgroundColor: alpha(md3Colors.primary.main, 0.08),
          },
        },
        text: {
          '&:hover': {
            backgroundColor: alpha(md3Colors.primary.main, 0.08),
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16, // MD3 Medium shape
          boxShadow: 'none',
          border: `1px solid ${md3Colors.outline}`,
          // MD3 uses surface tint for elevation
          '&.MuiCard-elevation1': {
            backgroundColor: alpha(md3Colors.primary.main, 0.02),
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8, // MD3 Extra small shape for inputs
            '& fieldset': {
              borderColor: md3Colors.outline,
            },
            '&:hover fieldset': {
              borderColor: md3Colors.onSurface,
            },
            '&.Mui-focused fieldset': {
              borderWidth: 2,
            },
          },
          '& .MuiInputLabel-root': {
            color: md3Colors.onSurfaceVariant,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8, // MD3 Small shape
          fontWeight: 500,
        },
        filled: {
          backgroundColor: md3Colors.secondary.container,
          color: md3Colors.secondary.onContainer,
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          borderRadius: 16, // MD3 Large shape for FAB
          boxShadow: '0 3px 6px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: `1px solid ${md3Colors.outline}`,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 28, // MD3 Extra large shape for dialogs
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 12, // MD3 Medium shape for menus
          boxShadow: '0 3px 6px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8, // MD3 Small shape
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 16, // MD3 Medium shape for paper
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12, // MD3 Medium shape
        },
      },
    },
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          borderRadius: 8, // MD3 Small shape
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 4, // MD3 Extra small shape
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          borderRadius: 12, // MD3 Medium shape
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          '& .MuiPaginationItem-root': {
            borderRadius: 8, // MD3 Small shape
          },
        },
      },
    },
  },
});

// Animation variants for Framer Motion
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export const slideInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
};

export const slideInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
};

// MD3 Color utilities
export const md3 = md3Colors;
