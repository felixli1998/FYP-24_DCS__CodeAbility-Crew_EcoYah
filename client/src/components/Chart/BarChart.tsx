// React
import { useState } from "react";
// MUI
import { Box, Grid, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
// Components
import BasicSelect from "../Select/Select";
// Utils
import { months } from "../../utils/Months";

type BarChartsType = {
  title: string;
  filter: boolean;
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
  const { title, filter, xLabels, seriesLabels } = props;
  const [select, setSelect] = useState<string>("01");

  const handleChange = (value: string) => {
    setSelect(value);
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
      <Grid container spacing={2} alignItems="center" sx={{ mb: "2rem" }}>
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
      <BarChart
        sx={{ width: { xs: 500, md: 600 } }}
        height={300}
        series={displaySeries()}
        xAxis={[{ data: xLabels, scaleType: "band" }]}
      />
    </Box>
  );
}
