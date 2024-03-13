// MUI
import { Box, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

type BarChartsType = {
  title: string;
  xLabels: string[];
  seriesLabels: Record<string, number[]>;
};

type SeriesArray = {
  data: number[];
  label: string;
  id: string;
  stack: string;
};

export default function BarCharts(props: BarChartsType) {
  const { title, xLabels, seriesLabels } = props;

  const displaySeries = () => {
    const seriesArray: SeriesArray[] = [];
    for (const [key, value] of Object.entries(seriesLabels)) {
      seriesArray.push({ data: value, label: key, id: key, stack: "total" });
    }
    return seriesArray;
  };

  return (
    <Box sx={{ backgroundColor: "white", padding: "1rem" }}>
      <Typography variant="h6" fontWeight="bold">
        {title}
      </Typography>
      <BarChart
        sx={{ width: { xs: 500, md: 600 } }}
        height={300}
        series={displaySeries()}
        xAxis={[{ data: xLabels, scaleType: "band" }]}
      />
    </Box>
  );
}
