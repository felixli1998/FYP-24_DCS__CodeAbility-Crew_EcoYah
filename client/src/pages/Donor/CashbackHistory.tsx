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

import axios from "axios";
import ColorTabs from "../../components/Tabs/Tabs";
import { getUserByEmail } from "../../services/authenticationApi";
import { TRANSACTION_HISTORY_ROUTES } from "../../services/routes";

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
      label: "Spent",
      value: "redeemed",
    }
  ];

export default function CashbackHistory(){
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [user, setUser] = useState<any | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  const getTransactionHistoryData = async (userId: string, action?: string) => {
    try {
      const response = await axios.get(
        TRANSACTION_HISTORY_ROUTES.GET_TRANS_HISTORY_BY_ACTION,
        {
          params: {
            userId: userId,
            action: action
          },
        },
      );
      console.log(response.data.data.message);
      return response.data.data.message;
    } catch (error) {
      console.error("Error fetching event types: ", error);
      throw new Error("Failed to fetch event types");
    }
  }

  const { data: transactionHistoryData, refetch: transactionHistoryRefetch } =
  useQuery({
    queryKey: ["/get-transaction-history", { status: selectedTab }],
    queryFn: async () => {
      console.log("selectedTab", selectedTab);
      if (user) {
        if (selectedTab === "all") {
          return getTransactionHistoryData(user.id);
        } else{
          return getTransactionHistoryData(user.id, selectedTab);
        } 
      }
    },
    enabled: !!user,
  });

  useEffect(() => {
    const email = localStorage.getItem("ecoyah-email");
    if (email) {
      getUserByEmail(email).then((res) => {
        setUser(res.data);
      });
    }
  }, [localStorage.getItem("ecoyah-email")]);

  useEffect(() => {
    if (user) {
      transactionHistoryRefetch();
    }
  }, [selectedTab, user, transactionHistoryRefetch]);

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

