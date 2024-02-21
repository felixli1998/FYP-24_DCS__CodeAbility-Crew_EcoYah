// React Imports
import { useState, useEffect } from 'react';

// MUI Imports
import {
  Box,
  Alert,
  Stack,
  Typography,
  FormHelperText,
  Link,
} from '@mui/material';

// Components
import EcoYahLogo from '../../components/Card/EcoYahLogo';
import AuthTextFields from "../../components/TextFields/AuthTextFields";
import Checkboxes from '../../components/Checkbox/FormCheckBox';
import BasicButton from '../../components/Button/BasicButton';
import SuccessCard from '../../components/Card/SuccessCard';

// Other Imports
import { Link as ReactRouterLink } from 'react-router-dom';
import { USER_ROUTES } from '../../services/routes';
import axios from 'axios';

type signUpDataType = {
  email: string;
  name: string;
  number: number;
  password: string;
  confirm_password: string;
};

type CheckboxType = {
  id: number, 
  label: string, 
  value: boolean
}

export default function SignUp() {

  const passwordCriteria: CheckboxType[] = [
    { id: 0, label: 'At least 12 characters', value: false },
    { id: 1, label: '1 uppercase letter', value: false },
    { id: 2, label: '1 lowercase letter', value: false },
    { id: 3, label: '1 number', value: false },
    { id: 4, label: '1 symbol', value: false }
  ];
  const signUpCriteria: CheckboxType[] = [
    { id: 0, label: 'By signing up, you agree to the Terms of Service and Privacy Policy.', value: false }
  ];

  const [step, setStep] = useState(1);
  const [validateForm, setValidateForm] = useState(false);
  const [dupEmail, setDupEmail] = useState<string>("");
  const [emailExists, setEmailExists] = useState(false);
  const [passwordText, setPasswordText] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isPasswordSame, setIsPasswordSame] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [signUpError, setSignUpError] = useState<boolean>(false);
  const [signUpData, setSignUpData] = useState<signUpDataType>({
    email: "",
    name: "",
    number: 0,
    password: "",
    confirm_password: "",
  });

  const handlePwdCriteria = (status: boolean) => {
    setIsPasswordValid(status);
  };

  const handleSignUpCriteria = (status: boolean) => {
    setIsChecked(status);
  };

  const handleButtonChange = async (status: boolean) => {
    setValidateForm(status);

    // if (isPasswordValid && isPasswordSame && isChecked) {
    //   try {
    //     const res = await makeHttpRequest('POST', USER_ROUTES.CREATE_USER, {
    //       email: signUpData['email'],
    //       name: signUpData['name'],
    //       contactNum: signUpData['number'],
    //       passwordDigest: signUpData['password'],
    //     });
    //     localStorage.setItem('ecoyah-email', signUpData['email']);
    //     setStep(2);
    //   } catch (error) {
    //     if (axios.isAxiosError(error)) {
    //       // Handle Axios errors
    //       const statusCode = error.response?.status;
    //       if (statusCode === 409) {
    //         setEmailExists(true);
    //         setDupEmail(setSignUpData['email']);
    //       } else if (statusCode === 400) {
    //         setSignUpError(true);
    //       }
    //       console.log('Error status code:', statusCode);
    //     } else {
    //       // Handle non-Axios errors
    //       console.log('Non-Axios error occurred:', error);
    //     }
    //   }
    // }
  };

  const handleData = (type: string, data: string) => {
    setSignUpData((prevData) => ({ ...prevData, [type]: data }));

    if (type === "password") {
      setPasswordText(data);
    }
  };

  useEffect(() => {
    if (
      signUpData["confirm_password"] &&
      passwordText === signUpData["confirm_password"]
    ) {
      setIsPasswordSame(true);
    } else {
      setIsPasswordSame(false);
    }

    if (validateForm && dupEmail === signUpData["email"]) {
      setEmailExists(true);
    } else {
      setEmailExists(false);
    }
  }, [signUpData, passwordText]);

  return (
    <>
      <EcoYahLogo/>
      <Box
        component="form"
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          width: 420,
          m: "auto",
          "& > :not(style)": { m: 2, p: 2 },
          boxShadow: 5,
          borderRadius: 2,
        }}
        noValidate
        autoComplete="off"
      >
        {step === 1 ? (
          <Stack spacing={3}>
            {signUpError && (
              <Alert severity="error">
                The request encountered an issue. Please refresh and try again!
              </Alert>
            )}
            <Typography variant="h5" align="center" gutterBottom>
              Let's Get Started!
            </Typography>
            <hr></hr>
            <AuthTextFields
              label="Email"
              form="Sign Up"
              validateForm={validateForm}
              data={handleData}
            ></AuthTextFields>
            <AuthTextFields
              label="Name"
              form="Sign Up"
              validateForm={validateForm}
              data={handleData}
            ></AuthTextFields>
            <AuthTextFields
              label="Contact Number"
              form="Sign Up"
              validateForm={validateForm}
              data={handleData}
            ></AuthTextFields>
            <AuthTextFields
              label="Password"
              form="Sign Up"
              validateForm={validateForm}
              data={handleData}
            ></AuthTextFields>
            <Box
              sx={{
                backgroundColor: "rgba(7, 83, 142, 0.25)",
                padding: 2,
                borderRadius: 2,
                width: 330,
              }}
            >
              <Typography variant="body2" gutterBottom>
                <b>Your password must contain:</b>
              </Typography>
              {/* <Checkboxes
                type="password"
                label={passwordCriteria}
                text={passwordText}
                isChecked={handlePwdCriteria}
              ></Checkboxes> */}
            </Box>
            <AuthTextFields
              label="Confirm Password"
              form="Sign Up"
              validateForm={validateForm}
              data={handleData}
            ></AuthTextFields>
            {/* <Checkboxes
              label={signUpCriteria}
              type="sign up"
              text="none"
              isChecked={handleSignUpCriteria}
            ></Checkboxes> */}
            {validateForm && !isChecked && (
              <FormHelperText error>
                Please indicate that you have read
              </FormHelperText>
            )}
            <BasicButton
              label="Sign Up"
              variant="contained"
              onButtonChange={handleButtonChange}
            />
          </Stack>
        ) : (
          <SuccessCard type="sign up" />
        )}
      </Box>
      {step === 1 ? (
        <Typography sx={{ m: 2 }} align="center" variant="body2" gutterBottom>
          Already Have An Account?&nbsp;
          <b>
            <Link
              color="primary.light"
              component={ReactRouterLink}
              to="/sign-in"
            >
              Sign In
            </Link>
          </b>
        </Typography>
      ) : (
        <Typography sx={{ m: 2 }} align="center" variant="body2" gutterBottom>
          <b>
            <Link color="primary.light" component={ReactRouterLink} to="/">
              Go to Home
            </Link>
          </b>
        </Typography>
      )}
    </>
  );
}
