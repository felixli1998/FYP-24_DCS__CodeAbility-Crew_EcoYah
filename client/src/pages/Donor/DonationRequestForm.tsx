// React Imports
import { useState } from 'react';

// MUI Imports
import { Box, Stack, Typography, Alert } from "@mui/material";

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
import { DONATION_REQUEST_ROUTES } from "../../services/routes";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

type DonationRequestType = {
  donationEventId: number;
  dropOffDate: Date;
  dropOffTime: string;
  omitPoints: boolean;
  submittedBy: number;
  donationRequestItems: Record<string, number>[];
};

export default function DonationRequestForm() {
  const navigate = useNavigate();
  const [donationRequest, setDonationRequest] = useState<DonationRequestType>({
    donationEventId: 1, // Hardcode for now
    dropOffDate: new Date(),
    dropOffTime: "",
    omitPoints: false,
    submittedBy: 1, // Hardcode for now
    donationRequestItems: [],
  });
  const [error, setError] = useState<boolean>(false);
  const itemsInfo: Record<string, string | number>[] = [
    { id: 1, item: "Broccoli", unit: "kilogram", minQty: 1, pointsPerUnit: 20 },
    {
      id: 2,
      item: "Cabbage",
      unit: "kilogram",
      minQty: 2,
      pointsPerUnit: 40,
    },
    {
      id: 3,
      item: "Eggplants",
      unit: "kilogram",
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
    console.log(updatedCheckedState);
    if ("omitPoints" in updatedCheckedState) {
      setDonationRequest((prevData) => ({
        ...prevData,
        omitPoints: !prevData.omitPoints,
      }));
    } else {
      _.mapValues(updatedCheckedState, function (value, key) {
        if (value) {
          // If value is true, add to selectedItems if not already present
          const itemExists = selectedItems.some(
            (selectedItem) => selectedItem["id"] === Number(key)
          );

          if (!itemExists) {
            const foundItem = itemsInfo.find(
              (item) => item["id"] === Number(key)
            );
            setSelectedItems((prevSelectedItems) => [
              ...prevSelectedItems,
              { ...foundItem },
            ]);
          }
        } else {
          // If value is false, remove from selectedItems if present
          setSelectedItems((prevSelectedItems) =>
            prevSelectedItems.filter((item) => item["id"] !== Number(key))
          );
        }
      });
    }
  };

  const handleItemQuantityChange = (
    updatedItemQuantity: Record<number, Record<string, number | string>>
  ) => {
    const donationRequestItems: Record<string, number>[] = [];
    _.mapValues(updatedItemQuantity, function (value, key) {
      donationRequestItems.push({
        donationEventItemId: Number(key),
        quantity: Number(value.quantity),
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
    if (
      donationRequest.donationEventId !== 0 &&
      donationRequest.submittedBy !== 0 &&
      donationRequest.dropOffTime !== "" &&
      donationRequest.donationRequestItems.length > 0
    ) {
      axios
        .post(DONATION_REQUEST_ROUTES.CREATE, donationRequest)
        .then((resp) => {
          if (resp.data.status === 200) navigate("/home");
        })
        .catch((err) => {
          setError(true);
        });
    }
  };

  return (
    <>
      <ImageCoverCard image={DonationRequestPlaceholder} name={"Food Rescue"} />
      <Stack spacing={3} sx={{ maxWidth: "30rem", margin: "2rem 1.5rem" }}>
        <Typography variant="h5" gutterBottom>
          1. Choose the items to donate:
        </Typography>
        <LabelledCheckBox
          label={[
            { id: 1, name: "Broccoli", value: true },
            { id: 2, name: "Cabbage", value: false },
            { id: 3, name: "Eggplants", value: false },
          ]}
          onCheckBoxChange={handleCheckBoxChange}
          validateForm={validateForm}
        />
        {selectedItems.length >= 1 && (
          <>
            <Typography variant="h5" gutterBottom>
              2. Indicate the quantity to donate:
            </Typography>
            <ItemQuantityCard
              label={selectedItems}
              onItemQuantityChange={handleItemQuantityChange}
            />
          </>
        )}
        <Box display="flex">
          <Typography variant="h5" gutterBottom>
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
          label={"Date & Time"}
          onDateTimeChange={handleDateTimeChange}
          validateForm={validateForm}
        />
        <LabelledCheckBox
          label={[
            {
              id: "omitPoints",
              name: "Receive Points Upon A Successful Donation",
              value: false
            },
          ]}
          onCheckBoxChange={handleCheckBoxChange}
        />
        <BasicButton
          label="Submit Donation"
          variant="contained"
          onButtonChange={handleButtonChange}
        />
        {error && (
          <Alert severity="error">
            An error occurred while saving your donation request. Please refresh
            and try again.
          </Alert>
        )}
      </Stack>
    </>
  );
}
