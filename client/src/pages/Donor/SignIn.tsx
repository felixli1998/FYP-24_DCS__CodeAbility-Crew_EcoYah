// React Imports
import { useState, useEffect } from "react";

// MUI Imports
import { Box, Alert, Stack, Button, Typography, Link } from "@mui/material";

// Components
import EcoYahLogo from "../../components/Card/EcoYahLogo";
import AuthTextFields from "../../components/TextFields/AuthTextFields";
import BasicButton from "../../components/Button/BasicButton";

// Other Imports
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { GENERAL_ROUTES } from "../../services/routes";
import axios from "axios";
import Cookies from 'js-cookie';

type signInDataType = {
  email: string;
  password: string;
};

export default function SignIn() {
  const [validateForm, setValidateForm] = useState<boolean>(false);
  const [currEmail, setCurrEmail] = useState<string>('');
  const [currPassword, setCurrPassword] = useState<string>('');
  const [emailExists, setEmailExists] = useState<boolean>(true);
  const [isPasswordCorrect, setIsPasswordCorrect] = useState<boolean>(true);
  const [signInData, setSignInData] = useState<signInDataType>({
    email: "",
    password: "",
  });
  const [signInError, setSignInError] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleButtonChange = (status: boolean) => {
    setValidateForm(status);

    if (signInData["email"] !== "" && signInData["password"] !== "") {
      axios
        .post(GENERAL_ROUTES.LOGIN, signInData)
        .then((resp) => {
          if (resp.data.data.action) {
            const token = resp.data.data.token;
            Cookies.set('token', token, { httpOnly: true });
            navigate("/");
          } else {
            if (resp.data.data.message === 'wrong_email') {
              setCurrEmail(signInData["email"]);
              setEmailExists(false);
            } else if (resp.data.data.message === 'wrong_credentials') {
              setCurrPassword(signInData["password"]);
              setIsPasswordCorrect(false);
            }
          }
        })
        .catch((err) => {
          setSignInError(true);
      });
    }
  };

  const handleData = (label: string, data: string) => {
    setSignInData((prevData) => ({ ...prevData, [label]: data }));
  };

  useEffect(() => {
    // reactively check if the updated email already exists
    if (validateForm && currEmail === signInData['email']) {
      setEmailExists(false);
    } else {
      setEmailExists(true);
    } 

    // reactively check if the updated password exists
    if (validateForm && currPassword === signInData['password']) {
      setIsPasswordCorrect(false);
    } else {
      setIsPasswordCorrect(true);
    }
  }, [signInData]);

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
        <Stack spacing={3}>
          {signInError && (
            <Alert severity="error">
              The request encountered an issue. Please refresh and try again!
            </Alert>
          )}
          <Typography variant="h5" align="center" gutterBottom>
            Welcome Back!
          </Typography>
          <hr></hr>
          <AuthTextFields
            label="Email"
            form="Sign In"
            validateForm={validateForm}
            data={handleData}
            error={emailExists}
          ></AuthTextFields>
          <AuthTextFields
            label="Password"
            form="Sign In"
            validateForm={validateForm}
            data={handleData}
            error={isPasswordCorrect}
          ></AuthTextFields>
          <Button
            disableRipple
            color="secondary"
            variant="text"
            sx={{
              justifyContent: "flex-end",
              "&:hover": { background: "none" },
            }}
          >
            <Typography
              sx={{ textDecoration: "underline" }}
              variant="caption"
              gutterBottom
            >
              Forgot Password?
            </Typography>
          </Button>
          <BasicButton
            label="Sign In"
            variant="contained"
            onButtonChange={handleButtonChange}
          />
        </Stack>
      </Box>
      <Typography sx={{ m: 2 }} align="center" variant="body2" gutterBottom>
        Don't Have An Account?&nbsp;
        <b>
          <Link color="primary.light" component={ReactRouterLink} to="/sign-up">
            Sign Up
          </Link>
        </b>
      </Typography>
    </>
  );
}
