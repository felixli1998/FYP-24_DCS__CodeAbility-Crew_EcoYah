import { useEffect, useState } from "react";
import "./styles/App.css";
import axios from "axios";
import SignUp from "./pages/SignUp";

type ProjectStatus = {
  project: string;
  status: string;
};

export default function App() {
  const [res, setRes] = useState<ProjectStatus>();

  useEffect(() => {
    axios
      .post("http://localhost:8000/test", { msg: "start project" })
      .then((resp) => {
        setRes(resp.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      {/* res?.project} is {res?.status} */}
      <SignUp />
    </>
  );
}
