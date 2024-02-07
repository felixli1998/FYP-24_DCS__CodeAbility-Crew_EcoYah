// React Imports
import { useState } from 'react';
import DonationRequestPlaceholder from '../../assets/DonationRequestPlaceholder.png';

// MUI Imports
import { Box, Stack, Typography } from '@mui/material';

// Components
import LabelledCheckBox from '../../components/Checkbox/LabelledCheckBox';
import ItemQuantityCard from '../../components/Card/ItemQuantityCard';

export default function DonorRequestForm() {

  const [donationRequest, setDonationRequest] = useState();
  const items = ['Broccoli', 'Cabbage', 'Eggplants'];

  const handleCheckBoxChange = (
    updatedCheckedState: Record<string, boolean>
  ) => {
    console.log(updatedCheckedState);
  };

  const handleItemQuantityChange = (
    updatedItemQuantity: Record<string, number>
  ) => {
    console.log(updatedItemQuantity);
  };

  return (
    <>
      <Box
        component='img'
        sx={{
          width: '100%',
          height: '30 rem',
          maxHeight: { xs: '15rem', md: '45rem' },
          paddingBottom: { xs: 2, md: 5 },
          objectFit: 'fill',
        }}
        alt='hello'
        src={DonationRequestPlaceholder}
      />
      <Stack spacing={2} sx={{ marginX: "2rem" }}>
        <Typography variant='h6' gutterBottom sx={{ marginTop: '1rem' }}>
          1. Choose the following items to donate:
        </Typography>
        <LabelledCheckBox
          label={items}
          onCheckBoxChange={handleCheckBoxChange}
        />
        <Typography variant='h6' gutterBottom sx={{ marginTop: '1rem' }}>
          2. Indicate the quantity to donate:
        </Typography>
        <ItemQuantityCard
          label={items}
          onItemQuantityChange={handleItemQuantityChange}
        />
        <LabelledCheckBox
          label={['Receive Points Upon A Successful Donation']}
          onCheckBoxChange={handleCheckBoxChange}
        />
      </Stack>
    </>
  );
}
