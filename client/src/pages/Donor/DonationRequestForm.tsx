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
import {
  DONATION_EVENT_ROUTES,
  DONATION_REQUEST_ROUTES,
  DONATION_REQUEST_ITEMS_ROUTES,
} from "../../services/routes";
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
    submittedBy: 0,
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
    const updatedCheckBoxItems: CheckBoxItemsType[] = [];
    donationEventItems.forEach(donationEventItem => {
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

  const handleCheckBoxChange = (
    updatedCheckedState: Record<string, boolean>
  ) => {
    if ("omitPoints" in updatedCheckedState) {
      setDonationRequest((prevData) => ({
        ...prevData,
        omitPoints: !updatedCheckedState.omitPoints,
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

  const handleItemQuantityChange = (
    updatedItemQuantity: Record<number, Record<string, number | string>>
  ) => {
    const donationRequestItems: Record<string, number>[] = [];
    _.mapValues(updatedItemQuantity, function (value, key) {
      if (donationRequest.oldDonationRequestItems) {
        const existingItem = donationRequest.oldDonationRequestItems.find(
          (item: any) => item.donationEventItem.id === Number(key)
        );

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
    if (dateTime !== null) { // TODO: don't need to store a time attribute in db
      const formattedTime = dayjs(dateTime).format('HH:mm');
      setDonationRequest((prevData) => ({
        ...prevData,
        dropOffDate: dateTime.toDate(),
        dropOffTime: formattedTime,
      }));
    }
  };

  const handleButtonChange = (status: boolean) => {
    setValidateForm(true);

    if (action === "submit") {
      if (
        donationRequest.donationEventId !== 0 &&
        donationRequest.submittedBy !== 0 &&
        donationRequest.dropOffTime !== "" &&
        donationRequest.newDonationRequestItems.length > 0
      ) {
        handleCreateDonationRequest(donationRequest)
        .then((createStatus) => {
          if (createStatus) {
            navigate("/");
          } else {
            setError(true);
          }
        })
        .catch(() => {
          setError(true);
        });
      }
    } else {
      if (
        donationRequest.donationEventId !== 0 &&
        donationRequest.donationRequestId !== 0 &&
        donationRequest.submittedBy !== 0 &&
        donationRequest.dropOffTime !== "00:00"
      ) {

        const deleteDonationRequestItemIds: number[] = [];
        donationRequest.oldDonationRequestItems?.forEach(
          (donationRequestItem: any) => {
            const foundItem = selectedItems.some(
              (selectedItem) =>
                selectedItem.id === donationRequestItem.donationEventItem.id
            );

            if (!foundItem) {
              deleteDonationRequestItemIds.push(donationRequestItem.id);
            }
          }
        );
        
        if (
          deleteDonationRequestItemIds.length !==
          donationRequest.oldDonationRequestItems?.length ||
          donationRequest.newDonationRequestItems.length >= 1
        ) {
          Promise.all([
            handleDeleteDonationRequestItem(deleteDonationRequestItemIds),
            handleCreateDonationRequest(donationRequest),
            handleUpdateDonationRequest(donationRequest),
          ])
            .then(([deleteStatus, createStatus, updateStatus]) => {
              if (
                deleteStatus.every((status) => status) &&
                createStatus &&
                updateStatus
              ) {
                navigate("/donation-requests");
              } else {
                setError(true);
              }
            })
            .catch(() => {
              setError(true);
            });
        }
      }
    }
  };

  const handleCreateDonationRequest = (
    donationRequest: DonationRequestType
  ): Promise<boolean> => {
    return axios
      .post(DONATION_REQUEST_ROUTES.CREATE, donationRequest)
      .then((resp) => {
        if (resp.data.status === 200) return true;
        else return false;
      })
      .catch((err) => {
        console.error(err);
        throw err;
      });
  };

  const handleUpdateDonationRequest = (
    donationRequest: DonationRequestType
  ): Promise<boolean> => {
    return axios
      .put(DONATION_REQUEST_ROUTES.UPDATE, donationRequest)
      .then((resp) => {
        if (resp.data.status === 200) return true;
        else return false;
      })
      .catch((err) => {
        console.error(err);
        throw err;
      });
  };

  const handleDeleteDonationRequestItem = (
    donationRequestItemIds: number[]
  ): Promise<boolean[]> => {
    const deletePromises: Promise<boolean>[] = donationRequestItemIds.map(
      (id) => {
        return axios
          .delete(DONATION_REQUEST_ITEMS_ROUTES.DELETE, {
            data: {
              "donationRequestItemId": id
            }
          })
          .then((resp) => {
            return resp.data.status === 200;
          })
          .catch((err) => {
            console.error(err);
            throw err;
          });
      }
    );

    return Promise.all(deletePromises);
  };

  useEffect(() => {
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
        submittedBy: Number(localStorage.getItem("ecoyah-id")) || 0,
        oldDonationRequestItems: formData.donationRequestItems || [],
      }));
      // data structure receieved from previous pages are quite different so need to do data manipulation
      if (location.state.action === "edit") {
        setAction("edit");
        axios
          .get(
            DONATION_EVENT_ROUTES.BY_ID.replace(
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
                  ? !donationRequest.omitPoints
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
