// MUI
import { Box, Typography } from "@mui/material";
import { axisClasses, LineChart } from "@mui/x-charts";
// Components
import NoDataCard from "../Card/NoDataCard";
// Utils
import { displaySeries, getChartStyles } from "../../utils/Common";

type LineChartsType = {
  title: string;
  yAxis: string;
  xAxis: string;
  xLabels: string[];
  seriesLabels: Record<string, number[]>;
};

export default function LineCharts(props: LineChartsType) {
  const { title, yAxis, xAxis, xLabels, seriesLabels } = props;

  return (
    <Box sx={{ backgroundColor: "white", padding: "1rem" }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: "2rem" }}>
        {title}
      </Typography>
      {Object.keys(seriesLabels).length >= 1 ? (
        <LineChart
          sx={{
            width: { xs: 500, md: 600 },
            ...getChartStyles(axisClasses, seriesLabels),
          }}
          height={330}
          series={displaySeries(seriesLabels, "line")}
          xAxis={[{ label: xAxis, scaleType: "point", data: xLabels }]}
          yAxis={[{ label: yAxis }]}
        />
      ) : (
        <NoDataCard />
      )}
    </Box>
  );
}
