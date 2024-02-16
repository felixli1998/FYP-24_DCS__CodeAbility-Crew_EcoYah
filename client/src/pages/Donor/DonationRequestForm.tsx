// React Imports
import { useState } from 'react';

// MUI Imports
import { Box, Stack, Typography } from '@mui/material';

// Components
import ImageCoverCard from '../../components/Card/ImageCoverCard';
import LabelledCheckBox from '../../components/Checkbox/LabelledCheckBox';
import ItemQuantityCard from '../../components/Card/ItemQuantityCard';
import BasicButton from '../../components/Button/BasicButton';
import DateTimePicker from '../../components/DateTimePicker/DateTimePicker';
import InfoToolTip from '../../components/ToolTip/InfoToolTip';

// Other Imports
import DonationRequestPlaceholder from '../../assets/DonationRequestPlaceholder.png';
import dayjs, { Dayjs } from 'dayjs';
import _ from 'lodash';

type DonationRequestType = {
  user: number;
  donationRequestItems: Record<string, string | number>[];
  omitPoints: boolean;
  dropOffDate: Date;
  dropOffTime: string;
};

export default function DonationRequestForm() {
  const [donationRequest, setDonationRequest] = useState<DonationRequestType>({
    user: 0,
    donationRequestItems: [],
    omitPoints: false,
    dropOffDate: new Date(),
    dropOffTime: '',
  });
  const itemsInfo: Record<string, string | number>[] = [
    { id: 1, item: 'Broccoli', unit: 'kilogram', minQty: 1, pointsPerUnit: 20 },
    {
      id: 2,
      item: 'Cabbage',
      unit: 'kilogram',
      minQty: 2,
      pointsPerUnit: 40,
    },
    {
      id: 3,
      item: 'Eggplants',
      unit: 'kilogram',
      minQty: 1,
      pointsPerUnit: 25,
    },
  ]; // Hardcode for now
  const [selectedItems, setSelectedItems] = useState<
    Record<string, string | number>[]
  >([]);
  const [validateForm, setValidateForm] = useState<boolean>(false);

  const handleCheckBoxChange = (
    updatedCheckedState: Record<string, boolean>
  ) => {
    if ('omitPoints' in updatedCheckedState) {
      if (!updatedCheckedState['omitPoints'])
        setDonationRequest((prevData) => ({
          ...prevData,
          omitPoints: true,
        }));
      else
        setDonationRequest((prevData) => ({
          ...prevData,
          omitPoints: false,
        }));
    } else {
      _.mapValues(updatedCheckedState, function (value, key) {
        if (value) {
          // If value is true, add to selectedItems if not already present
          const itemExists = selectedItems.some(
            (selectedItem) => selectedItem['id'] === Number(key)
          );

          if (!itemExists) {
            const foundItem = itemsInfo.find((item) => item['id'] === Number(key));
            setSelectedItems((prevSelectedItems) => [
              ...prevSelectedItems,
              { ...foundItem },
            ]);
          }
        } else {
          // If value is false, remove from selectedItems if present
          setSelectedItems((prevSelectedItems) =>
            prevSelectedItems.filter((item) => item['id'] !== Number(key))
          );
        }
      });
    }
  };

  const handleItemQuantityChange = (
    updatedItemQuantity: Record<string, Record<string, number | string>>
  ) => {
    const donationRequestItems: Record<string, string | number>[] = [];
    _.mapValues(updatedItemQuantity, function (value, key) {
      donationRequestItems.push({
        donationEventItemID: key,
        quantity: value.quantity,
      });
    });
    setDonationRequest((prevData) => ({
      ...prevData,
      donationRequestItems: donationRequestItems,
    }));
  };

  const handleDateTimeChange = (dateTime: Dayjs | null) => {
    if (dateTime !== null) {
      const formattedDate = dayjs(dateTime).format('DD/MM/YYYY');
      const formattedTime = dayjs(dateTime).format('HH:mm');
      setDonationRequest((prevData) => ({
        ...prevData,
        dropOffDate: dayjs(formattedDate, 'DD/MM/YYYY').toDate(),
        dropOffTime: formattedTime,
      }));
    }
  };

  const handleButtonChange = (status: boolean) => {
    setValidateForm(true);
  };

  return (
    <>
      <ImageCoverCard image={DonationRequestPlaceholder} name={'Food Rescue'} />
      <Stack spacing={3} sx={{ maxWidth: '30rem', margin: '2rem 1.5rem' }}>
        <Typography variant='h5' gutterBottom>
          1. Choose the items to donate:
        </Typography>
        <LabelledCheckBox
          label={[{ id: 1, name: 'Broccoli' }, { id: 2, name: 'Cabbage' }, { id: 3, name: 'Eggplants' }]}
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
          label={[{ id: 'omitPoints', name: 'Receive Points Upon A Successful Donation'}]}
          onCheckBoxChange={handleCheckBoxChange}
        />
        <BasicButton
          label='Submit Donation'
          variant='contained'
          onButtonChange={handleButtonChange}
        />
      </Stack>
    </>
  );
}
