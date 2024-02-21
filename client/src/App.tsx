import AppBar from "./components/NavBar/AppBar";
import {ThemeProvider} from "@emotion/react";
import {theme} from "./styles/Palette";
import {Outlet} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <AppBar />
          <Outlet />
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
};

export default App;
