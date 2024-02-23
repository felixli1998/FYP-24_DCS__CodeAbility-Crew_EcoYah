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
import { DONATION_REQUEST_ROUTES, DONATION_EVENT_ROUTES } from "../../services/routes";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { dataToDonationRequestFormType, donationEventItemsType } from "./DonationEvents";

type DonationRequestType = {
  donationRequestId?: number;
  donationEventId: number;
  dropOffDate: Date;
  dropOffTime: string;
  omitPoints: boolean;
  submittedBy: number;
  oldDonationRequestItems?: Record<string, number>[];
  newDonationRequestItems: Record<string, number>[];
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
    donationRequestId: 0,
    donationEventId: 0, 
    dropOffDate: new Date(),
    dropOffTime: "",
    omitPoints: false,
    submittedBy: 1, // Hardcode for now
    oldDonationRequestItems: [],
    newDonationRequestItems: [],
  });
  const [itemsInfo, setItemsInfo] = useState<donationEventItemsType[] | []>([]);
  const [isCheckBoxItemsLoaded, setCheckBoxItemsLoaded] = useState<boolean>(false);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const [checkBoxItems, setCheckBoxItems] = useState<CheckBoxItemsType[] | []>([]);
  const [selectedItems, setSelectedItems] = useState<Record<string, string | number>[] | []>([]);
  const [validateForm, setValidateForm] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const handleCheckBoxItems = (action: string, donationEventItems: donationEventItemsType[], oldDonationRequestItems?: any) => {
    console.log(oldDonationRequestItems);
    const updatedCheckBoxItems: CheckBoxItemsType[] = [];
    donationEventItems.forEach(donationEventItem => {
      console.log(donationEventItem)
      const isOldItem = oldDonationRequestItems?.find(
       (oldItem: any) => oldItem.donationEventItem.id === donationEventItem.id
      );
      updatedCheckBoxItems.push({
        id: donationEventItem.id,
        name: donationEventItem.item.name,
        value: action === 'edit' && !!isOldItem ,
      });
    });
    setCheckBoxItems(updatedCheckBoxItems);
    setCheckBoxItemsLoaded(true);
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
      let updatedSelectedItems: Record<string, string | number>[] = [];
      const updatedCheckedKeys = Object.keys(updatedCheckedState);

      if (isFirstLoad) {
        checkBoxItems.forEach((item) => {
          if (item.value && updatedCheckedKeys.includes(item.id.toString())) {
            const foundItem = itemsInfo.find((targetItem) => targetItem.id === item.id);
            if (foundItem) {
              updatedSelectedItems.push({
                id: foundItem.id, 
                item: foundItem.item.name,
                unit: foundItem.item.unit,
                minQty: foundItem.minQty,
                pointsPerUnit: foundItem.pointsPerUnit
              });
            }
          }
        });
        setIsFirstLoad(false);
      } else {
        updatedCheckedKeys.forEach((key) => {
          const foundItem = itemsInfo.find((item) => item.id === Number(key));
          if (foundItem) {
            const isSelected = updatedCheckedState[key];
            if (isSelected) {
              updatedSelectedItems.push({
                id: foundItem.id, 
                item: foundItem.item.name,
                unit: foundItem.item.unit,
                minQty: foundItem.minQty,
                pointsPerUnit: foundItem.pointsPerUnit
              });
            } else {
              // remove the item if it's not selected anymore
              updatedSelectedItems = updatedSelectedItems.filter(
                (item) => item.id !== foundItem.id
              );
            }
          }
        });
      }
      setSelectedItems(updatedSelectedItems);
    }
  };
  console.log(selectedItems);

  const handleItemQuantityChange = (
    updatedItemQuantity: Record<number, Record<string, number | string>>
  ) => {
    console.log(updatedItemQuantity)
    const donationRequestItems: Record<string, number>[] = [];
    _.mapValues(updatedItemQuantity, function (value, key) {
      console.log(value)
      if (donationRequest.oldDonationRequestItems) {
        const existingItem = donationRequest.oldDonationRequestItems.find(
          (item: any) => item.donationEventItem.id === Number(key)
        );
        console.log(existingItem)

        if (existingItem) {
          existingItem.quantity = Number(value.quantity);
        } else {
          donationRequestItems.push({
            donationEventItemId: Number(key),
            quantity: Number(value.quantity),
          });
        }
        
      }
    });
    setDonationRequest((prevData) => ({
      ...prevData,
      newDonationRequestItems: donationRequestItems,
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

    if (action === "submit") {
      if (
        donationRequest.donationEventId !== 0 &&
        donationRequest.submittedBy !== 0 &&
        donationRequest.dropOffTime !== "" &&
        donationRequest.newDonationRequestItems.length > 0
      ) {
        handleCreateDonationRequest(donationRequest);
      }
    } else {
      if (
        donationRequest.donationEventId !== 0 &&
        donationRequest.donationRequestId !== 0 &&
        donationRequest.submittedBy !== 0 &&
        donationRequest.dropOffTime !== ""
      ) {
        let createStatus = true;
        if (donationRequest.newDonationRequestItems.length > 0) 
          createStatus = handleCreateDonationRequest(donationRequest);
        const updateStatus = handleUpdateDonationRequest(donationRequest);

        console.log(updateStatus);
        if (createStatus && updateStatus) {
          navigate("/donation-requests");
        } else {
          setError(true);
        }
      }
    }
  };

  const handleCreateDonationRequest = (
    donationRequest: DonationRequestType
  ) => {
    axios
      .post(DONATION_REQUEST_ROUTES.CREATE, donationRequest)
      .then((resp) => {
        console.log(resp)
        if (resp.data.status === 200 && action === 'submit') {
          navigate("/");
        } else {
          return true;
        }
      })
      .catch((err) => {
        setError(true);
      });
    return false;
  };

  const handleUpdateDonationRequest = (
    donationRequest: DonationRequestType
  ) => {
    axios
      .put(DONATION_REQUEST_ROUTES.UPDATE, donationRequest)
      .then((resp) => {
        console.log(resp)
        if (resp.data.status === 200) return true;
      })
      .catch((err) => {
        console.error(err);
      });
    return false;
  };

  useEffect(() => {
    console.log(location.state);
    // should not be able to access this page through the url
    if (location.state === null) {
      navigate("/");
    } else {
      const formData = location.state.form;
      setDonationEventInfo(formData);
      setDonationRequest((prevDonationRequest) => ({
        ...prevDonationRequest,
        donationEventId: formData.id,
        donationRequestId: formData.donationRequestId || 0,
        dropOffDate: formData.dropOffDate || new Date(),
        dropOffTime: formData.dropOffTime || "",
        omitPoints: formData.omitPoints || false,
        oldDonationRequestItems: formData.donationRequestItems || [],
      }));
      // data structure receieved from previous pages are quite different so need to do data manipulation
      if (location.state.action === "edit") {
        setAction("edit");
        axios
          .get(
            DONATION_EVENT_ROUTES.RETRIEVE_BY_ID.replace(
              ":id",
              `/${formData.id}`
            )
          )
          .then((resp) => {
            const updatedDonationEventItems: donationEventItemsType[] = [];
            resp.data.data.donationEventItems.forEach(
              (donationEventItem: any) => {
                updatedDonationEventItems.push(donationEventItem);
              }
            );
            setItemsInfo(updatedDonationEventItems);
            handleCheckBoxItems(
              location.state.action,
              updatedDonationEventItems,
              formData.donationRequestItems
            );
          })
          .catch((err) => console.error(err));
      } else {
        setItemsInfo(formData.donationEventItems);
        handleCheckBoxItems(location.state.action, formData.donationEventItems);
      }
    }
  }, [location.state]);

  console.log(donationRequest);

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
        {isCheckBoxItemsLoaded && (
          <LabelledCheckBox
            label={checkBoxItems}
            onCheckBoxChange={handleCheckBoxChange}
            validateForm={validateForm}
          />
        )}
        {selectedItems.length >= 1 && (
          <>
            <Typography variant="h5" gutterBottom>
              2. Indicate the quantity to donate:
            </Typography>
            <ItemQuantityCard
              label={selectedItems}
              data={donationRequest.oldDonationRequestItems}
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
          data={{
            dropOffDate: donationRequest.dropOffDate,
            dropOffTime: donationRequest.dropOffTime,
          }}
          onDateTimeChange={handleDateTimeChange}
          validateForm={validateForm}
        />
        <LabelledCheckBox
          label={[
            {
              id: "omitPoints",
              name: "Receive Cashback Upon A Successful Donation",
              value:
                action === "edit"
                  ? !donationEventInfo.omitPoints ?? false
                  : false,
            },
          ]}
          onCheckBoxChange={handleCheckBoxChange}
        />
        {error && (
          <Alert severity="error">
            An error occurred while saving your donation request. Please refresh
            and try again.
          </Alert>
        )}
        <BasicButton
          label={`${action} Donation`}
          variant="contained"
          onButtonChange={handleButtonChange}
        />
        <BasicButton
          label="Cancel"
          variant="outlined"
          onButtonChange={(status: boolean) =>
            action === "submit" ? navigate("/") : navigate("/donation-requests")
          }
        />
      </Stack>
    </>
  ) : null;
}
