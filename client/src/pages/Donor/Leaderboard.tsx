import { Stack, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import PodiumPostion from "../../components/PodiumPosition";

const rows = [
  {
    id: 1,
    name: "Pav",
    points: 2524,
    co2_saved: "20.12kg",
    total_donations: 6,
    last_donation: "19/03/2024",
    streak: 22,
  },
  {
    id: 2,
    name: "Aaron",
    points: 2201,
    co2_saved: "18.54kg",
    total_donations: 5,
    last_donation: "11/03/2024",
    streak: 16,
  },
  {
    id: 3,
    name: "Neet",
    points: 2032,
    co2_saved: "14.33kg",
    total_donations: 3,
    last_donation: "06/12/2023",
    streak: 13,
  },
  {
    id: 4,
    name: "Siew May",
    points: 1642,
    co2_saved: "10.59kg",
    total_donations: 3,
    last_donation: "05/01/2024",
    streak: 12,
  },
  {
    id: 5,
    name: "Alex",
    points: 1504,
    co2_saved: "6.78kg",
    total_donations: 1,
    last_donation: "20/02/2024",
    streak: 10,
  },
];

const columns = [
  { field: "id", headerName: "Rank", width: 70 },
  { field: "name", headerName: "Name", width: 150 },
  { field: "points", headerName: "Points", width: 150 },
  {
    field: "co2_saved",
    headerName: "CO2 saved",
    width: 150,
  },
  {
    field: "total_donations",
    headerName: "Total Donations",
    width: 150,
  },
  { field: "last_donation", headerName: "Last Donation", width: 150 },
  { field: "streak", headerName: "Streak", width: 150 },
];

export default function Leaderboard() {
  return (
    <Stack>
      <Typography variant="h5" fontWeight={900} margin="2rem auto">
        Top Contributors
      </Typography>
      <Stack direction="row" alignItems="end" margin="1rem auto">
        <PodiumPostion height="9rem" color="primary.main" stats={rows[1]} />
        <PodiumPostion height="12rem" color="primary.light" stats={rows[0]} />
        <PodiumPostion height="7rem" color="primary.dark" stats={rows[2]} />
      </Stack>

      <DataGrid
        sx={{ margin: "auto", width: 980 }}
        rows={rows}
        columns={columns}
      />
    </Stack>
  );
}
