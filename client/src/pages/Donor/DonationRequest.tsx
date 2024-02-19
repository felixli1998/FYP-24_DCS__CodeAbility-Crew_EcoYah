import React, {useEffect, useState} from "react";

// MUI
import {Stack} from "@mui/material";

// Components
import StaffTypography from "../../components/Typography/StaffTypography";
import ColorTabs from "../../components/Tabs/Tabs";
import ContentCard from "../../components/Card/ContentCard";

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

const contents = [
  {
    image: "https://picsum.photos/400/600",
    title: "Live From Space",
    chipLabel: "1 day left",
    reward: "3",
    location: "Kunyah Cafe",
    dropOffDateTime: "5th Feb 2024, 10:00 AM",
  },
  {
    image: "https://picsum.photos/400/600",
    title: "Live From Space",
    chipLabel: "1 day left",
    reward: "3",
    location: "Kunyah Cafe",
    dropOffDateTime: "5th Feb 2024, 10:00 AM",
  },
];

export const DonationRequest = () => {
  const [selectedTab, setSelectedTab] = useState<string>("active");

  useEffect(() => {
    // Fetch Active/Complete request
  }, [selectedTab]);
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
        {contents.map((item: any) => (
          <ContentCard contentCardData={item} />
        ))}
      </Stack>
    </>
  );
};
