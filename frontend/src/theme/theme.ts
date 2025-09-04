import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#354a5c",
    },
    secondary: {
      main: "#667b8e",
    },
    background: {
      default: "#f0f2f5",
      paper: "#fff",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: {
          backgroundColor: "#f5f5f5",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#ccc",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#354a5c",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          borderRadius: 8,
          padding: "12px 0",
          fontWeight: "bold",
          backgroundColor: theme.palette.primary.main,
          color: "#fff",
          "&:hover": {
            backgroundColor: theme.palette.primary.dark || theme.palette.primary.main,
          },
        }),
      },
    },
  },
});

export default theme;
