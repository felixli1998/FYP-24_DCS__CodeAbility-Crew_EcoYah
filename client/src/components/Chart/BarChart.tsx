// React
import { useState } from "react";
// MUI
import { Box, Grid, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
// Components
import BasicSelect from "../Select/Select";
// Assets
import NoDataAvailable from "../../assets/NoDataAvailable.jpg";
// Utils
import { months } from "../../utils/Months";

type BarChartsType = {
  title: string;
  colors: string;
  filter: boolean;
  selected?: (value: string) => void;
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
  const { title, colors, filter, selected, xLabels, seriesLabels } = props;
  const [select, setSelect] = useState<string>("01");

  const colorsRepo: Record<string, string[]> = {
    palette: ["#2a3eb1", "#14a37f", "#b2102f"],
    default: ["#ffea00", "#ff9100"],
  };

  const handleChange = (value: string) => {
    setSelect(value);
    selected!(value);
  };

  const displaySeries = () => {
    const seriesArray: SeriesArray[] = [];
    for (const [key, value] of Object.entries(seriesLabels)) {
      seriesArray.push({ data: value, label: key, id: key, stack: "total" });
    }
    return seriesArray;
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
          sx={{ width: { xs: 500, md: 600 } }}
          height={300}
          series={displaySeries()}
          xAxis={[{ data: xLabels, scaleType: "band" }]}
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
            sx={{ width: 268, height: 268 }}
          />
          <Typography variant="h6" fontWeight="bold">
            No Data Available
          </Typography>
        </Box>
      )}
    </Box>
  );
}
