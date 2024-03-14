// MUI
import { Box, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
// Utils
import { displaySeries } from "../../utils/Common";

type LineChartsType = {
  title: string;
  xLabels: string[];
  seriesLabels: Record<string, number[]>;
};

export default function LineCharts(props: LineChartsType) {
  const { title, xLabels, seriesLabels } = props;

  return (
    <Box sx={{ backgroundColor: "white", padding: "1rem" }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: "2rem" }}>
        {title}
      </Typography>
      <LineChart
        sx={{ width: { xs: 500, md: 600 } }}
        height={300}
        series={displaySeries(seriesLabels)}
        xAxis={[{ scaleType: "point", data: xLabels }]}
      />
    </Box>
  );
}
