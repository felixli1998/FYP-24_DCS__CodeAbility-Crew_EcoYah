// React Imports
import { useState, useEffect } from 'react';

// MUI Imports
import { Box, Stack, Typography } from '@mui/material';

// Components
import LabelledCheckBox from '../../components/Checkbox/LabelledCheckBox';
import ItemQuantityCard from '../../components/Card/ItemQuantityCard';
import ContainedButton from '../../components/Button/ContainedButton';
import DateTimePicker from '../../components/DateTimePicker/DateTimePicker';
import InfoToolTip from '../../components/ToolTip/InfoToolTip';

// Other Imports
import DonationRequestPlaceholder from '../../assets/DonationRequestPlaceholder.png';
import { Dayjs } from 'dayjs';
import _ from 'lodash';

export default function DonationRequestForm() {
  const [donationRequest, setDonationRequest] = useState({});
  const items: string[] = ['Broccoli', 'Cabbage', 'Eggplants']; // Hardcode for now
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [omitPoints, setOmitPoints] = useState<boolean>(true);
  const [validateForm, setValidateForm] = useState<boolean>(false);

  const handleCheckBoxChange = (
    updatedCheckedState: Record<string, boolean>
  ) => {
    console.log(updatedCheckedState);

    if ('Receive Points Upon A Successful Donation' in updatedCheckedState) {
      if (updatedCheckedState['Receive Points Upon A Successful Donation'])
        setOmitPoints(false);
      else setOmitPoints(true);
    } else {
      _.mapValues(updatedCheckedState, function (value, key) {
        if (value) {
          // If value is true, add to selectedItems if not already present
          if (!selectedItems.includes(key)) {
            setSelectedItems((prevSelectedItems) => [
              ...prevSelectedItems,
              key,
            ]);
          }
        } else {
          // If value is false, remove from selectedItems if present
          setSelectedItems((prevSelectedItems) =>
            prevSelectedItems.filter((item) => item !== key)
          );
        }
      });
    }
  };

  console.log(selectedItems);

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
    setValidateForm(true);
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
      <Stack spacing={3} sx={{ margin: '1rem 1.5rem' }}>
        <Typography variant='h5' gutterBottom>
          1. Choose the items to donate:
        </Typography>
        <LabelledCheckBox
          label={items}
          onCheckBoxChange={handleCheckBoxChange}
          validateForm={validateForm}
        />
        {selectedItems.length >= 1 && (
          <>
            <Typography variant='h5' gutterBottom>
              2. Indicate the quantity to donate:
            </Typography>
            <ItemQuantityCard
              label={selectedItems}
              onItemQuantityChange={handleItemQuantityChange}
            />
          </>
        )}
        <Box display='flex'>
          <Typography variant='h5' gutterBottom>
            3. Drop-off Date & Time:
          </Typography>
          <InfoToolTip
            label={`The drop-off location is at Kunyah Cafe Food Kiosk.
                    90 Stamford Rd, 
                    #01-76 Opposite YMCA, 
                    Singapore 178903`}
          />
        </Box>
        <DateTimePicker
          label={'Date & Time'}
          onDateTimeChange={handleDateTimeChange}
          validateForm={validateForm}
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
