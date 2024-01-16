import { useState } from "react";
import "../styles/App.css";
import { Box, Stack, Typography, Link } from '@mui/material';
import logo from "../assets/EcoYah.png";
import TextFields from "../components/TextFields";
import Checkboxes from "../components/CheckBox";
import LongButtons from "../components/LongButton";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";

export default function SignIn() {

    const [validateForm, setValidateForm] = useState(false);
    const rmbSignIn: string[] = [ "Remember me" ];
    const [token, setToken] = useState(sessionStorage.getItem('token') || localStorage.getItem('token'));
      
    const login = (token: string, rememberMe = false) => {
        if (rememberMe) {
          localStorage.setItem('token', token);
        } else {
          sessionStorage.setItem('token', token);
        }
        setToken(token);
    };

    const navigate = useNavigate();

    const handleClickStatus = (status: boolean) => {
        setValidateForm(status);

        // Write Logic to retrieve donor for verifying credentials
        // navigate("/");
    }

    const [formData, setFormData] = useState<{ [key: string] : string }>({});

    const handleData = (type: string, data: string) => {
        // console.log(type);
        // console.log(data);
        setFormData((prevData) => ({...prevData, [type] : data}));
    }
    // console.log(formData);

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
                    <Typography variant="h5" align="center" gutterBottom>Welcome Back!</Typography>
                    <hr></hr>
                    <TextFields label="Email" type="email" validate={validateForm} data={handleData}></TextFields>
                    <TextFields label="Password" type="password" validate={validateForm} data={handleData}></TextFields>
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