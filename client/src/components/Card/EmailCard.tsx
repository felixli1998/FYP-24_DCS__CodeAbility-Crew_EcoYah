import { useState } from 'react';
import { Stack, Typography, Box, IconButton } from '@mui/material';
import TextFields from '../TextFields/FormTextFields';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export default function EmailCard() {
  const [validateForm, setValidateForm] = useState(false);
  const [email, setEmail] = useState('');
  const [currEmail, setCurrEmail] = useState('');
  const [emailExists, setEmailExists] = useState(true);

  const handleData = (type: string, data: string) => {
    setEmail(data);
  };

  const handleClickStatus = () => {
    setValidateForm(true);
  };

  return (
    <Stack spacing={3}>
      <Typography variant='h5' align='center' gutterBottom>
        Email Verification
      </Typography>
      <Typography
        variant='subtitle1'
        color='secondary.light'
        align='center'
        gutterBottom
      >
        Enter your Registered Email
      </Typography>
      <TextFields
        label='Email'
        type='email'
        form='sign in'
        validate={validateForm}
        data={handleData}
        error={emailExists}
        current={currEmail}
      ></TextFields>
      <Box display='flex' justifyContent='flex-end'>
        <IconButton
          color='secondary'
          aria-label='chevron right'
          sx={{
            width: 40,
            '&:hover': { backgroundColor: '#008000' },
            backgroundColor: '#008000',
          }}
          onClick={handleClickStatus}
        >
          <ChevronRightIcon sx={{ color: 'white' }} />
        </IconButton>
      </Box>
    </Stack>
  );
}
