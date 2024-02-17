// React Imports
import { useState, useEffect } from 'react';

// MUI Imports
import { Stack, Alert } from "@mui/material";

// Components
import StaffTypography from "../../components/Typography/StaffTypography";
import DatePicker from "../../components/DateTimePicker/DatePicker";
import ItemList from "../../components/List/List";

// Other Imports
import dayjs, { Dayjs } from "dayjs";
import { DonationRequestType } from "../../utils/Types";
import { DONATION_REQUEST_ROUTES } from "../../services/routes";
import axios from "axios";

export default function DonationRequests() {
  const [donationRequests, setDonationRequests] = useState<
    DonationRequestType[]
  >([]);
  const [error, setError] = useState<boolean>(false);

  const handleDateChange = (date: Dayjs | null) => {
    if (date !== null) handleData(date);
  };

  const handleData = (date: Dayjs | Date) => {
    axios
      .get(DONATION_REQUEST_ROUTES.RETRIEVE_ACTIVE_BY_DATE, {
        params: {
          date: dayjs(date).format("YYYY/MM/DD"),
        },
      })
      .then((resp) => {
        if (resp.data.status === 200) setDonationRequests(resp.data.data);
      })
      .catch((err) => {
        setError(true);
      });
  };

  const handleRemoveRequest = (requestId: number) => {
    const updatedDonationRequests = donationRequests.filter(
      (request: DonationRequestType) => request.id !== requestId
    );
    setDonationRequests(updatedDonationRequests);
  };

  useEffect(() => {
    handleData(new Date());
  }, []);

  return (
    <Stack spacing={5} sx={{ margin: { xs: "2rem 2rem", md: "2rem 4rem" } }}>
      <StaffTypography
        type="title"
        size={2.5}
        text={"Active Donation Requests"}
      ></StaffTypography>
      <DatePicker
        label={"Date"}
        defaultValue={new Date()}
        onDateChange={handleDateChange}
      ></DatePicker>
      {!error ? (
        <ItemList
          data={donationRequests}
          onRemoveRequest={handleRemoveRequest}
        ></ItemList>
      ) : (
        <Alert severity="error">
          An error occurred while fetching active donation requests. Please
          refresh and try again.
        </Alert>
      )}
    </Stack>
  );
}
