import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface TerminateModalProps {
    handleConfirmTerminate: () => void;
};

const TerminateModal: React.FC<TerminateModalProps> = ({handleConfirmTerminate}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    // Handle termination logic here
    // ...
    handleConfirmTerminate();
    handleClose();
  };

  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60vw',
    bgcolor: 'white',
    borderRadius: '5px', // Adjust the border-radius for rounded corners
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Add shadow
    p: 3, // Adjust padding
    outline: 'none', // Remove default outline
  };

  return (
    <div>
      <Button 
        variant="outlined" 
        color="error"
        sx={{
          fontWeight: 'bold', // Make the font bold
          height: '3rem', // Adjust the height to make it thicker
        }}
        fullWidth
        onClick={handleOpen}>
        Terminate
      </Button>
      
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <Typography variant="h4" mb={"1rem"}>
            Woah, there!
        </Typography>
          <Typography id="modal-modal-title" variant="body1" component="h2" sx={{ mb: 2 }}>
            Once you delete your account, there's no going back. All your points will be gone.
            <br/>
            <br/> 
            Are you sure you want to terminate?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirm} color="error">
              Terminate
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default TerminateModal;
