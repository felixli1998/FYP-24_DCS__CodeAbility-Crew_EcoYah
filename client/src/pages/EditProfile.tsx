import { useState } from "react";
import "../styles/App.css";
import { ThemeProvider } from '@mui/material';
import { theme } from '../styles/Palette';
import profilePic from "../assets/ProfilePicture.png";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextFields from "../components/TextFields"
import Typography from '@mui/material/Typography';
import Checkboxes from "../components/CheckBox"
import FormHelperText from '@mui/material/FormHelperText';
import LongSaveButtons from "../components/LongSaveButton"
import Link from '@mui/material/Link';


export default function SignUp() {

  const passwordCriteria: string[] = ["At least 12 characters", "1 uppercase letter", "1 lowercase letter", "1 number", "1 symbol"];
  const signUpCriteria: string[] = ["By signing up, you agree to the Terms of Service and Privacy Policy."];

  const [validateForm, setValidateForm] = useState(false);
  const [passwordText, setPasswordText] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isPasswordSame, setIsPasswordSame] = useState(false);
  const [signUpError, setSignUpError] = useState(true);

  const handleClickStatus = (status: boolean) => {
    setValidateForm(status);
  }

  const formData: { [key: string]: string } = {};

  const handleData = (type: string, data: string) => {
    // console.log(type);
    // console.log(data);
    formData[type] = data;
    if (formData['password']) {
      setPasswordText(formData['password']);
    }
    if (formData['password'] && formData['confirm password'] && formData['password'] === formData['confirm password']) {
      setIsPasswordSame(true);
    }
  }
  // console.log(formData);

  const handlePwdCriteria = (status: boolean) => {
    setIsPasswordValid(status);
  }

  const handleSignUpCriteria = (status: boolean) => {
    setSignUpError(status);
  }

  return (
    <ThemeProvider theme={theme}>

      <Box
        component="form"
        display="flex"
        justifyContent="center"
        alignItems="top"
        sx={{
          width: 420, height: "90vh", m: "auto",
          '& > :not(style)': { m: 2, p: 2 }, boxShadow: 5, borderRadius: 2,
          marginTop: "2rem",

        }}
        noValidate
        autoComplete="off"
      >

        <Stack spacing={3} justifyContent={"space-between"}>
          <Box>
            <Box
              sx = {{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "3rem",
              }}
            >
              <Box
                component="img"
                sx={
                  {
                    backgroundColor:"#E0E0E0",
                    position: 'relative', width: '7.5rem', height: '7.5rem',
                    borderRadius: '50%', boxShadow: "0px 10px 10px 0px rgba(0, 0, 0, 0.25), 0 0 10px rgba(0, 0, 0, 0.2) inset",
                    marginTop:"1rem", 
                  }
                }
                alt="profile picture"
                src={profilePic}>
              </Box>
              <Typography variant="h6" align="center" gutterBottom> Change Photo</Typography>
            </Box>

            {/* Name */}
            <Box
              sx={{
                marginY:"1rem"
              }}
            >
              <Typography variant="h6" align="left" > Name </Typography>
              <TextFields label="Name" type="name" validate={validateForm} data={handleData}></TextFields>
            </Box>

            {/* Contact  */}
            <Box
              sx={{
                marginY:"1rem"
              }}
            >
              <Typography variant="h6" align="left" > Contact </Typography>
              <TextFields label="Contact Number" type="number" validate={validateForm} data={handleData}></TextFields>
            </Box>

            {/* Email  */}
            <Box
              sx={{
                marginY:"1rem"
              }}
            >
              <Typography variant="h6" align="left" > Email </Typography>
              <TextFields label="Email" type="email" validate={validateForm} data={handleData}></TextFields>
            </Box>
          </Box>



          <LongSaveButtons label="Save changes" clickStatus={handleClickStatus}></LongSaveButtons>
        </Stack>
      </Box>
    </ThemeProvider>
  );
}