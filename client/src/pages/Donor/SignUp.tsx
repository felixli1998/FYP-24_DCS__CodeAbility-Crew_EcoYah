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
import LabelledCheckBox from "../../components/Checkbox/LabelledCheckBox";
import BasicButton from "../../components/Button/BasicButton";
import SuccessCard from "../../components/Card/SuccessCard";

// Other Imports
import { validatePassword } from "../../utils/Common";
import { Link as ReactRouterLink } from "react-router-dom";
import { USER_ROUTES } from "../../services/routes";
import axios from "axios";

type signUpDataType = {
  email: string;
  name: string;
  "contact number": number;
  password: string;
  "confirm password": string;
};

type CheckboxType = {
  id: string | number;
  name: string;
  value: boolean;
};

export default function SignUp() {
  const [passwordCriteria, setPasswordCriteria] = useState<CheckboxType[]>([
    { id: 0, name: "At least 12 characters", value: false },
    { id: 1, name: "1 uppercase letter", value: false },
    { id: 2, name: "1 lowercase letter", value: false },
    { id: 3, name: "1 number", value: false },
    { id: 4, name: "1 symbol", value: false },
  ]);
  const signUpCriteria: CheckboxType[] = [
    {
      id: "sign_up_check",
      name: "By signing up, you agree to the Terms of Service and Privacy Policy.",
      value: false,
    },
  ];

  const [step, setStep] = useState<number>(1); // 1: sign up page, 2: success page
  const [validateForm, setValidateForm] = useState<boolean>(false);
  const [currEmail, setCurrEmail] = useState<string>('');
  const [emailExists, setEmailExists] = useState<boolean>(false);
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);
  const [isPasswordSame, setIsPasswordSame] = useState<boolean>(false);
  const [isSignUpChecked, setIsSignUpChecked] = useState<boolean>(false);
  const [signUpData, setSignUpData] = useState<signUpDataType>({
    email: "",
    name: "",
    "contact number": 0,
    password: "",
    "confirm password": "",
  });
  const [signUpError, setSignUpError] = useState<boolean>(false);

  const handleCheckBoxChange = (
    updatedCheckedState: Record<string, boolean>
  ) => {
    if ("sign_up_check" in updatedCheckedState) {
      setIsSignUpChecked(updatedCheckedState["sign_up_check"]);
    }
  };

  const handleData = (label: string, data: string) => {
    setSignUpData((prevData) => ({ ...prevData, [label]: data }));

    // update Checkbox state
    if (label === "password") {
      setPasswordCriteria((prevData) =>
        prevData.map((criteria, i) => ({
          ...criteria,
          value: validatePassword(i, data),
        }))
      );
    }
  };

  const handleButtonChange = (status: boolean) => {
    setValidateForm(status);

    const isSignUpDataValid = Object.values(signUpData).every(
      (value) => value !== "" && value !== 0
    );

    if (isSignUpDataValid && isSignUpChecked) {
      axios
        .post(USER_ROUTES.CREATE_USER, {
          email: signUpData["email"],
          name: signUpData["name"],
          contactNum: signUpData["contact number"],
          password: signUpData["password"],
        })
        .then((resp) => {
          if (resp.data.status === 201) setStep(2);
        })
        .catch((err) => {
          const statusCode = err.response?.status;
          if (statusCode === 409) {
            setCurrEmail(signUpData["email"]);
            setEmailExists(true);
          } else {
            setSignUpError(true);
          }
      });
    }
  };

  useEffect(() => {
    // check if all password criteria are true
    const allCriteriaValid = passwordCriteria.every(
      (criteria) => criteria.value
    );
    setIsPasswordValid(allCriteriaValid);

    // check if password and confirm password are the same
    if (signUpData["password"] && signUpData["confirm password"]) {
      if (signUpData["password"] === signUpData["confirm password"]) {
        setIsPasswordSame(true);
      } else {
        setIsPasswordSame(false);
      }
    }

    // reactively check if the updated email exists
    if (validateForm && currEmail === signUpData['email']) {
      setEmailExists(true);
    } else {
      setEmailExists(false);
    } 
  }, [passwordCriteria, signUpData]);

  return (
    <>
      <EcoYahLogo />
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
              error={emailExists}
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
              error={isPasswordValid}
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
              <LabelledCheckBox
                label={passwordCriteria}
                disableCheckbox={true}
                externalCheckbox={true}
                onCheckBoxChange={handleCheckBoxChange}
              ></LabelledCheckBox>
            </Box>
            <AuthTextFields
              label="Confirm Password"
              form="Sign Up"
              validateForm={validateForm}
              data={handleData}
              error={isPasswordSame}
            ></AuthTextFields>
            <LabelledCheckBox
              label={signUpCriteria}
              disableCheckbox={false}
              externalCheckbox={false}
              onCheckBoxChange={handleCheckBoxChange}
            ></LabelledCheckBox>
            {validateForm && !isSignUpChecked && (
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
