import React from "react";

// MUI
import {Stack} from "@mui/material";

// Components
import StaffTypography from "../../components/Typography/StaffTypography";
import ColorTabs from "../../components/Tabs/Tabs";
import ContentCard from "../../components/Card/ContentCard";

export const DonationRequest = () => {
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
        <ColorTabs />
        <ContentCard />
        <ContentCard />
        <ContentCard />
      </Stack>
    </>
  );
};
