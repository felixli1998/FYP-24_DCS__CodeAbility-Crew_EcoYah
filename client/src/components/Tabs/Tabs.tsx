import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

type TabsProp = {
  tabs: {label: string; value: string}[];
  selectedTab: string;
  toggleTab: (tabValue: string) => void;
};

export default function ColorTabs(props: TabsProp) {
  const {tabs, selectedTab, toggleTab} = props;

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    toggleTab(newValue);
  };

  return (
    <Box sx={{width: "100%"}}>
      <Tabs
        value={selectedTab}
        onChange={handleChange}
        textColor="primary"
        indicatorColor="primary"
        variant="fullWidth"
      >
        {tabs.map((tab: any) => (
          <Tab
            key={tab.value}
            value={tab.value}
            label={tab.label}
          />
        ))}
      </Tabs>
    </Box>
  );
}
