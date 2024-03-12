// React
import { useState, useEffect } from "react";
// MUI
import { Box, Grid, Typography } from "@mui/material";
// Components
import DashboardCard from "../../components/Card/DashboardCard";
import BarCharts from "../../components/Chart/BarChart";
import PieCharts from "../../components/Chart/PieChart";
import LineCharts from "../../components/Chart/LineChart";
// APIs
import {
  getPopularEventToDate,
  getPopularItemToDate,
  getPreferredDropOff,
} from "../../services/dashboardApi";

export default function Dashboard() {
  const [popularEvent, setPopularEvent] = useState<
    Record<string, string | number>
  >({});
  const [popularItem, setPopularItem] = useState<
    Record<string, string | number>
  >({});
  const [preferredDropOff, setPreferredDropOff] = useState<
    Record<string, string | number>[]
  >([]);
  const [dayOfWeek, setDayOfWeek] = useState<string[]>([]);
  const [timeOfDay, setTimeOfWeek] = useState<string[]>([]);

  const fetchData = async () => {
    try {
      const popularEventData = await getPopularEventToDate();
      console.log("Popular Event Data:", popularEventData);
      setPopularEvent(popularEventData);

      const popularItemData = await getPopularItemToDate();
      console.log("Popular Item Data:", popularItemData);
      setPopularItem(popularItemData);

      const preferredDropOffData = await getPreferredDropOff();
      console.log("Preferred Drop Off Data:", preferredDropOffData);
      setPreferredDropOff(preferredDropOffData);

      const dayOfWeekArray = preferredDropOffData.map(
        (object: Record<string, string | number>) => object.dayOfWeek,
      );
      setDayOfWeek(dayOfWeekArray);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  console.log(dayOfWeek);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box sx={{ backgroundColor: "#efebeb", padding: "1rem" }}>
      <Typography
        variant="h4"
        color="primary.dark"
        fontWeight="bold"
        sx={{
          backgroundColor: "white",
          padding: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        Executive Dashboard
      </Typography>
      <Grid container spacing={2} sx={{ marginBottom: "1rem" }}>
        <Grid item md={6}>
          <DashboardCard
            title={"Most Popular Event To Date"}
            name={popularEvent.donationEventName as string}
            count={popularEvent.donationRequestCount as number}
          />
        </Grid>
        <Grid item md={6}>
          <DashboardCard
            title={"Most Popular Item To Date"}
            name={popularItem.donationEventItemName as string}
            count={popularItem.donationRequestCount as number}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ marginBottom: "1rem" }}>
        <Grid item md={6}>
          <BarCharts
            title={"Most Popular Event of the Month"}
            xLabels={["1", "2", "3"]}
          />
        </Grid>
        <Grid item md={6}>
          <PieCharts title={"Most Popular Item of the Month"} />
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ marginBottom: "1rem" }}>
        <Grid item md={6}>
          <PieCharts title={"Donation Requests"} />
        </Grid>
        <Grid item md={6}>
          <BarCharts
            title={"Preferred Drop-Off Day and Time"}
            xLabels={dayOfWeek}
          />
        </Grid>
      </Grid>
      <LineCharts title={"Cashback"} />
    </Box>
  );
}
