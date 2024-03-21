// MUI
import { Box, Typography } from "@mui/material";
// Assets
import NoDataAvailable from "../../assets/NoDataAvailable.jpg";

export default function NoDataCard() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        component="img"
        alt="No Data Available"
        src={NoDataAvailable}
        sx={{ width: 283, height: 283 }}
      />
      <Typography variant="h6" fontWeight="bold">
        No Data Available
      </Typography>
    </Box>
  );
}
