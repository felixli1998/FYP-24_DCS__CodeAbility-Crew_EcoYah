import React from "react";
import { Button } from "@mui/material";
import axios from "axios";

export const DonorHome = () => {
  const stimulateCashback = () => {
    console.log("Stimulate cashback");
    const body = {
      id: "123",
      points: 100,
      timestamp: new Date().toISOString(),
    };

    axios.post("http://localhost:8000/longpolling/notify", body)
      .then((resp) => {
        console.log(resp);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <h1>Welcome to the Homepage</h1>
      <p>This is the homepage of an authenticated donor</p>

      <Button variant="contained" onClick={stimulateCashback}>Stimulate Cashback</Button>
    </div>
  );
};
