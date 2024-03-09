import React from "react";
import { Button } from "@mui/material";
import axios from "axios";

export const DonorHome = () => {
  const redeemCashback = () => {
    const body = {
      id: "123",
      name: "John",
      points: 100,
      timestamp: new Date().toISOString(),
    };

    axios
      .post("http://localhost:8000/longpolling/notify", body)
      .then((resp) => {
        // console.log(resp);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <div>
      <h1>Welcome to the Homepage</h1>
      <p>This is the homepage of an authenticated donor</p>
      {/* TODO: Button should be in the Donor Cashback Redemption Page */}
      <Button variant="contained" onClick={redeemCashback}>
        Redeem Cashback
      </Button>
    </div>
  );
};
