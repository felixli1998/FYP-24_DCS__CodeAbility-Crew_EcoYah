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
  InputLabel,
  FormControl,
} from "@mui/material";
import {useEffect, useState} from "react";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import {DONATION_EVENT_ROUTES, EVENT_TYPE_ROUTES} from "../../services/routes";
import {useNavigate} from "react-router-dom";

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

  useEffect(() => {
    axios
      .get(EVENT_TYPE_ROUTES.GET_ALL)
      .then((resp) => {
        setEventTypes([{id: 0, name: "All"}, ...resp.data.data.eventTypes]);
      })
      .catch((err) => console.log(err));
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
        <Typography
          variant="h5"
          fontWeight="bold"
          color="primary.main"
        >
          Donation Events
        </Typography>
        <Button
          href="donation-event-form"
          variant="contained"
          sx={{height: "2.75rem"}}
        >
          <AddIcon />
          &nbsp; <Typography>Create</Typography>
        </Button>
      </Box>

      <Box
        padding="0 20rem"
        display="flex"
        justifyContent="space-between"
        marginTop="2.5rem"
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
            sx={{height: "2.5rem", width: "20rem"}}
            label="Status"
          >
            {eventStatuses.map((option, i) => (
              <MenuItem
                key={i}
                value={option}
              >
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
            sx={{height: "2.5rem", width: "20rem"}}
            label="Event Type"
          >
            {eventTypes.map((option) => (
              <MenuItem
                key={option.id}
                value={option.id}
              >
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid
        padding="0 19rem"
        container
        marginTop="3rem"
      >
        {events.slice((page - 1) * 4, page * 4).map((event) => (
          <Grid
            item
            xs={6}
            key={event.id}
            padding="1rem"
          >
            <Card>
              <CardMedia
                sx={{height: "8rem"}}
                image={event.imageId}
              />
              <CardContent>
                <Typography
                  color="#C51818"
                  fontWeight="bold"
                >
                  [
                  {Math.floor(
                    (+new Date(event.endDate) - +new Date()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  DAYS LEFT]{" "}
                  {new Date(event.startDate).toLocaleDateString("en-GB")} -{" "}
                  {new Date(event.endDate).toLocaleDateString("en-GB")}
                </Typography>
                <Typography
                  marginTop="0.5rem"
                  fontWeight="bold"
                >
                  {event.name}
                </Typography>
              </CardContent>
              <CardActions sx={{justifyContent: "flex-end"}}>
                <Button
                  onClick={() => handleDonationEventClick(event.id)}
                  sx={{textDecoration: "underline", fontWeight: "bold"}}
                >
                  View More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Pagination
        sx={{display: "flex", justifyContent: "center"}}
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
