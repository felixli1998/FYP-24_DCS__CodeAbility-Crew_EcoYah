// React Imports
import React from 'react';

// MUI Imports
import { Stack } from '@mui/material';

// Components
import StaffTypography from '../../components/Typography/StaffTypography';
import DatePicker from '../../components/DateTimePicker/DatePicker';

// Other Imports
import { Dayjs } from 'dayjs';

export default function DonationRequests() {
  const handleDateChange = (date: Dayjs | null) => {
    console.log(date);
  };

  return (
    <Stack spacing={5} sx={{ margin: '2rem 5rem' }}>
      <StaffTypography
        type='title'
        size={2.5}
        text={'Active Donation Requests'}
      ></StaffTypography>
      <DatePicker label={'Date'} onDateChange={handleDateChange}></DatePicker>
    </Stack>
  );
}
