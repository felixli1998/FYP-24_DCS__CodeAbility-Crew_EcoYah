// MUI
import { Box, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

type BarChartsType = {
  title: string;
};

export default function BarCharts(props: BarChartsType) {
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
    <Box
      sx={{ backgroundColor: "white", borderRadius: "1rem", padding: "1rem" }}
    >
      <Typography variant="h6">{title}</Typography>
      <BarChart
        width={500}
        height={300}
        series={[
          { data: pData, label: "pv", id: "pvId", stack: "total" },
          { data: uData, label: "uv", id: "uvId", stack: "total" },
        ]}
        xAxis={[{ data: xLabels, scaleType: "band" }]}
      />
    </Box>
  );
}
