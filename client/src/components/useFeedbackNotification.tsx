import React, { useState } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { set } from 'lodash';

// ***********************************************************************************************************************************************//
// -- How do I use this? -- //
// 1. Import this component useFeedBackNotification
// 2. Destructure it
//  - const { displayNotification, FeedbackNotification } = useFeedbackNotification();
//  - displayNotification is a function that takes in 2 arguments: severity and message. Simply invoke it when you want to display a notification
//  - FeedbackNotification is a component that you can render anywhere in your code. It will display the notification
// 3. View EditProfile.tsx for an example of how to use this
// ***********************************************************************************************************************************************//

type FeedBackNotificationProps = {
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
  displayTime?: number;
};

export const useFeedbackNotification = () => {
  const [open, setOpen] = useState(false);
  const [notification, setNotification] = useState<FeedBackNotificationProps>({
    message: '',
    severity: 'info',
    displayTime: 5000,
  });

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    setOpen(false);
  };

  // TODO: Feel free to expand on this for more customizability (e.g. custom display time)
  const displayNotification = (
    severity: 'success' | 'info' | 'warning' | 'error',
    message: string
  ) => {
    setNotification({
      message,
      severity,
      displayTime: 5000,
    });
    setOpen(true);
  };

  const FeedbackNotification = () => {
    if (!open) return null;

    return (
      <Snackbar
        open={open}
        autoHideDuration={notification.displayTime}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        message={notification.message}
      >
        <Alert
          onClose={handleClose}
          severity={notification.severity}
          variant='filled'
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    );
  };

  return { displayNotification, FeedbackNotification };
};
