// React Imports
import { useState, useEffect } from 'react';

// MUI Imports
import { Box, Stack, Modal } from '@mui/material';

// Components
import StaffTypography from '../Typography/StaffTypography';
import BasicButton from '../Button/BasicButton';

// Other Imports
import {
  DonationRequestType,
  DonationRequestItemsType,
} from '../../utils/Types';
import { DONATION_REQUEST_ROUTES } from "../../services/routes";
import axios from "axios";

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 1,
  boxShadow: 24,
  p: 4,
};

type BasicModalType = {
  open: boolean;
  data: DonationRequestType;
  onModalChange: (open: boolean) => void;
};

export default function BasicModal(props: BasicModalType) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    props.onModalChange(false);
  };

  const populateDonationItems = (
    donationRequestItems: DonationRequestItemsType[]
  ): string => {
    let result = '<ol>';
    donationRequestItems.forEach(
      (donationRequestItem: DonationRequestItemsType) => {
        result += `<li>${donationRequestItem.quantity} ${donationRequestItem.donationEventItem.item.unit} of ${donationRequestItem.donationEventItem.item.name}</li>`;
      }
    );
    result += '</ol>';

    return result;
  };

  const handleButtonChange = () => {
    axios
      .post(DONATION_REQUEST_ROUTES.UPDATE_STATUS, {
        id: props.data.id,
      })
      .then((resp) => {
        console.log(resp.data.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (props.open) handleOpen();
  }, [props.open]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Stack spacing={3}>
          <StaffTypography
            size={1.5}
            text={`${props.data.user.name}'s Donation`}
            type={"title"}
          />
          <StaffTypography
            size={1}
            text={`<b>Donation Event:</b> ${props.data.donationEvent.name}`}
            type={"title"}
            customStyles={{ fontWeight: "none" }}
          />
          <StaffTypography
            size={1}
            text={
              "<b>Donation Event Item(s):</b>" +
              populateDonationItems(props.data.donationRequestItems)
            }
            type={"title"}
            customStyles={{ fontWeight: "none" }}
          />
          <StaffTypography
            size={1}
            text={`<b>Drop off Date:</b> ${new Date(
              props.data.dropOffDate
            ).toLocaleDateString("en-GB")}`}
            type={"title"}
            customStyles={{ fontWeight: "none" }}
          />
          <StaffTypography
            size={1}
            text={`<b>Drop off Time:</b> ${props.data.dropOffTime}`}
            type={"title"}
            customStyles={{ fontWeight: "none" }}
          />
          <Box display="flex" justifyContent="space-between">
            <BasicButton
              variant="outlined"
              label={"Close"}
              customStyles={{
                fontSize: "1rem",
                letterSpacing: "0.12rem",
                width: "9.375rem",
                height: "3.75rem",
                color: "primary.dark",
                borderColor: "primary.dark",
              }}
              onButtonChange={handleClose}
            />
            <BasicButton
              variant="contained"
              label={"Complete"}
              customStyles={{
                fontSize: "1rem",
                letterSpacing: "0.12rem",
                width: "9.375rem",
                height: "3.75rem",
                backgroundColor: "primary.dark",
              }}
              onButtonChange={handleButtonChange}
            />
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
}
