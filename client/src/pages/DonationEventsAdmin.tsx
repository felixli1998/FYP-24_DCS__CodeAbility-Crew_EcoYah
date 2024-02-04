import {
  Box,
  Button,
  Grid,
  Pagination,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { ChangeEvent, useState } from "react";
import FilterSelect from "../components/FilterSelect";
import { eventTypes } from "../utils/eventTypes";
import axios from "axios";
import { EVENT_ROUTES } from "../services/routes";
import DonationEventCard from "../components/DonationEventCard";
import { DonationEvent } from "../types/DonationEvent";

export default function DonationEventsAdmin() {
  // might need refactoring
  const eventStatuses = ["All", "Active", "Inactive"];
  // const eventStatusesSet = new Set(eventStatuses);
  // const eventTypesSet = new Set(eventTypes);
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [events, setEvents] = useState<DonationEvent[]>();
  const [page, setPage] = useState<number>(1)
  const [fetchedPage, setFetchedPage] = useState(6)

  function handleStatusChange(e: SelectChangeEvent<string>) {
    const filterValue = e.target.value;
    setStatusFilter(filterValue);
    axios
      .get(
        `${EVENT_ROUTES.GET_ALL}?${filterValue !== "All" && "isActive=" + filterValue === "Active"}&${typeFilter !== "All" && "eventType=" + typeFilter}`,
      )
      .then((resp) => setEvents(resp.data))
      .catch((err) => console.log(err));
  }

  function handleTypeChange(e: SelectChangeEvent<string>) {
    const filterValue = e.target.value;
    setTypeFilter(filterValue);
    axios
      .get(
        `${EVENT_ROUTES.GET_ALL}?${filterValue !== "All" && "eventType=" + filterValue}&${statusFilter !== "All" && "isActive=" + statusFilter === "Active"}`,
      )
      .then((resp) => setEvents(resp.data))
      .catch((err) => console.log(err));
  }

  function handlePageChange(e: ChangeEvent<unknown>, value: number){
    setPage(value)
  }

  // needs styling
  return (
    <>
      <Box
        display="flex"
        sx={{
          justifyContent: "space-around",
          marginTop: "3rem",
        }}
      >
        <Typography variant="h5" color="primary.main">
          Donation Events
        </Typography>
        <Button>+ Create</Button>
      </Box>

      <Box
        display="flex"
        sx={{
          justifyContent: "space-around",
          marginTop: "3rem",
        }}
      >
        <FilterSelect
          options={eventStatuses}
          selectedOption={statusFilter}
          handleChange={handleStatusChange}
          height="2.5rem"
          width="13rem"
        />
        <FilterSelect
          options={eventTypes}
          selectedOption={typeFilter}
          handleChange={handleTypeChange}
          height="2.5rem"
          width="13rem"
        />
      </Box>
      <Grid container spacing={2}>
        {events?.slice(page*4, (page+1)*4).map((event) => (
          <Grid item xs={8} key={event.id}>
            <DonationEventCard {...event} />
          </Grid>
        ))}
      </Grid>
      <Pagination sx={{ display:"flex", justifyContent:"center" }} count={20} page={page} onChange={handlePageChange}/>
    </>
  );
}
