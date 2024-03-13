// MUI
import { Box, Typography } from "@mui/material";
import { DefaultizedPieValueType } from "@mui/x-charts";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
// Utils
import { PieChartType } from "../../utils/Types";

type PieChartsType = {
  title: string;
  data: PieChartType[];
};

export default function PieCharts(props: PieChartsType) {
  const { title, data } = props;

  const TOTAL = data.map((item) => item.value).reduce((a, b) => a + b, 0);

  const getArcLabel = (params: DefaultizedPieValueType) => {
    const percent = params.value / TOTAL;
    return `${(percent * 100).toFixed(0)}%`;
  };

  return (
    <Box sx={{ backgroundColor: "white", padding: "1rem" }}>
      <Typography variant="h6" fontWeight="bold">
        {title}
      </Typography>
      <PieChart
        colors={["#2a3eb1", "#14a37f", "#b2102f"]}
        series={[
          {
            arcLabel: getArcLabel,
            data: data,
          },
        ]}
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fill: "white",
            fontWeight: "bold",
          },
          width: { xs: 400, md: 600 },
        }}
        height={200}
      />
    </Box>
  );
}
