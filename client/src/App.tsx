import "./styles/App.css";
import AppBar from "./components/AppBar";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./styles/Palette";
import { Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
