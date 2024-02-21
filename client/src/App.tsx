import AppBar from "./components/NavBar/AppBar";
import {ThemeProvider} from "@emotion/react";
import {theme} from "./styles/Palette";
import {Outlet} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
// import { TokenProvider } from './TokenContext';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        {/* <TokenProvider> */}
          <ThemeProvider theme={theme}>
            <AppBar />
            <Outlet />
          </ThemeProvider>
          {/* </TokenProvider> */}
      </QueryClientProvider>
    </>
  );
};

export default App;
