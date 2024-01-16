import { useState, useEffect } from "react";
import "../styles/App.css";
import { ThemeProvider } from '@mui/material';
import { theme } from '../styles/Palette';
import { Box, Stack, Typography, FormHelperText, Link } from '@mui/material';
import logo from "../assets/EcoYah.png";
import TextFields from "../components/TextFields"
import Checkboxes from "../components/CheckBox"
import LongButtons from "../components/LongButton"
import SuccessCard from "../components/SuccessCard";
import { makeHttpRequest } from "../utils/Utility";

export default function SignUp() {

    const passwordCriteria: string[] = [ "At least 12 characters", "1 uppercase letter", "1 lowercase letter", "1 number", "1 symbol" ];
    const signUpCriteria: string[] = [ "By signing up, you agree to the Terms of Service and Privacy Policy." ];

    const [step, setStep] = useState(1);
    const [validateForm, setValidateForm] = useState(false);
    const [passwordText, setPasswordText] = useState("");
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [isPasswordSame, setIsPasswordSame] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    const handlePwdCriteria = (status: boolean) => {
        setIsPasswordValid(status);
    }

    const handleSignUpCriteria = (status: boolean) => {
        setIsChecked(status);
    }

    const handleClickStatus = (status: boolean) => {
        setValidateForm(status);

        if (isPasswordValid && isPasswordSame && isChecked) {
          // Sign up function here
          // makeHttpRequest('POST', '/api/user/signup', formData)
          setStep(2);

        }
    }

    const 

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
            { step === 1 ?
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
              { validateForm && !isChecked && <FormHelperText error>Please indicate that you have read</FormHelperText> }
              <LongButtons label="Sign Up" clickStatus={handleClickStatus}></LongButtons>
            </Stack> :
            <SuccessCard type="sign up"/> }
        </Box>
        { step === 1 ? 
        <Typography sx={{ m: 2 }} align="center" variant="body2" gutterBottom>Already Have An Account?&nbsp;
          <b><Link color="primary.light" href="#">Sign In</Link></b>
        </Typography> : <Typography sx={{ m: 2 }} align="center" variant="body2" gutterBottom><b><Link color="primary.light" href="#">Go to Home</Link></b></Typography> }
      </ThemeProvider>
    );
}