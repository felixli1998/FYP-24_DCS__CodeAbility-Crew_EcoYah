import { Stack, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import PodiumPostion from "../../components/PodiumPosition";

const rows = [
  {
    id: 1,
    name: "Pav",
    points: 2524,
    total_donations: 6,
    last_donation: "19/03/2024",
    streak: 22,
  },
  {
    id: 2,
    name: "Aaron",
    points: 2201,
    total_donations: 5,
    last_donation: "11/03/2024",
    streak: 16,
  },
  {
    id: 3,
    name: "Neet",
    points: 2032,
    total_donations: 3,
    last_donation: "06/12/2023",
    streak: 13,
  },
  {
    id: 4,
    name: "Siew May",
    points: 1642,
    total_donations: 3,
    last_donation: "05/01/2024",
    streak: 12,
  },
  {
    id: 5,
    name: "Alex",
    points: 1504,
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
        <PodiumPostion
          height="9rem"
          color="primary.main"
          name={rows[1].name}
          points={rows[1].points}
        />
        <PodiumPostion
          height="12rem"
          color="primary.light"
          name={rows[0].name}
          points={rows[0].points}
        />
        <PodiumPostion
          height="7rem"
          color="primary.dark"
          name={rows[2].name}
          points={rows[2].points}
        />
      </Stack>

      <DataGrid
        sx={{ margin: "auto", width: 980 }}
        rows={rows}
        columns={columns}
      />
    </Stack>
  );
}
