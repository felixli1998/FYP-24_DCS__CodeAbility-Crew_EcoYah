import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

// API
import { getUserByEmail } from "../../services/authenticationApi";
import {
  getActiveDonationRequests,
  getCompletedDonationRequests,
} from "../../services/donationRequestApi";

// MUI
import { Stack, Grid, Typography } from "@mui/material";

// Components
import ColorTabs from "../../components/Tabs/Tabs";
import ContentCard from "../../components/Card/ContentCard";
import { useFeedbackNotification } from "../../components/useFeedbackNotification";

const tabs = [
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Completed",
    value: "completed",
  },
];

export const getDayLeft = (date: string) => {
  const todayDate = new Date();
  const dropOffDate = new Date(date);
  // Calculate the difference in milliseconds
  const differenceMs = dropOffDate.getTime() - todayDate.getTime();
  // Convert milliseconds to days
  const remainingDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
  return remainingDays;
};

export const getRewardAmount = (donationRequestItems: any) => {
  let totalPoints = 0;

  for (const donationItem of donationRequestItems) {
    const { quantity, donationEventItem } = donationItem;
    const { pointsPerUnit } = donationEventItem;

    totalPoints += quantity * pointsPerUnit;
  }

  return totalPoints;
};

export const DonationRequest = () => {
  const [selectedTab, setSelectedTab] = useState<string>("active");
  const [user, setUser] = useState<any | null>(null);
  const { displayNotification, FeedbackNotification } = useFeedbackNotification();

  const { data: donationRequestsData, refetch: donationRequestRefetch } =
    useQuery({
      queryKey: ["/get-donation-requests", { status: selectedTab }],
      queryFn: async () => {
        if (user) {
          if (selectedTab === "active") {
            return getActiveDonationRequests(user.id);
          } else {
            return getCompletedDonationRequests(user.id);
          }
        }
      },
      enabled: !!user,
    });

  const restructureDataToDonationRequestForm = (donationRequest: any) => {
    return {
      id: donationRequest.donationEvent.id,
      name: donationRequest.donationEvent.name,
      imageId: donationRequest.donationEvent.imageId,
      startDate: donationRequest.donationEvent.startDate,
      endDate: donationRequest.donationEvent.endDate,
      donationRequestId: donationRequest.id,
      dropOffDate: donationRequest.dropOffDate,
      dropOffTime: donationRequest.dropOffTime,
      omitPoints: donationRequest.omitPoints,
      donationRequestItems: donationRequest.donationRequestItems,
    };
  };

  useEffect(() => {
    const message = sessionStorage.getItem("message");
    if (message) {
      displayNotification("success", message);
      sessionStorage.removeItem("message");
    } 
  }, [sessionStorage.getItem("message")])

  useEffect(() => {
    // Fetch Active/Complete request
    const email = localStorage.getItem("ecoyah-email");
    if (email) {
      getUserByEmail(email).then((res) => {
        setUser(res.data);
      });
    }
  }, [localStorage.getItem("ecoyah-email")]);

  useEffect(() => {
    if (user) {
      donationRequestRefetch();
    }
  }, [selectedTab, user, donationRequestRefetch]);

  return (
    <>
      <FeedbackNotification /> 
      <Stack spacing={2} sx={{ margin: { xs: "2rem 2rem", md: "2rem 4rem" } }}>
        <Typography variant="h5" fontWeight="bold">
          My Donation Requests
        </Typography>
        <ColorTabs
          tabs={tabs}
          selectedTab={selectedTab}
          toggleTab={(tabValue) => setSelectedTab(tabValue)}
        />
        <Grid container spacing={{ md: 2 }}>
          {donationRequestsData &&
            donationRequestsData.data.map(
              (donationRequest: any, key: number) => (
                <Grid item xs={12} md={6} key={key}>
                  <ContentCard
                    contentCardData={{
                      id: donationRequest.id,
                      image: donationRequest.donationEvent.imageId,
                      title: donationRequest.donationEvent.name,
                      chipLabel:
                        getDayLeft(donationRequest.dropOffDate) === 0
                          ? "Overdue"
                          : `${getDayLeft(
                            donationRequest.dropOffDate
                            )} ${getDayLeft(
                              donationRequest.dropOffDate
                              ) > 1 ? "Days" : "Day"} Left`,
                      customChipStyle:
                        getDayLeft(donationRequest.dropOffDate) === 0
                          ? { backgroundColor: "#e0e0e0", color: "#9e9e9e" }
                          : {},
                      reward: donationRequest.omitPoints
                        ? 0
                        : getRewardAmount(donationRequest.donationRequestItems),
                      location: "Kunyah Cafe",
                      dropOffDateTime: `${new Date(
                        donationRequest.dropOffDate
                      ).toLocaleDateString()}, ${donationRequest.dropOffTime}`,
                      status: selectedTab,
                    }}
                    originalData={restructureDataToDonationRequestForm(
                      donationRequest
                    )}
                  />
                </Grid>
              )
            )}
        </Grid>
      </Stack>
    </>
  );
};
