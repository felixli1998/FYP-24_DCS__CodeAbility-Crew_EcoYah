import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  MenuItem,
  Pagination,
  Select,
  Typography,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import {
  DONATION_EVENT_ROUTES,
  EVENT_TYPE_ROUTES,
} from "../../services/routes";
import { useNavigate } from "react-router-dom";
import Image from "../../components/Image/Image";
import { folderPrefixNames } from "../../components/Image/Image";

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

type EventType = {
  id: number;
  name: string;
};

export default function DonationEventsAdmin() {
  const navigate = useNavigate();
  const eventStatuses = ["All", "Active", "Inactive"];
  const [statusFilter, setStatusFilter] = useState("All");
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
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
      .get(DONATION_EVENT_ROUTES.GET_ALL + queryParams)
      .then((resp) => {
        let newEvents = resp.data.data;
        if (getMore) newEvents = [...events, ...newEvents];
        setEvents(newEvents);
        setHasNext(resp.data.pagination.hasNext);
      })
      .catch((err) => console.log(err));
  }

  const handleDonationEventClick = (donationEventId: number) => {
    navigate(`/admin/donation-event/${donationEventId}`);
  };
  const displayCountDown = (endDate: string) => {
    const dateDiff = +new Date(endDate) - +new Date();
    const day = 1000 * 60 * 60 * 24;
    const daysLeft = Math.floor(dateDiff / day);

    if (daysLeft < 0) return "[EXPIRED] ";

    return `[${daysLeft} DAYS ${Math.floor(((dateDiff % day) / day) * 24)} HOURS LEFT] `;
  };

  useEffect(() => {
    axios
      .get(EVENT_TYPE_ROUTES.GET_ALL)
      .then((resp) => {
        setEventTypes([{ id: 0, name: "All" }, ...resp.data.data.eventTypes]);
      })
      .catch((err) => console.log(err));
    getData("All", 0, false);
  }, []);

  return (
    <>
      <Box
        padding={{ md: "0 5rem", lg: "0 10rem" }}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginX="1.5rem"
        marginTop="3rem"
      >
        <Typography
          fontWeight="bold"
          color="primary.dark"
          sx={{ fontSize: "4rem", letterSpacing: "0.48rem" }}
        >
          Donation Events
        </Typography>
        <Button
          href="donation-event-form"
          variant="contained"
          sx={{
            paddingX: "5rem",
            width: "9.375rem",
            height: "3.75rem",
            backgroundColor: "primary.dark",
          }}
        >
          <AddIcon />
          &nbsp;{" "}
          <Typography sx={{ fontSize: "1.5rem", letterSpacing: "0.18rem" }}>
            Create
          </Typography>
        </Button>
      </Box>

      <Box
        padding={{ md: "0 5rem", lg: "0 10rem" }}
        display={{ md: "flex" }}
        justifyContent={{ md: "space-between" }}
        flexDirection={{ sm: "column", md: "row" }}
        marginX="1.5rem"
        marginTop="3rem"
      >
        <FormControl>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              getData(e.target.value, typeFilter, false);
              setPage(1);
            }}
            sx={{ height: "2.5rem", width: "20rem", marginBottom: "2rem" }}
            label="Status"
          >
            {eventStatuses.map((option, i) => (
              <MenuItem key={i} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel>Event Type</InputLabel>
          <Select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(+e.target.value);
              getData(statusFilter, +e.target.value, false);
              setPage(1);
            }}
            sx={{ height: "2.5rem", width: "20rem" }}
            label="Event Type"
          >
            {eventTypes.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid
        padding={{ sm: "0 2rem", md: "0 5rem", lg: "0 8rem" }}
        container
        marginTop="2rem"
      >
        {events.slice((page - 1) * 4, page * 4).map((event) => (
          <Grid item xs={12} md={6} key={event.id} padding="1rem">
            <Card>
              <Image
                imageId={event.imageId}
                type="rectangle"
                width="100%"
                height="100%"
                folderPrefix={folderPrefixNames.EVENTS}
              />
              <CardContent>
                <Typography
                  color="#C51818"
                  fontWeight="bold"
                  variant="h6"
                  sx={{ letterSpacing: "0.15rem" }}
                >
                  {displayCountDown(event.endDate)}
                  {new Date(event.startDate).toLocaleDateString("en-GB")} -{" "}
                  {new Date(event.endDate).toLocaleDateString("en-GB")}
                </Typography>
                <Typography
                  marginTop="0.5rem"
                  fontWeight="bold"
                  variant="h5"
                  sx={{ letterSpacing: "0.18rem" }}
                >
                  {event.name}
                </Typography>
              </CardContent>
              <CardActions
                sx={{ justifyContent: "flex-end", alignItems: "bottom" }}
              >
                <Button
                  onClick={() => handleDonationEventClick(event.id)}
                  sx={{
                    textDecoration: "underline",
                    fontWeight: "bold",
                    fontSize: "1.25rem",
                    letterSpacing: "0.15rem",
                  }}
                >
                  View More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Pagination
        sx={{ display: "flex", justifyContent: "center", m: "2rem" }}
        size="large"
        color="primary"
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
