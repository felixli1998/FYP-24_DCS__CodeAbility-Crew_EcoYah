// React Imports
import { useState, useEffect } from 'react';
import DonationRequestPlaceholder from '../../assets/DonationRequestPlaceholder.png';

// MUI Imports
import { Box, Stack, Typography } from '@mui/material';

// Components
import LabelledCheckBox from '../../components/Checkbox/LabelledCheckBox';
import ItemQuantityCard from '../../components/Card/ItemQuantityCard';
import ContainedButton from '../../components/Button/ContainedButton';
import DateTimePicker from '../../components/DateTimePicker/DateTimePicker';

import { Dayjs } from 'dayjs';

export default function DonorRequestForm() {
  const [donationRequest, setDonationRequest] = useState({});
  const items = ['Broccoli', 'Cabbage', 'Eggplants'];
  const [omitPoints, setOmitPoints] = useState<boolean>(true);

  const handleCheckBoxChange = (
    updatedCheckedState: Record<string, boolean>
  ) => {
    console.log(updatedCheckedState);

    if (updatedCheckedState['Receive Points Upon A Successful Donation'])
      setOmitPoints(false);
    else setOmitPoints(true);
  };

  const handleItemQuantityChange = (
    updatedItemQuantity: Record<string, number>
  ) => {
    console.log(updatedItemQuantity);
  };

  const handleDateTimeChange = (dateTime: Dayjs | null) => {
    console.log(dateTime);
  };

  const handleButtonChange = (status: boolean) => {
    console.log(status);
  };

  useEffect(() => {
    console.log(omitPoints);
  }, [omitPoints]);

  return (
    <>
      <Box
        component='img'
        sx={{
          width: '100%',
          height: '20rem',
          objectFit: 'cover',
        }}
        alt='donation event name'
        src={DonationRequestPlaceholder}
      />
      <Stack spacing={3} sx={{ margin: '1rem 2rem' }}>
        <Typography variant='h6' gutterBottom>
          1. Choose the following items to donate:
        </Typography>
        <LabelledCheckBox
          label={items}
          onCheckBoxChange={handleCheckBoxChange}
        />
        <Typography variant='h6' gutterBottom>
          2. Indicate the quantity to donate:
        </Typography>
        <ItemQuantityCard
          label={items}
          onItemQuantityChange={handleItemQuantityChange}
        />
        <Typography variant='h6' gutterBottom>
          3. Drop-off Date & Time:
        </Typography>
        <DateTimePicker
          label={'Date & Time'}
          onDateTimeChange={handleDateTimeChange}
        />
        <LabelledCheckBox
          label={['Receive Points Upon A Successful Donation']}
          onCheckBoxChange={handleCheckBoxChange}
        />
        <ContainedButton
          label='Submit Donation'
          onButtonChange={handleButtonChange}
        />
      </Stack>
    </>
  );
}
