import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./styles/Palette";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);
