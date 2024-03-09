// MUI
import { Box, Grid, Typography } from "@mui/material";
// Components
import BarCharts from "../../components/Chart/BarChart";
import PieCharts from "../../components/Chart/PieChart";
import LineCharts from "../../components/Chart/LineChart";

export default function Dashboard() {
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
          <BarCharts title={"Most Popular Event of the Month"} />
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
          <BarCharts title={"Preferred Drop-Off Day and Time"} />
        </Grid>
      </Grid>
      <LineCharts title={"Cashback"} />
    </Box>
  );
}
