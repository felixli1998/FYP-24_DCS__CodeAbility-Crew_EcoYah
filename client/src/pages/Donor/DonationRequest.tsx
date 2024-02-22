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

export const DonationRequest = () => {
  const [selectedTab, setSelectedTab] = useState<string>("active");
  const [user, setUser] = useState<any | null>(null);

  const {
    data: donationRequestsData,
    isLoading: donationRequestIsLoading,
    refetch: donationRequestRefetch,
  } = useQuery({
    queryKey: ["/get-donation-requests", {status: selectedTab}],
    queryFn: async () => {
      if (user) {
        if (selectedTab === "active") {
          // return getActiveDonationRequests(user.id);
          return getActiveDonationRequests(19);
        } else {
          // return getCompletedDonationRequests(user.id);
          return getCompletedDonationRequests(19);
        }
      }
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (user) {
      donationRequestRefetch();
    }
  }, [selectedTab, user]);

  useEffect(() => {
    // Fetch Active/Complete request
    const email = localStorage.getItem("ecoyah-email");
    if (email) {
      const user = getUserByEmail(email);
      setUser(user);
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
                chipLabel: donationRequest.donationEvent.endDate,
                reward: "0",
                location: "Kunyah Cafe",
                dropOffDateTime: `${donationRequest.dropOffDate}, ${donationRequest.dropOffTime}`,
              }}
            />
          ))}
      </Stack>
    </>
  );
};
