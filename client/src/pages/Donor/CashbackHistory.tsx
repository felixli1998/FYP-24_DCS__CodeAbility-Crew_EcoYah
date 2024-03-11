import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import "../../styles/App.css";
import {
    Box,
    Divider ,
    Stack,
    Container,
    Grid,
    Typography,
  } from "@mui/material";

import ColorTabs from "../../components/Tabs/Tabs";

const tabs = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Earned",
      value: "credited",
    },
    {
      label: "Redeemed",
      value: "redeemed",
    },
    {
      label: "Expired",
      value: "expired",
    }
  ];


export default function CashbackHistory(){
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [transactions, setTransactions] = useState<any[]>([]);

  return (
    <>
      <Container>
          {/* <Typography variant="h5" sx={{ fontWeight: 'bold', marginTop: "10px" }}>Cashback History</Typography> */}
      </Container>

      <Stack spacing={2} sx={{ margin: { xs: "2rem 2rem", md: "2rem 4rem" } }}>
        <Typography variant="h5" sx={{ fontWeight: "bold"}}>Cashback History</Typography>

        <ColorTabs
          tabs={tabs}
          selectedTab={selectedTab}
          toggleTab={(tabValue) => setSelectedTab(tabValue)}
        />

        <Grid container>
          <Grid item xs={9}>
            <Stack>
              <Typography sx={{ fontWeight: 'medium' }}>Donation Title</Typography>
              <Typography color="text.disabled">Date Time</Typography>
            </Stack>
          </Grid>
          <Grid item xs={3} sx={{ color: "#EE8F0F", textAlign: "end", alignSelf: "center"}}>+ $50</Grid>
        </Grid>
        <Divider/>

        <Typography sx={{ fontSize: { xs: 12, md: 20 }, textAlign: "center", marginTop: "1rem" }}>- You have reached the end of your cashback history -</Typography>
      </Stack>
    </>
  )
}

