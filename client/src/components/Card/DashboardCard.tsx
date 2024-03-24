// MUI
import { Box, Typography } from "@mui/material";
// Components
import NoDataCard from "../Card/NoDataCard";

type DashboardCardType = {
  title: string;
  name: string;
  count: number;
};

export default function DashboardCard(props: DashboardCardType) {
  const { title, name, count } = props;
  return (
    <Box
      sx={{
        backgroundColor: "white",
        padding: "1rem",
        height: name && count ? 275 : 411,
      }}
    >
      <Typography variant="h6" fontWeight="bold" sx={{ mb: "2rem" }}>
        {title}
      </Typography>
      {name && count ? (
        <>
          <Typography
            variant="h6"
            fontWeight="bold"
            color="primary.main"
            textAlign="center"
          >
            {name}
          </Typography>
          <Typography
            variant="h2"
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
        </>
      ) : (
        <NoDataCard />
      )}
    </Box>
  );
}
