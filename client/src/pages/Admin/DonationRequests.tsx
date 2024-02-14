// React Imports
import { useState, useEffect } from 'react';

// MUI Imports
import { Stack } from '@mui/material';

// Components
import StaffTypography from '../../components/Typography/StaffTypography';
import DatePicker from '../../components/DateTimePicker/DatePicker';
import ItemList from '../../components/List/List';

// Other Imports
import dayjs, { Dayjs } from 'dayjs';
import { DONATION_REQUEST_ROUTES } from '../../services/routes';
import axios from 'axios';

export default function DonationRequests() {
  const [donationRequests, setDonationRequests] = useState([]);
  const handleDateChange = (date: Dayjs | null) => {
    console.log(date);
    if (date !== null) handleData(date);
  };

  const handleData = (date: Dayjs | Date) => {
    console.log(date);
    axios
      .get(DONATION_REQUEST_ROUTES.RETRIEVE_ACTIVE_BY_DATE, {
        params: {
          date: dayjs(date).format('YYYY/MM/DD'),
        },
      })
      .then((resp) => {
        console.log(resp);
        setDonationRequests(resp.data.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    handleData(new Date());
  }, []);

  return (
    <Stack spacing={5} sx={{ margin: { xs: '2rem 2rem', md: '2rem 4rem' } }}>
      <StaffTypography
        type='title'
        size={2.5}
        text={'Active Donation Requests'}
      ></StaffTypography>
      <DatePicker
        label={'Date'}
        defaultValue={new Date()}
        onDateChange={handleDateChange}
      ></DatePicker>
      <ItemList data={donationRequests}></ItemList>
    </Stack>
  );
}
