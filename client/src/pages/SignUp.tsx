import { useState, useEffect } from "react";
import "../styles/App.css";
import { Box, Alert, Stack, Typography, FormHelperText, Link } from '@mui/material';
import TextFields from "../components/TextFields";
import Checkboxes from "../components/CheckBox";
import LongButtons from "../components/LongButton";
import SuccessCard from "../components/SuccessCard";
import { Link as ReactRouterLink } from "react-router-dom";
import { makeHttpRequest } from "../utils/Utility";
import axios from "axios";
import AccountModuleContainer from "../components/AccountModuleContainer";

export default function SignUp() {

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

    const passwordCriteria: string[] = [ "At least 12 characters", "1 uppercase letter", "1 lowercase letter", "1 number", "1 symbol" ];
    const signUpCriteria: string[] = [ "By signing up, you agree to the Terms of Service and Privacy Policy." ];

    const [step, setStep] = useState(1);
    const [validateForm, setValidateForm] = useState(false);
    const [dupEmail, setDupEmail] = useState("");
    const [emailExists, setEmailExists] = useState(false);
    const [passwordText, setPasswordText] = useState("");
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [isPasswordSame, setIsPasswordSame] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [signUpError, setSignUpError] = useState(false);
    const [formData, setFormData] = useState<{ [key: string] : string }>({});

    const handlePwdCriteria = (status: boolean) => {
        setIsPasswordValid(status);
    }

    const handleSignUpCriteria = (status: boolean) => {
        setIsChecked(status);
    }

    const handleClickStatus = async (status: boolean) => {
        setValidateForm(status);

        if (isPasswordValid && isPasswordSame && isChecked) {
          
          // POST user to database 
          try {
            const res = await makeHttpRequest('POST', BACKEND_URL + '/users', {
              email: formData['email'],
              name: formData['name'],
              contactNum: formData['number'],
              passwordDigest: formData['password']
            })
            localStorage.setItem("ecoyah-email", formData['email']); 
            setStep(2);
          } catch (error) {
              if (axios.isAxiosError(error)) {
                // Handle Axios errors
                const statusCode = error.response?.status;
                if (statusCode === 409) {
                  setEmailExists(true);
                  setDupEmail(formData['email']);
                } else if (statusCode === 400) {
                  setSignUpError(true);
                }
                console.log("Error status code:", statusCode);
            } else {
                // Handle non-Axios errors
                console.log("Non-Axios error occurred:", error);
            }   
          }
        }
      }

    const handleData = (type: string, data: string) => {
        setFormData((prevData) => ({...prevData, [type] : data}));

        if (type === 'password') {
          setPasswordText(data);
        }
    }

    useEffect(() => {
      if (formData['confirm password'] && passwordText === formData['confirm password']) {
        setIsPasswordSame(true);
      } else {
        setIsPasswordSame(false);
      }

      if (validateForm && (dupEmail === formData['email'])) {
        setEmailExists(true);
      } else {
        setEmailExists(false);
      }
    }, [formData, passwordText]);
    
    return (
      <>
        <AccountModuleContainer>
            { step === 1 ?
            <Stack spacing={3}>
              { signUpError && <Alert severity="error">The request encountered an issue. Please refresh and try again!</Alert> }
              <Typography variant="h5" align="center" gutterBottom>Let's Get Started!</Typography>
              <hr></hr>
              <TextFields label="Email" type="email" form="sign up" validate={validateForm} data={handleData} error={emailExists}></TextFields>
              <TextFields label="Name" type="name" validate={validateForm} data={handleData}></TextFields>
              <TextFields label="Contact Number" type="number" validate={validateForm} data={handleData}></TextFields>
              <TextFields label="Password" type="password" form="sign up" validate={validateForm} data={handleData} error={isPasswordValid}></TextFields>
              <Box sx={{ backgroundColor: "rgba(7, 83, 142, 0.25)", padding: 2, borderRadius: 2, width: 330 }}>
                <Typography variant="body2" gutterBottom><b>Your password must contain:</b></Typography>
                <Checkboxes type="password" label={passwordCriteria} text={passwordText} isChecked={handlePwdCriteria}></Checkboxes>
              </Box>
              <TextFields label="Confirm Password" type="confirm password" validate={validateForm} data={handleData} error={isPasswordSame}></TextFields>
              <Checkboxes label={signUpCriteria} type="sign up" text="none" isChecked={handleSignUpCriteria}></Checkboxes>
              { validateForm && !isChecked && <FormHelperText error>Please indicate that you have read</FormHelperText> }
              <LongButtons label="Sign Up" clickStatus={handleClickStatus}></LongButtons>
            </Stack> :
            <SuccessCard type="sign up"/> }
        </AccountModuleContainer>
        { step === 1 ? 
        <Typography sx={{ m: 2 }} align="center" variant="body2" gutterBottom>Already Have An Account?&nbsp;
          <b><Link color="primary.light" component={ReactRouterLink} to="/sign-in">Sign In</Link></b>
        </Typography> : <Typography sx={{ m: 2 }} align="center" variant="body2" gutterBottom><b><Link color="primary.light" component={ReactRouterLink} to="/">Go to Home</Link></b></Typography> }
      </>
    );
}