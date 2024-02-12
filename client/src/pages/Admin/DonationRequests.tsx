// React Imports
import React from 'react';

// MUI Imports
import { Stack } from '@mui/material';

// Components
import StaffTypography from '../../components/Typography/StaffTypography';
import DatePicker from '../../components/DateTimePicker/DatePicker';
import ItemList from '../../components/List/List';

// Other Imports
import { Dayjs } from 'dayjs';

export default function DonationRequests() {
  const handleDateChange = (date: Dayjs | null) => {
    console.log(date);
  };

  return (
    <Stack spacing={5} sx={{ margin: { xs: '2rem 2rem', md: '2rem 4rem' } }}>
      <StaffTypography
        type='title'
        size={2.5}
        text={'Active Donation Requests'}
      ></StaffTypography>
      <DatePicker label={'Date'} defaultValue={new Date()} onDateChange={handleDateChange}></DatePicker>
      <ItemList></ItemList>
    </Stack>
  );
}
