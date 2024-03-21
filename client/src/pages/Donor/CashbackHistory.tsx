import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import UpdateIcon from "@mui/icons-material/Update";
import {
  Alert,
  Box,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import axios from "axios";
import ColorTabs from "../../components/Tabs/Tabs";
import { getUserByEmail } from "../../services/authenticationApi";
import { TRANSACTION_HISTORY_ROUTES } from "../../services/routes";
import { UserType } from "../../utils/Types";

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
  },
];

type eachDataType = {
  id: number;
  userPointsId: number;
  points: number;
  action: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  donationRequest: string;
  donationRequestId: number;
  donationEvent: string;
};

export default function CashbackHistory() {
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [user, setUser] = useState<UserType | null>(null);
  const [errorFetchingData, setErrorFetchingData] = useState(false);
  const [pendingRedemptions, setPendingRedemptions] = useState<eachDataType[]>(
    [],
  );

  const getTransactionHistoryData = async (userId: number, action?: String) => {
    try {
      const response = await axios.get(
        TRANSACTION_HISTORY_ROUTES.GET_TRANS_HISTORY_BY_ACTION,
        {
          params: {
            userId: userId,
            action: action,
          },
        },
      );
      return response.data.data.message;
    } catch (error) {
      setErrorFetchingData(true);
      console.error("Error fetching transaction history data: ", error);
      throw new Error("Failed to fetch transaction history data");
    }
  };

  const { data: transactionHistoryData, refetch: transactionHistoryRefetch } =
    useQuery({
      queryKey: ["/get-transaction-history", { status: selectedTab }],
      queryFn: async () => {
        if (user) {
          if (selectedTab === "all") {
            const getData = await getTransactionHistoryData(user.id);
            setPendingRedemptions([]);
            for (const eachData of getData) {
              if (eachData.status === "pending") {
                setPendingRedemptions((prev) => [...prev, eachData]);
              }
            }
            return getData;
          } else {
            return getTransactionHistoryData(user.id, selectedTab);
          }
        }
      },
      enabled: !!user,
    });

  useEffect(() => {
    async function getUser() {
      const email = localStorage.getItem("ecoyah-email");
      if (email) {
        try {
          const getUser = await getUserByEmail(email);
          setUser(getUser.data);
        } catch (error) {
          setErrorFetchingData(true);
          console.error("An error occurred while fetching user data:", error);
        }
      }
    }
    getUser();
  }, [localStorage.getItem("ecoyah-email")]);

  useEffect(() => {
    if (user) {
      transactionHistoryRefetch();
    }
  }, [selectedTab, user, transactionHistoryRefetch]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // 24-hour format
    });
  };

  return (
    <>
      {errorFetchingData ? (
        <Container sx={{ marginTop: 2 }}>
          <Alert severity="error">
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              An error occurred while fetching your cashback history. Please
              refresh and try again.{" "}
            </Typography>
          </Alert>
        </Container>
      ) : (
        <Stack
          spacing={2}
          sx={{ margin: { xs: "2rem 2rem", md: "2rem 4rem" } }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Cashback History
          </Typography>

          {pendingRedemptions.length > 0 && (
            <Paper
              sx={{
                padding: "1rem 1rem",
                borderRadius: "4px",
                backgroundColor: "rgb(229, 246, 253)",
                color: "rgb(1, 67, 97)",
                boxShadow: "none",
              }}
            >
              <Stack direction="column" justifyContent="space-between">
                <Typography
                  sx={{
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <UpdateIcon sx={{ marginRight: 1 }} />
                  Pending Redemptions
                </Typography>
                {pendingRedemptions.map((eachData: eachDataType) => (
                  <Stack
                    key={eachData.id}
                    direction="row"
                    justifyContent="space-between"
                    sx={{ mt: 1, ml: 4 }}
                  >
                    <Typography>{formatDate(eachData.updatedAt)}</Typography>
                    <Typography sx={{ fontWeight: "bold" }}>
                      - ${eachData.points}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Paper>
          )}

          <ColorTabs
            tabs={tabs}
            selectedTab={selectedTab}
            toggleTab={(tabValue) => setSelectedTab(tabValue)}
          />

          {transactionHistoryData &&
            transactionHistoryData.map(
              (transaction: eachDataType) =>
                transaction.status !== "pending" && (
                  <Box key={transaction.id}>
                    <Grid container sx={{ mb: "1rem" }}>
                      <Grid item xs={9}>
                        <Stack>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: "0.5rem",
                            }}
                          >
                            <Typography sx={{ fontWeight: "medium" }}>
                              {transaction.action === "credited"
                                ? transaction.donationEvent
                                : transaction.action === "expired"
                                  ? "Expired Cashback"
                                  : "Redeemed Cashback"}
                            </Typography>
                            {transaction.status === "rejected" && (
                              <Chip
                                sx={{ marginLeft: 1 }}
                                label="Rejected"
                                color="error"
                              />
                            )}
                          </Box>
                          <Typography color="text.disabled">
                            {formatDate(transaction.updatedAt)}
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid
                        item
                        xs={3}
                        sx={{
                          color:
                            transaction.action === "credited" ||
                            transaction.status === "rejected"
                              ? "primary.main"
                              : "error.main",
                          textAlign: "end",
                          alignSelf: "center",
                        }}
                      >
                        {transaction.action === "credited" ||
                        transaction.status === "rejected"
                          ? "+"
                          : "-"}{" "}
                        ${transaction.points}
                      </Grid>
                    </Grid>
                    <Divider />
                  </Box>
                ),
            )}

          <Typography
            sx={{
              fontSize: { xs: 13, md: 16 },
              textAlign: "center",
              marginTop: "1rem",
              fontWeight: "medium",
            }}
          >
            ~ You have reached the end of your cashback history ~
          </Typography>
        </Stack>
      )}
    </>
  );
}
