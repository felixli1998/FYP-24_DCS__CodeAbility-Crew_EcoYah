import { useState, useEffect } from "react";
import { Typography, Grid, FormControlLabel, Switch } from '@mui/material';
import dayjs, { Dayjs } from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

type Step3FormProps = {
    validate: boolean
    data: (key: string, value: any) => void
    back: boolean
    prevData: any
}

export default function Step3Form(props: Step3FormProps) {

    dayjs.extend(utc);
    dayjs.extend(timezone);

    const datePickerFields = [ 'Start Date', 'End Date' ];
    const [startDate, setStartDate] = useState<Dayjs | null>((props.back && dayjs(props.prevData['startDate'])) || null);
    const [endDate, setEndDate] = useState<Dayjs | null>((props.back && dayjs(props.prevData['endDate'])) || null);
    const [isActive, setIsActive] = useState(props.back && props.prevData['isActive'] ? props.prevData['isActive'] : false);

    const handleDateChange = (field: string) => (date: Dayjs | null) => {
        if (field === "Start Date") {
            setStartDate(date);
        } else {
            setEndDate(date);
        }
    }

    const displayError = (index: number) => {
        if (index === 0 && props.validate && startDate === null) return true;
        else if (index === 1 && props.validate && endDate === null) return true;
        else if (index === 0 && props.validate && startDate! < dayjs(new Date().setHours(0,0,0,0))) return true;
        else if (index === 1 && props.validate && endDate! < startDate!) return true;
        else return false;
    }

    const displayErrorMsg = (index: number) => {
        if (index === 0 && props.validate && startDate === null) {
            return "Please choose a Date (DD/MM/YYYY)";
        } else if (index === 1 && props.validate && endDate === null) {
            return "Please choose a Date (DD/MM/YYYY)";
        } else if (index === 0 && props.validate && startDate! < dayjs(new Date().setHours(0,0,0,0))) {
            return "The start date should be today or later";
        } else if (index === 1 && props.validate && endDate! < startDate!) {
            return "The end date should either match or come after the start date";
        } else {
            return "DD/MM/YYYY";
        }
    }

    // console.log(startDate);
    // console.log(endDate);

    useEffect(() => {
        // set the time of the currentDate to be midnight so comparison with the startDate can be done based on the date
        if (startDate! >= dayjs(new Date().setHours(0,0,0,0)) &&  endDate! >= startDate!) {
            props.data("startDate", startDate);
            props.data("endDate", endDate);
        } else {
            props.data("startDate", null);
            props.data("endDate", null);
        }
        props.data("isActive", isActive);
    }, [startDate, endDate, isActive]);
   
    return (
        <>
        <Typography variant="h5" gutterBottom sx={{ letterSpacing: "0.18rem", marginBottom: "1.5rem", fontWeight: "bold" }}>Choose the Donation Event Period</Typography>
        <Grid container justifyContent="space-between">
        { datePickerFields.map(function(field, i) {
            return <Grid item xs={12} md={12} lg={6} key={i}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label={field}
                    sx={{ width: 350, marginBottom: "1.5rem" }}
                    slotProps={{
                    textField: {
                        helperText: <Typography component={'span'} variant="h5" gutterBottom sx={{ letterSpacing: "0.18rem" }}>{displayErrorMsg(i)}</Typography>,
                        InputLabelProps: { shrink: true },
                        error: displayError(i)
                    },
                    }}
                    format="DD/MM/YYYY"
                    timezone="Asia/Singapore"
                    value={ i === 0 ? startDate : endDate }
                    onChange={handleDateChange(field)}
                />
                </LocalizationProvider>
            </Grid> }) }
        </Grid>
        <Typography variant="h5" gutterBottom sx={{ letterSpacing: "0.18rem", marginBottom: "1.5rem", fontWeight: "bold" }}>Activate the Donation Event</Typography>
        <FormControlLabel control={<Switch checked={isActive} onClick={() => setIsActive(!isActive)} sx={{ width: "9rem", height: "5.25rem", ".MuiSwitch-thumb": { width: "4.4rem", height: "4.1rem",  marginLeft: ( isActive ? "2rem" : null ) } }}/>} 
            label={ <Typography variant="h5" gutterBottom sx={{ color: isActive ? "primary.dark" : "secondary.dark", letterSpacing: "0.18rem", marginLeft: "0.5rem" }}>{ isActive ? "Active" : "Inactive" }</Typography> }/>
        </>
    );
};