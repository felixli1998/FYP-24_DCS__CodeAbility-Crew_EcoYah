// MUI
import { Box, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

type BarChartsType = {
  title: string;
  xLabels: string[];
};

export default function BarCharts(props: BarChartsType) {
  const { title, xLabels } = props;
  const uData = [4000, 3000, 2000, 2780, 1890, 2390];
  const pData = [2400, 1398, 9800, 3908, 4800, 3800];
  return (
    <Box sx={{ backgroundColor: "white", padding: "1rem" }}>
      <Typography variant="h6" fontWeight="bold">
        {title}
      </Typography>
      <BarChart
        width={600}
        height={300}
        series={[
          { data: pData, label: "pv", id: "morning", stack: "total" },
          { data: uData, label: "uv", id: "afternoon", stack: "total" },
          { data: uData, label: "uv", id: "evening", stack: "total" },
        ]}
        xAxis={[{ data: xLabels, scaleType: "band" }]}
      />
    </Box>
  );
}
