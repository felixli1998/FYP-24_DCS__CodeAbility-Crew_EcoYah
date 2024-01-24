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
      light: "#666363"
    }
  },
  components: {
    // MuiDateCalendar: {
    //   styleOverrides: {
    //     root: {
    //       color: '#bbdefb',
    //       borderRadius: 2,
    //       borderWidth: 1,
    //       borderColor: '#2196f3',
    //       border: '1px solid',
    //       backgroundColor: '#0d47a1',
    //     }
    //   }
    // }
  }
});