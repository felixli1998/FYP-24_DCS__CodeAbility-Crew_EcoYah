// React
import { useState } from "react";
// MUI
import { Box, Grid, Typography } from "@mui/material";
import { axisClasses, BarChart } from "@mui/x-charts";
// Components
import BasicSelect from "../Select/Select";
// Assets
import NoDataAvailable from "../../assets/NoDataAvailable.jpg";
// Utils
import { displaySeries, getChartStyles } from "../../utils/Common";
import { months } from "../../utils/Months";

type BarChartsType = {
  title: string;
  yAxis: string;
  xAxis: string;
  colors: string;
  filter: boolean;
  selected?: (value: string) => void;
  xLabels: string[];
  seriesLabels: Record<string, number[]>;
};

export default function BarCharts(props: BarChartsType) {
  const {
    title,
    yAxis,
    xAxis,
    colors,
    filter,
    selected,
    xLabels,
    seriesLabels,
  } = props;
  const [select, setSelect] = useState<string>("01");

  const colorsRepo: Record<string, string[]> = {
    palette: ["#2a3eb1", "#14a37f", "#b2102f"],
    default: ["#ffea00", "#ff9100"],
  };

  const handleChange = (value: string) => {
    setSelect(value);
    selected!(value);
  };

  return (
    <Box sx={{ backgroundColor: "white", padding: "1rem" }}>
      <Grid container spacing={2} alignItems="center" sx={{ mb: "1rem" }}>
        <Grid item md={6}>
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
        </Grid>
        <Grid item md={6}>
          {filter && (
            <BasicSelect
              name="Month"
              labelId="Month"
              label="Month"
              selectId="Month"
              menuItems={months}
              selectValue={select}
              onChange={handleChange}
            />
          )}
        </Grid>
      </Grid>
      {Object.keys(seriesLabels).length >= 1 ? (
        <BarChart
          colors={colorsRepo[colors]}
          sx={{
            width: { xs: 500, md: 600 },
            ...getChartStyles(axisClasses, seriesLabels),
          }}
          height={315}
          series={displaySeries(seriesLabels)}
          xAxis={[{ label: xAxis, data: xLabels, scaleType: "band" }]}
          yAxis={[{ label: yAxis }]}
        />
      ) : (
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
      )}
    </Box>
  );
}
