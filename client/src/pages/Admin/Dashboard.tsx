// React
import { useState, useEffect } from "react";
// MUI
import { Alert, Box, Grid, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { Dayjs } from "dayjs";
// Components
import DashboardCard from "../../components/Card/DashboardCard";
import BarCharts from "../../components/Chart/BarChart";
import PieCharts from "../../components/Chart/PieChart";
import LineCharts from "../../components/Chart/LineChart";
import BasicDataGrid from "../../components/DataGrid/BasicDataGrid";
// APIs
import {
  getCashbackStatus,
  getDonationRequests,
  getEventsByMonth,
  getItemsByMonth,
  getPopularEvent,
  getPopularItem,
  getPreferredDropOff,
  getRedeemedCashback,
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

  const [donationRequests, setDonationRequests] = useState<PieChartType[] | []>(
    [],
  );

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

  const [months, setMonths] = useState<string[]>([]);
  const [cashbackData, setCashbackData] = useState<Record<string, number[]>>(
    {},
  );

  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [redeemedCashbackData, setRedeemedCashbackData] = useState<
    Record<string, string | number>[]
  >([]);

  const [error, setError] = useState<boolean>(false);

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

  const handleStartDateChange = (date: Dayjs | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: Dayjs | null) => {
    setEndDate(date);
  };

  const fetchStaticData = async () => {
    try {
      const popularEventData = await getPopularEvent();
      setPopularEvent(popularEventData);

      const popularItemData = await getPopularItem();
      setPopularItem(popularItemData);

      const donationRequestsData = await getDonationRequests();
      setDonationRequests(donationRequestsData);

      const preferredDropOffData = await getPreferredDropOff();
      setDayOfWeek(preferredDropOffData.dayOfWeekArray);
      setDropOffData({
        Morning: preferredDropOffData.morningData,
        Afternoon: preferredDropOffData.afternoonData,
      });

      const cashbackStatusData = await getCashbackStatus();
      setMonths(cashbackStatusData.monthsArray);
      setCashbackData({
        Expired: cashbackStatusData.expiredData,
        Credited: cashbackStatusData.creditedData,
        Redeemed: cashbackStatusData.redeemedData,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(true);
    }
  };

  const fetchDynamicData = async () => {
    try {
      const eventsByMonthData = await getEventsByMonth(eventsSelect);
      if (eventsByMonthData.eventsArray.length >= 1) {
        setEventsName(eventsByMonthData.eventsArray);
        setEventsByMonthData({
          Submitted: eventsByMonthData.submittedData,
          Completed: eventsByMonthData.completedData,
          Withdrawn: eventsByMonthData.withdrawnData,
        });
      }

      const itemsByMonthData = await getItemsByMonth(itemsSelect);
      if (itemsByMonthData.itemsArray.length >= 1) {
        setItemsName(itemsByMonthData.itemsArray);
        setItemsByMonthData({
          Submitted: itemsByMonthData.submittedData,
          Completed: itemsByMonthData.completedData,
          Withdrawn: itemsByMonthData.withdrawnData,
        });
      }

      const redeemedCashbackData = await getRedeemedCashback(
        startDate!,
        endDate!,
      );
      setRedeemedCashbackData(redeemedCashbackData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(true);
    }
  };

  useEffect(() => {
    fetchStaticData();
  }, []);

  useEffect(() => {
    fetchDynamicData();
  }, [eventsSelect, itemsSelect, startDate, endDate]);

  const rows = [
    {
      id: "1",
      name: "Joey",
      cashback: 30,
      timestamp: "20-01-2024 22:22:22",
    },
    {
      id: "2",
      name: "Joey",
      cashback: 30,
      timestamp: "20-01-2024 22:22:22",
    },
  ];

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 300 },
    { field: "name", headerName: "Name", width: 300 },
    {
      field: "cashback",
      headerName: "Cashback",
      width: 300,
    },
    {
      field: "timestamp",
      headerName: "Timestamp",
      width: 300,
    },
  ];

  return (
    <Box sx={{ backgroundColor: "#efebeb", padding: "1rem" }}>
      {error && (
        <Alert variant="filled" severity="error" sx={{ mb: "1rem" }}>
          An error occurred while loading the dashboard. Please try again later!
        </Alert>
      )}
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
        <Grid item xs={12} md={4}>
          <DashboardCard
            title={"Most Popular Event"}
            name={popularEvent.donationEventName as string}
            count={popularEvent.donationRequestCount as number}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <DashboardCard
            title={"Most Popular Item"}
            name={popularItem.donationEventItemName as string}
            count={popularItem.donationRequestCount as number}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <PieCharts title={"Donation Requests"} data={donationRequests} />
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ marginBottom: "1rem" }}>
        <Grid item xs={12} md={6}>
          <BarCharts
            title={"Donation Events By Month"}
            yAxis={"Donation Request Count"}
            xAxis={"Donation Events"}
            colors={"palette"}
            filter={true}
            selected={handleEventsChange}
            xLabels={eventsName}
            seriesLabels={eventsByMonthData}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <BarCharts
            title={"Donation Items By Month"}
            yAxis={"Donation Request Count"}
            xAxis={"Donation Items"}
            colors={"palette"}
            filter={true}
            selected={handleItemsChange}
            xLabels={itemsName}
            seriesLabels={itemsByMonthData}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ marginBottom: "1rem" }}>
        <Grid item xs={12} md={6}>
          <BarCharts
            title={"Preferred Drop-Off Day and Time"}
            yAxis={"Donation Request Count"}
            xAxis={"Day of Week"}
            colors={"default"}
            filter={false}
            xLabels={dayOfWeek}
            seriesLabels={dropOffData}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LineCharts
            title={"Cashback Status"}
            yAxis={"Cashback"}
            xAxis={"Month of Year"}
            xLabels={months}
            seriesLabels={cashbackData}
          />
        </Grid>
      </Grid>
      <BasicDataGrid
        title={"Redeemed Cashback"}
        rows={redeemedCashbackData}
        columns={columns}
        setStartDate={handleStartDateChange}
        setEndDate={handleEndDateChange}
      />
    </Box>
  );
}
