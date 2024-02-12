// React Imports
import { useState, useEffect } from 'react';

// MUI Imports
import { Box, Stack, Modal } from '@mui/material';

// Components
import StaffTypography from '../Typography/StaffTypography';

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
  onModalChange: (open: boolean) => void;
};

export default function BasicModal(props: BasicModalType) {
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
    <div>
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
              text={`John Doe's Donation`}
              type={'title'}
            />
            <StaffTypography
              size={1}
              text={`<b>Donation Event:</b> Do good for food`}
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
              text={`<b>Drop off Date:</b> 10/12/2024`}
              type={'title'}
              customStyles={{ fontWeight: 'none' }}
            />
            <StaffTypography
              size={1}
              text={`<b>Drop off Time:</b> 1:00 PM`}
              type={'title'}
              customStyles={{ fontWeight: 'none' }}
            />
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}
