import "./styles/App.css";
import AppBar from "./components/AppBar";
import {ThemeProvider} from "@emotion/react";
import {theme} from "./styles/Palette";
import {Outlet} from "react-router-dom";
import EditProfile from "./pages/EditProfile";

const App: React.FC = () => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <AppBar />
        <EditProfile />
        <Outlet />
      </ThemeProvider>
    </>
  );
};

export default App;
