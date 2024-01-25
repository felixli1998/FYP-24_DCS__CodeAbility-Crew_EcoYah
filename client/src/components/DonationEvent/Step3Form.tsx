import { useState } from "react";
import { Typography, FormControlLabel, Switch } from '@mui/material';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

export default function Step3Form() {

    const [isActive, setIsActive] = useState(false);
   
    return (
        <>
        <Typography variant="h5" gutterBottom sx={{ letterSpacing: "0.18rem" }}>Choose the Donation Event Period</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer
            components={['DateRangePicker', 'DateRangePicker', 'DateRangePicker']}
        >
            <DemoItem label="" component="DateRangePicker">
            <DateRangePicker calendars={1} />
            </DemoItem>
        </DemoContainer>
        </LocalizationProvider>
        <Typography variant="h5" gutterBottom sx={{ letterSpacing: "0.18rem" }}>Activate the Donation Event</Typography>
        <FormControlLabel control={<Switch checked={isActive} onClick={() => setIsActive(!isActive)} sx={{ width: "9rem", height: "5.25rem", ".MuiSwitch-thumb": { width: "4.5rem", height: "4.25rem",  marginLeft: ( isActive ? "2rem" : null ) } }}/>} 
            label={ <Typography variant="h5" gutterBottom sx={{ letterSpacing: "0.18rem", marginLeft: "0.5rem" }}>Active</Typography> }/>
        </>
    );
};