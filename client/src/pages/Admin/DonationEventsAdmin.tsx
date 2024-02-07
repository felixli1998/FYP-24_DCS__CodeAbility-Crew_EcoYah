import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  MenuItem,
  Pagination,
  Select,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

type DonationEvent = {
  id: number;
  name: string;
  imageId: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function DonationEventsAdmin() {
  const eventStatuses = ["All", "Active", "Inactive"];
  const eventTypes = [
    { typeName: "All", typeId: 0 },
    { typeName: "Electronic Waste", typeId: 1 },
    { typeName: "Food Waste", typeId: 2 },
    { typeName: "Book Donation", typeId: 3 },
    { typeName: "Clothing Waste", typeId: 4 },
  ];

  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState(0);
  const [events, setEvents] = useState<DonationEvent[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasNext, setHasNext] = useState(true);

  function getData(eventStatus: string, eventTypeId: number, getMore: boolean) {
    let queryParams = "";
    if (eventStatus !== "All")
      queryParams += `isActive=${eventStatus === "Active"}`;
    if (eventTypeId !== 0) {
      if (queryParams !== "") queryParams += "&";
      queryParams += `eventType=${eventTypeId}`;
    }
    if (getMore) {
      if (queryParams !== "") queryParams += "&";
      queryParams += `pageNumber=${Math.floor(events.length / 25) + 1}`;
    }
    if (queryParams !== "") queryParams = "?" + queryParams;
    axios
      .get("http://localhost:8000/donation-events/all" + queryParams)
      .then((resp) => {
        let newEvents = resp.data.data;
        if (getMore) newEvents = [...events, ...newEvents];
        setEvents(newEvents);
        setHasNext(resp.data.pagination.hasNext);
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    getData("All", 0, false);
  }, []);

  return (
    <>
      <Box
        padding="0 20rem"
        display="flex"
        justifyContent="space-between"
        marginTop="2rem"
      >
        <Typography variant="h5" fontWeight="bold" color="primary.main">
          Donation Events
        </Typography>
        <Button href="donation-event-form" variant="contained">
          + Create
        </Button>
      </Box>

      <Box
        padding="0 20rem"
        display="flex"
        justifyContent="space-between"
        marginTop="2.5rem"
      >
        <Select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            getData(e.target.value, typeFilter, false);
            setPage(1);
          }}
          sx={{ height: "2.5rem", width: "20rem" }}
        >
          {eventStatuses.map((option, i) => (
            <MenuItem key={i} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
        <Select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(+e.target.value);
            getData(statusFilter, +e.target.value, false);
            setPage(1);
          }}
          sx={{ height: "2.5rem", width: "20rem" }}
        >
          {eventTypes.map((option) => (
            <MenuItem key={option.typeId} value={option.typeId}>
              {option.typeName}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Grid padding="0 19rem" container marginTop="3rem">
        {events.slice((page - 1) * 4, page * 4).map((event) => (
          <Grid item xs={6} key={event.id} padding="1rem">
            <Card>
              <CardMedia sx={{ height: "8rem" }} image={event.imageId} />
              <CardContent>
                <Typography color="#C51818" fontWeight="bold">
                  [
                  {Math.floor(
                    (+new Date(event.endDate) - +new Date()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  DAYS LEFT]{" "}
                  {new Date(event.startDate).toLocaleDateString("en-GB")} -{" "}
                  {new Date(event.endDate).toLocaleDateString("en-GB")}
                </Typography>
                <Typography marginTop="0.5rem" fontWeight="bold">
                  {event.name}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end" }}>
                <Button
                  sx={{ textDecoration: "underline", fontWeight: "bold" }}
                >
                  View More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Pagination
        sx={{ display: "flex", justifyContent: "center" }}
        count={Math.ceil(events.length / 4)}
        page={page}
        onChange={(e, v) => {
          if (hasNext && events.length - v * 4 < 8)
            getData(statusFilter, typeFilter, true);
          setPage(v);
        }}
      />
    </>
  );
}
