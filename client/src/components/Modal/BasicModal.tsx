// React Imports
import { useState, useEffect } from 'react';

// MUI Imports
import { Box, Stack, Modal } from '@mui/material';

// Components
import StaffTypography from '../Typography/StaffTypography';

// Other Imports
import { DonationRequestType } from '../../utils/Types';

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

type BasicModalType = {
  open: boolean;
  data: DonationRequestType;
  onModalChange: (open: boolean) => void;
};

export default function BasicModal(props: BasicModalType) {
    console.log(props.data);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
      setOpen(false);
      props.onModalChange(false);
    };

    useEffect(() => {
      if (props.open) handleOpen();
    }, [props.open]);

    return (
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={modalStyle}>
          <Stack spacing={3}>
            <StaffTypography
              size={1.5}
              text={`${props.data.user.name}'s Donation`}
              type={'title'}
            />
            <StaffTypography
              size={1}
              text={`<b>Donation Event:</b>`}
              type={'title'}
              customStyles={{ fontWeight: 'none' }}
            />
            <StaffTypography
              size={1}
              text={`<b>Donation Item(s):</b>
              <ol>
                <li>1 kilogram of cabbage</li>
                <li>1 kilogram of Broccoli</li>
              </ol>
              `}
              type={'title'}
              customStyles={{ fontWeight: 'none' }}
            />
            <StaffTypography
              size={1}
              text={`<b>Drop off Date:</b> ${new Date(props.data.dropOffDate).toLocaleDateString("en-GB")}`}
              type={'title'}
              customStyles={{ fontWeight: 'none' }}
            />
            <StaffTypography
              size={1}
              text={`<b>Drop off Time:</b> ${props.data.dropOffTime}`}
              type={'title'}
              customStyles={{ fontWeight: 'none' }}
            />
          </Stack>
        </Box>
      </Modal>
    );
}
