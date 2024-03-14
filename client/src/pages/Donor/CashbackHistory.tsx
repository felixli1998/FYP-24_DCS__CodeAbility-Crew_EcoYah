import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import "../../styles/App.css";
import {
    Alert,
    Chip,
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
  const [errorFetchingData, setErrorFetchingData] = useState(false);

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
      return response.data.data.message;
    } catch (error) {
      setErrorFetchingData(true);
      console.error("Error fetching event types: ", error);
      throw new Error("Failed to fetch event types");
    }
  }

  const { data: transactionHistoryData, refetch: transactionHistoryRefetch } =
  useQuery({
    queryKey: ["/get-transaction-history", { status: selectedTab }],
    queryFn: async () => {
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
        })
        .catch((error) => {
          setErrorFetchingData(true);
          console.error("An error occurred while fetching user data:", error);
        });
        ;
    }
  }, [localStorage.getItem("ecoyah-email")]);

  useEffect(() => {
    if (user) {
      transactionHistoryRefetch();
    }
  }, [selectedTab, user, transactionHistoryRefetch]);

  return (
    <>
    {errorFetchingData ? 
      
      (<Container sx={{marginTop: 2}}>
        <Alert severity="error">
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            An error occurred while fetching your cashback history. Please
            refresh and try again.{" "}
          </Typography>
        </Alert>
      </Container>) : 

    (<Stack spacing={2} sx={{ margin: { xs: "2rem 2rem", md: "2rem 4rem" } }}>
        <Typography variant="h5" sx={{ fontWeight: "bold"}}>Cashback History</Typography>

        <ColorTabs
          tabs={tabs}
          selectedTab={selectedTab}
          toggleTab={(tabValue) => setSelectedTab(tabValue)}
        />

        { transactionHistoryData &&
          transactionHistoryData.map((transaction: any, key: number) => (
            <>
              <Grid container key={transaction.id}>
                <Grid item xs={9}>
                  <Stack>
                    <Typography sx={{ fontWeight: 'medium'}}>
                      {transaction.action === "credited" ? transaction.donationEvent : 
                            (transaction.action === "expired" ? "Expired" : "Redeemed" )}
                      {(transaction.status === "rejected" || transaction.status === "pending") &&
                        <Chip 
                          sx={{marginLeft: 2}}
                          label={transaction.status === "pending" ? "Pending" : (transaction.status === "rejected" && "Rejected")}
                          color={transaction.status === "pending" ? "warning" : (transaction.status === "rejected" && "error") || undefined}
                        />
                      }
                    </Typography>
                    <Typography color="text.disabled">
                      {new Date(transaction.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false, // 24-hour format
                      })}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={3} sx={{color: "#EE8F0F", textAlign: "end", alignSelf: "center"}}>
                  {transaction.action === "credited" || transaction.status === "rejected" ? "+" : "-" } ${transaction.points}
                </Grid>
              </Grid>
              <Divider/>
            </>
          )
        
        )}

        <Typography sx={{ fontSize: { xs: 12, md: 20 }, textAlign: "center", marginTop: "1rem" }}>- You have reached the end of your cashback history -</Typography>
      </Stack>)}
    </>
  )
}

