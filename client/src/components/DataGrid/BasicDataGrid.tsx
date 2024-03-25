// MUI
import { Box, Button, Grid, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Dayjs } from "dayjs";
// Components
import DatePickerValue from "../DateTimePicker/DatePicker";

type BasicDataGridType = {
  title: string;
  rows: any;
  columns: GridColDef[];
  setStartDate: (value: Dayjs | null) => void;
  setEndDate: (value: Dayjs | null) => void;
};

export default function BasicDataGrid(props: BasicDataGridType) {
  const { title, rows, columns, setStartDate, setEndDate } = props;

  const handleStartDateChange = (date: Dayjs | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: Dayjs | null) => {
    setEndDate(date);
  };

  return (
    <Box sx={{ backgroundColor: "white", padding: "1rem" }}>
      <Grid container spacing={2} alignItems="center" sx={{ mb: "2rem" }}>
        <Grid item lg={6}>
          <Box display="flex" alignItems="center">
            <Typography variant="h6" fontWeight="bold">
              {title}
            </Typography>
            <Button variant="contained" size="large" sx={{ mx: "2rem" }}>
              Export to CSV
            </Button>
          </Box>
        </Grid>
        <Grid item lg={3}>
          <DatePickerValue
            label="Start Date"
            onDateChange={handleStartDateChange}
          />
        </Grid>
        <Grid item lg={3}>
          <DatePickerValue
            label="End Date"
            onDateChange={handleEndDateChange}
          />
        </Grid>
      </Grid>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row: Record<string, string | number>) =>
          (row.name as string) + row.timestamp
        }
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[5]}
        rowHeight={100}
        disableRowSelectionOnClick
        sx={{ minHeight: "10rem" }}
      />
    </Box>
  );
}
