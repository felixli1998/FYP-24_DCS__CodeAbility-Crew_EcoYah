// MUI
import { Box, Typography } from "@mui/material";

type DashboardCardType = {
  title: string;
  name: string;
  count: number;
};

export default function DashboardCard(props: DashboardCardType) {
  const { title, name, count } = props;
  return (
    <Box sx={{ backgroundColor: "white", padding: "1rem" }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: "1rem" }}>
        {title}
      </Typography>
      <Typography
        variant="h6"
        fontWeight="bold"
        color="primary.main"
        textAlign="center"
      >
        {name}
      </Typography>
      <Typography
        variant="h3"
        fontWeight="bold"
        color="primary.main"
        textAlign="center"
      >
        {count}
      </Typography>
      <Typography
        variant="h6"
        fontWeight="bold"
        color="primary.main"
        textAlign="center"
      >
        Donation Requests
      </Typography>
    </Box>
  );
}
