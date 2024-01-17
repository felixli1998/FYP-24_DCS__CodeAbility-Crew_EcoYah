import { useState } from "react";
import "../styles/App.css";
import { Box, Alert, Stack, Typography, Link } from '@mui/material';
import logo from "../assets/EcoYah.png";
import TextFields from "../components/TextFields";
import Checkboxes from "../components/CheckBox";
import LongButtons from "../components/LongButton";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { makeHttpRequest } from "../utils/Utility";
import axios from "axios";

export default function SignIn() {

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

    const [validateForm, setValidateForm] = useState(false);
    const [emailExists, setEmailExists] = useState(true);
    const [isPasswordCorrect, setIsPasswordCorrect] = useState(true);
    const rmbSignIn: string[] = [ "Remember me" ];
    const [token, setToken] = useState(sessionStorage.getItem('token') || localStorage.getItem('token'));
    const [signInError, setSignInError] = useState(false);
    const [formData, setFormData] = useState<{ [key: string] : string }>({});
      
    const login = (token: string, rememberMe = false) => {
        if (rememberMe) {
          localStorage.setItem('token', token);
        } else {
          sessionStorage.setItem('token', token);
        }
        setToken(token);
    };

    const navigate = useNavigate();

    const handleClickStatus = async (status: boolean) => {
        setValidateForm(status);

        if (formData['email'] !== "" && formData['password'] !== "") {
            
            // POST user to verify credentials  
            try {
                const res = await makeHttpRequest('POST', BACKEND_URL + '/login', {
                email: formData['email'],
                password: formData['password']
                })
            } catch (error) {
                // if (axios.isAxiosError(error)) {
                // // Handle Axios errors
                // const statusCode = error.response?.status;
                // console.log(statusCode);
                // const statusText = error.response?.statusText;
                // if (statusCode === 200 && statusText === "Login successful") {
                //     navigate("/");
                // } else if (statusCode === 200 && statusText === "Email does not exist!") {
                //     setEmailExists(false);
                // } else if (statusCode === 200 && statusText === "Email or password is incorrect!") {
                //     setIsPasswordCorrect(false);
                // } else if (statusCode === 500) {
                //     setSignInError(true);
                // }
                    console.log("Error status code:", error);
                // } else {
                //     // Handle non-Axios errors
                //     console.log("Non-Axios error occurred:", error);
                // }   
            }
        }

    }

    const handleData = (type: string, data: string) => {
        setFormData((prevData) => ({...prevData, [type] : data}));
    }

    return (
        <>
            <Box 
                component="img" 
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ position: 'relative', m: 'auto', marginTop: 3, width: '10rem', height: '10rem', borderRadius: '50%', boxShadow: "0px 10px 10px 0px rgba(0, 0, 0, 0.25), 0 0 10px rgba(0, 0, 0, 0.2) inset" }}
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
                    { signInError && <Alert severity="error">The request encountered an issue. Please refresh and try again!</Alert> }
                    <Typography variant="h5" align="center" gutterBottom>Welcome Back!</Typography>
                    <hr></hr>
                    <TextFields label="Email" type="email" form="sign in" validate={validateForm} data={handleData} error={emailExists}></TextFields>
                    <TextFields label="Password" type="password" form="sign in" validate={validateForm} data={handleData} error={isPasswordCorrect}></TextFields>
                    <Typography sx={{textDecoration: 'underline'}} align="right" variant="caption" gutterBottom>Forgot Password?</Typography>
                    <Checkboxes label={rmbSignIn} type="sign up" text="none"></Checkboxes>
                    <LongButtons label="Sign Up" clickStatus={handleClickStatus}></LongButtons>
                </Stack> 
            </Box>
            <Typography sx={{ m: 2 }} align="center" variant="body2" gutterBottom>Don't Have An Account?&nbsp;
            <b><Link color="primary.light" component={ReactRouterLink} to="/sign-up">Sign Up</Link></b>
            </Typography>
        </>
    );
}