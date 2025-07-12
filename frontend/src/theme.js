import { createTheme } from '@mui/material/styles';

export default createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Green
      contrastText: '#fff',
    },
    secondary: {
      main: '#ff8f00', // Orange
    },
  },
  typography: {
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 22px',
        },
      },
    },
    MuiCard: {
      defaultProps: {
        className: 'custom-card', // Connects to CSS
      },
    },
  },
});