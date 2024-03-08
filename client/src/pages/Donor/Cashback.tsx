import { useState, useEffect } from "react";
import "../../styles/App.css";
import {
    Box,
    Alert,
    Stack,
    Container,
    Typography,
    FormHelperText,
    Link,
  } from "@mui/material";

import ColorTabs from "../../components/Tabs/Tabs";

const tabs = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Earned",
      value: "earned",
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


export default function Cashback(){
  const [selectedTab, setSelectedTab] = useState<string>("all");

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

          <Typography sx={{ fontSize: 13, textAlign: "center" }}>- You have reached the end of your cashback history -</Typography>
        </Stack>
      </>
    )
}

