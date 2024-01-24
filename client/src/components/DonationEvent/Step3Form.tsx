import { useState } from "react";
import { Typography, FormControlLabel, Switch } from '@mui/material';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { LicenseInfo } from '@mui/x-date-pickers-pro';

export default function Step3Form() {

    LicenseInfo.setLicenseKey(process.env.NEXT_PUBLIC_MUI_LICENSE_KEY!);
   
    return (
        <>
        <Typography variant="h5" gutterBottom>Choose the Donation Event Period</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer
            components={['DateRangePicker', 'DateRangePicker', 'DateRangePicker']}
        >
            <DemoItem label="" component="DateRangePicker">
            <DateRangePicker calendars={1} />
            </DemoItem>
        </DemoContainer>
        </LocalizationProvider>
        <Typography variant="h5" gutterBottom>Activate the Donation Event</Typography>
        <FormControlLabel control={<Switch defaultChecked />} label="Active" />
        </>
    );
};