import { useState, useEffect } from "react";
import { Typography, Grid, FormControlLabel, Switch } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import moment from 'moment';

type Step3FormProps = {
    validate: boolean
    data: (key: string, value: any) => void
}

export default function Step3Form(props: Step3FormProps) {

    const datePickerFields = [ 'Start Date', 'End Date' ];
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [isActive, setIsActive] = useState(false);

    const handleDateChange = (field: string) => (date: Date | null) => {
        if (field === "Start Date") {
            setStartDate(date);
        } else {
            setEndDate(date);
        }
    }

    useEffect(() => {
        props.data("startDate", moment(startDate).format("DD-MM-YYYY"));
        props.data("endDate", moment(endDate).format("DD-MM-YYYY"));
        props.data("isActive", isActive);
    }, [startDate, endDate, isActive]);
   
    return (
        <>
        <Typography variant="h5" gutterBottom sx={{ letterSpacing: "0.18rem", marginBottom: "1.5rem" }}>Choose the Donation Event Period</Typography>
        <Grid container justifyContent="space-between">
        { datePickerFields.map(function(field, i) {
            return <Grid item xs={12} md={6} lg={6} key={i}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label={field}
                    sx={{ width: 300, marginBottom: "1.5rem" }}
                    slotProps={{
                    textField: {
                        helperText: 'DD/MM/YYYY',
                        InputLabelProps: { shrink: true }
                    },
                    }}
                    format="DD-MM-YYYY"
                    value={ field === "Start Date" ? startDate : endDate }
                    onChange={handleDateChange(field)}
                />
                </LocalizationProvider>
            </Grid> }) }
        </Grid>
        <Typography variant="h5" gutterBottom sx={{ letterSpacing: "0.18rem", marginBottom: "1.5rem" }}>Activate the Donation Event</Typography>
        <FormControlLabel control={<Switch checked={isActive} onClick={() => setIsActive(!isActive)} sx={{ width: "9rem", height: "5.25rem", ".MuiSwitch-thumb": { width: "4.4rem", height: "4.1rem",  marginLeft: ( isActive ? "2rem" : null ) } }}/>} 
            label={ <Typography variant="h5" gutterBottom sx={{ color: isActive ? "primary.dark" : "secondary.dark", letterSpacing: "0.18rem", marginLeft: "0.5rem" }}>{ isActive ? "Active" : "Inactive" }</Typography> }/>
        </>
    );
};