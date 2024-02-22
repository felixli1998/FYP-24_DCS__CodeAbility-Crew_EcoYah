import {useEffect, useState} from "react";
import {useQuery} from "@tanstack/react-query";

// API
import {
  getActiveDonationRequests,
  getCompletedDonationRequests,
} from "../../services/donationRequestApi";

// MUI
import {Stack} from "@mui/material";

// Components
import StaffTypography from "../../components/Typography/StaffTypography";
import ColorTabs from "../../components/Tabs/Tabs";
import ContentCard from "../../components/Card/ContentCard";
import {getUserByEmail} from "../../services/authenticationApi";

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
  const endDate = new Date(date);
  // Calculate the difference in milliseconds
  const differenceMs = endDate.getTime() - todayDate.getTime();
  // Convert milliseconds to days
  const remainingDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
  return remainingDays;
};

export const getRewardAmount = (donationRequestItems: any) => {
  let totalPoints = 0;

  for (const donationItem of donationRequestItems) {
    const {quantity, donationEventItem} = donationItem;
    const {pointsPerUnit} = donationEventItem;

    totalPoints += quantity * pointsPerUnit;
  }

  return totalPoints;
};

export const DonationRequest = () => {
  const [selectedTab, setSelectedTab] = useState<string>("active");
  const [user, setUser] = useState<any | null>(null);

  const {data: donationRequestsData, refetch: donationRequestRefetch} =
    useQuery({
      queryKey: ["/get-donation-requests", {status: selectedTab}],
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

  useEffect(() => {
    if (user) {
      donationRequestRefetch();
    }
  }, [selectedTab, user, donationRequestRefetch]);

  useEffect(() => {
    // Fetch Active/Complete request
    const email = localStorage.getItem("ecoyah-email");
    if (email) {
      getUserByEmail(email).then((res) => {
        setUser(res.data);
      });
    }
  }, [localStorage.getItem("ecoyah-email")]);

  return (
    <>
      <Stack
        spacing={2}
        sx={{margin: {xs: "2rem 2rem", md: "2rem 4rem"}}}
      >
        <StaffTypography
          type="title"
          size={1.5}
          text={"My Donations"}
        ></StaffTypography>
        <ColorTabs
          tabs={tabs}
          selectedTab={selectedTab}
          toggleTab={(tabValue) => setSelectedTab(tabValue)}
        />
        {donationRequestsData &&
          donationRequestsData.data.map((donationRequest: any, key: number) => (
            <ContentCard
              key={key}
              contentCardData={{
                image: donationRequest.donationEvent.imageId,
                title: donationRequest.donationEvent.name,
                chipLabel:
                  getDayLeft(donationRequest.donationEvent.endDate) === 0
                    ? "Expired"
                    : `${getDayLeft(
                        donationRequest.donationEvent.endDate
                      )} day left`,
                customChipStyle:
                  getDayLeft(donationRequest.donationEvent.endDate) === 0
                    ? {backgroundColor: "#e0e0e0", color: "#9e9e9e"}
                    : {},
                reward: getRewardAmount(donationRequest.donationRequestItems),
                location: "Kunyah Cafe",
                dropOffDateTime: `${new Date(
                  donationRequest.dropOffDate
                ).toLocaleDateString()}, ${donationRequest.dropOffTime}`,
              }}
              originalData={donationRequest}
            />
          ))}
      </Stack>
    </>
  );
};
