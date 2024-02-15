import * as React from 'react';
import { Stack, Box, Typography } from '@mui/material';
import AccountCreation from '../assets/AccountCreation.svg';

type SuccessCardProps = {
    type: string
}

export default function SuccessCard(props: SuccessCardProps) {

  return (
    <Stack spacing={3}>
        <Box
          component="img"
          alt="Account Creation"
          sx={{ width: 500, height: 400, margin: "auto" }}
          src={AccountCreation}>
        </Box>
        <Typography variant="h5" color="primary" align="center" gutterBottom><b>Account Successfully Created!</b></Typography>
    </Stack>
  );
}