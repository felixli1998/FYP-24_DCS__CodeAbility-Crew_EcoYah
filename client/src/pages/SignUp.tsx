import * as React from "react";
import "../styles/App.css";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextFields from "../components/TextFields"
import LongButtons from "../components/LongButtons"

export default function SignUp() {
  
    return (
      <Box
          component="form"
          sx={{
            '& > :not(style)': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <Stack spacing={2}>
            <TextFields label="Email" type="text"></TextFields>
            <TextFields label="Name" type="text"></TextFields>
            <TextFields label="Contact Number" type="text"></TextFields>
            <TextFields label="Password" type="password"></TextFields>
            <TextFields label="Confirm Password" type="password"></TextFields>
            <LongButtons label="Sign Up"></LongButtons>
          </Stack>
      </Box>
    );
  }

export {};