// MUI
import { Box, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";

type LineChartsType = {
  title: string;
};

export default function LineCharts(props: LineChartsType) {
  const { title } = props;
  const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
  const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
  const xLabels = [
    "Page A",
    "Page B",
    "Page C",
    "Page D",
    "Page E",
    "Page F",
    "Page G",
  ];
  return (
    <Box sx={{ backgroundColor: "white", padding: "1rem" }}>
      <Typography variant="h6" fontWeight="bold">
        {title}
      </Typography>
      <LineChart
        sx={{ width: { xs: 500, md: 600 } }}
        height={300}
        series={[
          { data: pData, label: "pv" },
          { data: uData, label: "uv" },
        ]}
        xAxis={[{ scaleType: "point", data: xLabels }]}
      />
    </Box>
  );
}
