// React Imports
import { useState, useEffect } from 'react';

// MUI Imports
import { Box, Stack, Typography } from '@mui/material';

// Components
import ImageCoverCard from '../../components/Card/ImageCoverCard';
import LabelledCheckBox from '../../components/Checkbox/LabelledCheckBox';
import ItemQuantityCard from '../../components/Card/ItemQuantityCard';
import ContainedButton from '../../components/Button/ContainedButton';
import DateTimePicker from '../../components/DateTimePicker/DateTimePicker';
import InfoToolTip from '../../components/ToolTip/InfoToolTip';

// Other Imports
import DonationRequestPlaceholder from '../../assets/DonationRequestPlaceholder.png';
import { Dayjs } from 'dayjs';
import _ from 'lodash';

type DonationRequestType = {
  donationEventID: number;
  user: number;
  dropOffDate: Date;
  dropOffTime: Date;
  omitPoints: boolean;
  donationRequestItems: Record<string, string | number>[];
};

export default function DonationRequestForm() {
  const [donationRequest, setDonationRequest] = useState<DonationRequestType>({
    donationEventID: 0,
    user: 0,
    dropOffDate: new Date(),
    dropOffTime: new Date(),
    omitPoints: false,
    donationRequestItems: [],
  });
  const items: string[] = ['Broccoli', 'Cabbage', 'Eggplants']; // Hardcode for now
  const itemsInfo: Record<string, string | number>[] = [
    { item: 'Broccoli', unit: 'kilogram', minQty: 1, pointsPerUnit: 20 },
    {
      item: 'Cabbage',
      unit: 'kilogram',
      minQty: 2,
      pointsPerUnit: 40,
    },
    {
      item: 'Eggplants',
      unit: 'kilogram',
      minQty: 1,
      pointsPerUnit: 25,
    },
  ]; // Hardcode for now
  const [selectedItems, setSelectedItems] = useState<
    Record<string, string | number>[]
  >([]);
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
          const itemExists = selectedItems.some(
            (selectedItem) => selectedItem['item'] === key
          );

          if (!itemExists) {
            const foundItem = itemsInfo.find((item) => item['item'] === key);
            setSelectedItems((prevSelectedItems) => [
              ...prevSelectedItems,
              { ...foundItem },
            ]);
          }
        } else {
          // If value is false, remove from selectedItems if present
          setSelectedItems((prevSelectedItems) =>
            prevSelectedItems.filter((item) => item['item'] !== key)
          );
        }
      });
    }
  };

  console.log(selectedItems);

  const handleItemQuantityChange = (
    updatedItemQuantity: Record<string, Record<string, number>>
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
      <ImageCoverCard image={DonationRequestPlaceholder} name={'Food Rescue'} />
      <Stack spacing={3} sx={{ margin: '2rem 1.5rem' }}>
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
            3. Drop-off date & time:
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
