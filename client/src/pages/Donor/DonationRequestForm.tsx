// React Imports
import { useState, useEffect } from "react";

// MUI Imports
import { Box, Stack, Typography, Alert } from "@mui/material";

// Components
import ImageCoverCard from "../../components/Card/ImageCoverCard";
import LabelledCheckBox from "../../components/Checkbox/LabelledCheckBox";
import ItemQuantityCard from "../../components/Card/ItemQuantityCard";
import BasicButton from "../../components/Button/BasicButton";
import DateTimePicker from "../../components/DateTimePicker/DateTimePicker";
import InfoToolTip from "../../components/ToolTip/InfoToolTip";

// Other Imports
import dayjs, { Dayjs } from "dayjs";
import _ from "lodash";
import { DONATION_REQUEST_ROUTES } from "../../services/routes";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { dataToDonationRequestFormType, donationEventItemsType } from "./DonationEvents";

type DonationRequestType = {
  donationEventId: number;
  dropOffDate: Date;
  dropOffTime: string;
  omitPoints: boolean;
  submittedBy: number;
  donationRequestItems: Record<string, number>[];
};

type CheckBoxItemsType = {
  id: number;
  name: string;
  value: boolean;
};

export default function DonationRequestForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const [action, setAction] = useState<string>('submit'); // create == submit
  const [donationEventInfo, setDonationEventInfo] =
    useState<dataToDonationRequestFormType | null>(null);
  const [donationRequest, setDonationRequest] = useState<DonationRequestType>({
    donationEventId: 0, 
    dropOffDate: new Date(),
    dropOffTime: "",
    omitPoints: false,
    submittedBy: 1, // Hardcode for now
    donationRequestItems: [],
  });
  const [itemsInfo, setItemsInfo] = useState<donationEventItemsType[] | []>([]);
  const [checkBoxItems, setCheckBoxItems] = useState<CheckBoxItemsType[] | []>([]);
  const [selectedItems, setSelectedItems] = useState<Record<string, string | number>[] | []>([]);
  const [validateForm, setValidateForm] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const handleCheckBoxItems = (donationEventItems: donationEventItemsType[]) => {
    const updatedCheckBoxItems: CheckBoxItemsType[] = [];
    donationEventItems.forEach(donationEventItem => {
      updatedCheckBoxItems.push({
        id: donationEventItem.id,
        name: donationEventItem.item.name,
        value: false
      });
    });
    setCheckBoxItems(updatedCheckBoxItems);
  }
  console.log(checkBoxItems);

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
            if (foundItem) {
              setSelectedItems((prevSelectedItems) => [
                ...prevSelectedItems,
                { id: foundItem.id, 
                  item: foundItem.item.name,
                  unit: foundItem.item.unit,
                  minQty: foundItem.minQty,
                  pointsPerUnit: foundItem.pointsPerUnit
                },
              ]);
            }
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
  console.log(selectedItems);

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
    console.log(donationRequest);
    if (
      donationRequest.donationEventId !== 0 &&
      donationRequest.submittedBy !== 0 &&
      donationRequest.dropOffTime !== "" &&
      donationRequest.donationRequestItems.length > 0
    ) {
      if (action === 'submit') {
        axios
        .post(DONATION_REQUEST_ROUTES.CREATE, donationRequest)
        .then((resp) => {
          if (resp.data.status === 200) navigate("/");
        })
        .catch((err) => {
          setError(true);
        });
      } else {
        axios
        .put(DONATION_REQUEST_ROUTES.UPDATE, donationRequest)
        .then((resp) => {
          if (resp.data.status === 200) navigate("/donation-requests");
        })
        .catch((err) => {
          setError(true);
        });
      }
    }
  };

  useEffect(() => {
    console.log(location.state);
    // should not be able to access this page through the url
    if (location.state === null) {
      navigate("/");
    } else {
      if (location.state.action === 'edit') setAction('edit');
      setDonationEventInfo(location.state.form);
      setDonationRequest(prevDonationRequest => ({
        ...prevDonationRequest,
        donationEventId: location.state.form.id,
      }));
      setItemsInfo(location.state.form.donationEventItems);
      handleCheckBoxItems(location.state.form.donationEventItems);
    }
  }, []);

  return donationEventInfo ? (
    <>
      <ImageCoverCard
        image={donationEventInfo.imageId}
        name={donationEventInfo.name}
        startDate={donationEventInfo.startDate}
        endDate={donationEventInfo.endDate}
      />
      <Stack spacing={3} sx={{ maxWidth: "30rem", margin: "2rem 1.5rem" }}>
        <Typography variant="h5" gutterBottom>
          1. Choose the items to donate:
        </Typography>
        <LabelledCheckBox
          label={checkBoxItems}
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
              value: false,
            },
          ]}
          onCheckBoxChange={handleCheckBoxChange}
        />
        <BasicButton
          label={`${action} Donation`}
          variant="contained"
          onButtonChange={handleButtonChange}
        />
        <BasicButton
          label="Cancel"
          variant="outlined"
          onButtonChange={(status: boolean) => navigate("/")}
        />
        {error && (
          <Alert severity="error">
            An error occurred while saving your donation request. Please refresh
            and try again.
          </Alert>
        )}
      </Stack>
    </>
  ) : null;
}
