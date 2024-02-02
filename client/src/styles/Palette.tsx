import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: "#008000",
      light: "#9DC451", 
      dark: "#013B23"
    },
    secondary: {
      main: "#000000",
      light: "#666363",
      dark: "#5A5858"
    }, 
    error: {
      main: "#d32f2f"
    },
    success:{
      main: "#008000",
      dark: "#013B23"
    }
    
    // admin: {
    //   success: "#013B23"
    // }
  },
});