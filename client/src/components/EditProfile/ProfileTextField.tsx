// TextField.tsx
import React, { ChangeEvent } from 'react';
import { Box, TextField, Typography } from '@mui/material';

interface ProfileTextFieldProps {
  label: string;
  value: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
}

const ProfileTextField: React.FC<ProfileTextFieldProps> = ({
  label,
  value,
  onChange,
  disabled,
  error = false,
  helperText = '',
}) => (
  <Box
    sx={{
      marginY: '.5rem',
      width: '100%',
    }}
  >
    <Typography variant='body1' align='left' sx={{ fontWeight: 'bold' }}>
      {' '}
      {label}{' '}
    </Typography>
    <TextField
      sx={{ '.MuiFormHelperText-root': { marginLeft: '0' } }}
      id='outlined-basic'
      InputLabelProps={{ shrink: false }}
      variant='outlined'
      fullWidth
      value={value}
      disabled={disabled}
      onChange={onChange}
      error={error}
      helperText={helperText}
    />
  </Box>
);

export default ProfileTextField;
