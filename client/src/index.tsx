import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "./index.css";
import "./styles/Palette";
import { RouterProvider } from "react-router-dom";
import router from "./routes";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
