// src/App.tsx
import {useEffect, useState} from "react";
import "./styles/App.css";
import axios from "axios";
import AppBar from "./components/AppBar"; // Import the AppBar component
import SignUp from "./pages/SignUp";

type ProjectStatus = {
  project: string;
  status: string;
};

const App: React.FC = () => {
  const [res, setRes] = useState<ProjectStatus>();

  useEffect(() => {
    axios
      .post("http://localhost:8000/test", {msg: "start project"})
      .then((resp) => {
        setRes(resp.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <AppBar />
      <SignUp></SignUp>
      {res?.project} is {res?.status}
    </>
  );
};

export default App;
