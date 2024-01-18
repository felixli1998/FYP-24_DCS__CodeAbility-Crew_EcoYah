// TextField.tsx
import React, { ChangeEvent } from 'react';
import {Box, TextField, Typography} from "@mui/material";

interface ProfileTextFieldProps {
  label: string;
  value: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const ProfileTextField: React.FC<ProfileTextFieldProps> = ({ label, value, onChange, disabled }) => (
  <Box
    sx={{
      marginY: ".5rem",
      width: "100%",
    }}
  >
    <Typography variant="body1" align="left" sx={{ fontWeight: "bold" }}> {label} </Typography>
    <TextField
      id="outlined-basic"
      InputLabelProps={{ shrink: false }}
      variant="outlined"
      fullWidth
      defaultValue={value}
      disabled={disabled}
      onChange={onChange}
    />
  </Box>
);

export default ProfileTextField;
