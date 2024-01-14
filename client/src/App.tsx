// src/App.tsx
// import {useEffect, useState} from "react";
import "./styles/App.css";
// import axios from "axios";
import AppBar from "./components/AppBar";
import {ThemeProvider} from "@emotion/react";
import {theme} from "./styles/Palette";
import {Outlet} from "react-router-dom";
import axios from "axios";
import SignUp from "./pages/SignUp";

// type ProjectStatus = {
//   project: string;
//   status: string;
// };

const App: React.FC = () => {
  // const [res, setRes] = useState<ProjectStatus>();

  // useEffect(() => {
  //   axios
  //     .post("http://localhost:8000/test", {msg: "start project"})
  //     .then((resp) => {
  //       setRes(resp.data);
  //     })
  //     .catch((err) => console.log(err));
  // }, []);

  return (
    <>
      <ThemeProvider theme={theme}>
        <AppBar />
        <Outlet />
      </ThemeProvider>
      {/* {res?.project} is {res?.status} */}
      {/* res?.project} is {res?.status} */}
      {/* <SignUp /> */}
    </>
  );
};

export default App;
