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
  getDonationRequests,
  getEventsByMonth,
  getItemsByMonth,
  getPopularEvent,
  getPopularItem,
  getPreferredDropOff,
} from "../../services/dashboardApi";
// Utils
import { PieChartType } from "../../utils/Types";

export default function Dashboard() {
  const [popularEvent, setPopularEvent] = useState<
    Record<string, string | number>
  >({});

  const [popularItem, setPopularItem] = useState<
    Record<string, string | number>
  >({});

  const [donationRequests, setDonationRequests] = useState<PieChartType[]>([
    {
      id: 0,
      value: 0,
      label: "",
    },
  ]);

  const [eventsSelect, setEventsSelect] = useState<string>("01");
  const [eventsName, setEventsName] = useState<string[]>([]);
  const [eventsByMonthData, setEventsByMonthData] = useState<
    Record<string, number[]>
  >({});

  const [itemsSelect, setItemsSelect] = useState<string>("01");
  const [itemsName, setItemsName] = useState<string[]>([]);
  const [itemsByMonthData, setItemsByMonthData] = useState<
    Record<string, number[]>
  >({});

  const [dayOfWeek, setDayOfWeek] = useState<string[]>([]);
  const [dropOffData, setDropOffData] = useState<Record<string, number[]>>({});

  const handleEventsChange = (value: string) => {
    setEventsSelect(value);
    setEventsName([]);
    setEventsByMonthData({});
  };

  const handleItemsChange = (value: string) => {
    setItemsSelect(value);
    setItemsName([]);
    setItemsByMonthData({});
  };

  const fetchStaticData = async () => {
    try {
      const popularEventData = await getPopularEvent();
      console.log("Popular Event Data:", popularEventData);
      setPopularEvent(popularEventData);

      const popularItemData = await getPopularItem();
      console.log("Popular Item Data:", popularItemData);
      setPopularItem(popularItemData);

      const donationRequestsData = await getDonationRequests();
      console.log("Donation Requests Data:", donationRequestsData);
      setDonationRequests(donationRequestsData);

      const preferredDropOffData = await getPreferredDropOff();
      console.log("Preferred Drop Off Data:", preferredDropOffData);
      setDayOfWeek(preferredDropOffData.dayOfWeekArray);
      setDropOffData({
        Morning: preferredDropOffData.morningData,
        Afternoon: preferredDropOffData.afternoonData,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDynamicData = async () => {
    try {
      const eventsByMonthData = await getEventsByMonth(eventsSelect);
      console.log("Events By Month Data:", eventsByMonthData);
      if (eventsByMonthData.eventsArray.length >= 1) {
        setEventsName(eventsByMonthData.eventsArray);
        setEventsByMonthData({
          Submitted: eventsByMonthData.submittedData,
          Completed: eventsByMonthData.completedData,
          Withdrawn: eventsByMonthData.withdrawnData,
        });
      }

      const itemsByMonthData = await getItemsByMonth(itemsSelect);
      console.log("Items By Month Data:", itemsByMonthData);
      if (itemsByMonthData.itemsArray.length >= 1) {
        setItemsName(itemsByMonthData.itemsArray);
        setItemsByMonthData({
          Submitted: itemsByMonthData.submittedData,
          Completed: itemsByMonthData.completedData,
          Withdrawn: itemsByMonthData.withdrawnData,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchStaticData();
  }, []);

  useEffect(() => {
    fetchDynamicData();
  }, [eventsSelect, itemsSelect]);

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
        <Grid item md={4}>
          <DashboardCard
            title={"Most Popular Event"}
            name={popularEvent.donationEventName as string}
            count={popularEvent.donationRequestCount as number}
          />
        </Grid>
        <Grid item md={4}>
          <DashboardCard
            title={"Most Popular Item"}
            name={popularItem.donationEventItemName as string}
            count={popularItem.donationRequestCount as number}
          />
        </Grid>
        <Grid item md={4}>
          <PieCharts title={"Donation Requests"} data={donationRequests} />
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ marginBottom: "1rem" }}>
        <Grid item md={6}>
          <BarCharts
            title={"Donation Events By Month"}
            colors={"palette"}
            filter={true}
            selected={handleEventsChange}
            xLabels={eventsName}
            seriesLabels={eventsByMonthData}
          />
        </Grid>
        <Grid item md={6}>
          <BarCharts
            title={"Donation Items By Month"}
            colors={"palette"}
            filter={true}
            selected={handleItemsChange}
            xLabels={itemsName}
            seriesLabels={itemsByMonthData}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ marginBottom: "1rem" }}>
        <Grid item md={6}>
          <BarCharts
            title={"Preferred Drop-Off Day and Time"}
            colors={"default"}
            filter={false}
            xLabels={dayOfWeek}
            seriesLabels={dropOffData}
          />
        </Grid>
        <Grid item md={6}>
          <LineCharts title={"Cashback Status"} />
        </Grid>
      </Grid>
    </Box>
  );
}
