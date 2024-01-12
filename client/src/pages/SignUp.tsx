import { useState } from "react";
import "../styles/App.css";
import { ThemeProvider } from '@mui/material';
import { theme } from '../styles/Palette';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextFields from "../components/TextFields"
import Typography from '@mui/material/Typography';
import Checkboxes from "../components/CheckBox"
import LongButtons from "../components/LongButton"


export default function SignUp() {

    const content: string[] = [ "At least 12 characters", "1 uppercase letter", "1 lowercase letter", "1 number", "1 symbol" ]

    const [validateForm, setValidateForm] = useState(false);

    const handleClickStatus = (status: boolean) => {
        setValidateForm(status);
    }

    const formData: { [k: string] : string} = {};

    const handleData = (type: string, data: string) => {
        console.log(type);
        console.log(data);
        formData[type] = data;
    }
    console.log(formData);
  
    return (
      <ThemeProvider theme={theme}>
        <Box
            component="form"
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              '& > :not(style)': { m: 2, p: 2, width: 400 }, boxShadow: 5, borderRadius: 2, 
            }}
            noValidate
            autoComplete="off"
          >
            <Stack spacing={2}>
              <Typography variant="h5" align="center" gutterBottom>Let's Get Started!</Typography>
              <hr></hr>
              <TextFields label="Email" type="email" validate={validateForm} data={handleData}></TextFields>
              <TextFields label="Name" type="name" validate={validateForm} data={handleData}></TextFields>
              <TextFields label="Contact Number" type="number" validate={validateForm} data={handleData}></TextFields>
              <TextFields label="Password" type="password" validate={validateForm} data={handleData}></TextFields>
              <Box sx={{ backgroundColor: "rgba(7, 83, 142, 0.25)", padding: 2, borderRadius: 2, width: 330 }}>
                <Typography variant="body2" gutterBottom><b>Your password must contain:</b></Typography>
                <Checkboxes type="password" label={content}></Checkboxes>
              </Box>
              <TextFields label="Confirm Password" type="confirm password" validate={validateForm} data={handleData}></TextFields>
              <LongButtons label="Sign Up" clickStatus={handleClickStatus}></LongButtons>
            </Stack>
        </Box>
      </ThemeProvider>
    );
  }

export {};