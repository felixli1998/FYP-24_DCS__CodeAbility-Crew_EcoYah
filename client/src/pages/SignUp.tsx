import { useState, useEffect } from "react";
import "../styles/App.css";
import { ThemeProvider } from '@mui/material';
import { theme } from '../styles/Palette';
import logo from "../assets/EcoYah.png";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextFields from "../components/TextFields"
import Typography from '@mui/material/Typography';
import Checkboxes from "../components/CheckBox"
import FormHelperText from '@mui/material/FormHelperText';
import LongButtons from "../components/LongButton"
import Link from '@mui/material/Link';


export default function SignUp() {

    const passwordCriteria: string[] = [ "At least 12 characters", "1 uppercase letter", "1 lowercase letter", "1 number", "1 symbol" ];
    const signUpCriteria: string[] = [ "By signing up, you agree to the Terms of Service and Privacy Policy." ];

    const [validateForm, setValidateForm] = useState(false);
    const [passwordText, setPasswordText] = useState("");
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [isPasswordSame, setIsPasswordSame] = useState(false);
    const [signUpError, setSignUpError] = useState(true);

    const handlePwdCriteria = (status: boolean) => {
        setIsPasswordValid(status);
    }

    const handleSignUpCriteria = (status: boolean) => {
        setSignUpError(status);
    }

    const handleClickStatus = (status: boolean) => {
        setValidateForm(status);
    }

    const [formData, setFormData] = useState<{ [key: string] : string }>({});

    const handleData = (type: string, data: string) => {
        // console.log(type);
        // console.log(data);
        setFormData((prevData) => ({...prevData, [type] : data}));

        if (type === 'password') {
          setPasswordText(data);
          // console.log(passwordText);
        }
    }
    // console.log(formData);

    useEffect(() => {
      if (formData['confirm password'] && passwordText === formData['confirm password']) {
        setIsPasswordSame(true);
      } else {
        setIsPasswordSame(false);
      }
    }, [formData, passwordText]);
    
    return (
      <ThemeProvider theme={theme}>
        <Box 
          component="img" 
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ position: 'relative', m: 'auto', width: '10rem', height: '10rem', borderRadius: '50%', boxShadow: "0px 10px 10px 0px rgba(0, 0, 0, 0.25), 0 0 10px rgba(0, 0, 0, 0.2) inset" }}
          alt="EcoYah"
          src={logo}>
        </Box>
        <Box
            component="form"
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ width: 420, m: "auto",
              '& > :not(style)': { m: 2, p: 2 }, boxShadow: 5, borderRadius: 2, 
            }}
            noValidate
            autoComplete="off"
          >
            <Stack spacing={3}>
              <Typography variant="h5" align="center" gutterBottom>Let's Get Started!</Typography>
              <hr></hr>
              <TextFields label="Email" type="email" validate={validateForm} data={handleData}></TextFields>
              <TextFields label="Name" type="name" validate={validateForm} data={handleData}></TextFields>
              <TextFields label="Contact Number" type="number" validate={validateForm} data={handleData}></TextFields>
              <TextFields label="Password" type="password" validate={validateForm} data={handleData} error={isPasswordValid}></TextFields>
              <Box sx={{ backgroundColor: "rgba(7, 83, 142, 0.25)", padding: 2, borderRadius: 2, width: 330 }}>
                <Typography variant="body2" gutterBottom><b>Your password must contain:</b></Typography>
                <Checkboxes type="password" label={passwordCriteria} text={passwordText} isValid={handlePwdCriteria}></Checkboxes>
              </Box>
              <TextFields label="Confirm Password" type="confirm password" validate={validateForm} data={handleData} error={isPasswordSame}></TextFields>
              <Checkboxes label={signUpCriteria} type="sign up" text="none" isValid={handleSignUpCriteria}></Checkboxes>
              { validateForm && !signUpError && <FormHelperText error>Please indicate that you have read</FormHelperText> }
              <LongButtons label="Sign Up" clickStatus={handleClickStatus}></LongButtons>
            </Stack>
        </Box>
        <Typography sx={{ m: 2 }} align="center" variant="body2" gutterBottom>Already Have An Account?&nbsp;
          <Link color="primary.light" href="#">Sign In</Link>
          </Typography>
      </ThemeProvider>
    );
}