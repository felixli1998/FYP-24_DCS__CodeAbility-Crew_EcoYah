import { useState, useEffect } from "react";
import "../styles/App.css";
import { Alert, Stack, Button, Typography, Link } from '@mui/material';
import TextFields from "../components/TextFields";
import Checkboxes from "../components/CheckBox";
import LongButtons from "../components/LongButton";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { makeHttpRequest } from "../utils/Utility";
import AccountModuleContainer from "../components/AccountModuleContainer";

export default function SignIn() {

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

    const rmbSignIn: string[] = [ "Remember Me" ];
    const [validateForm, setValidateForm] = useState(false);
    const [currEmail, setCurrEmail] = useState(localStorage.getItem("ecoyah-email") || "");
    const [currPassword, setCurrPassword] = useState(localStorage.getItem("ecoyah-password") || "");
    const [emailExists, setEmailExists] = useState(true);
    const [isPasswordCorrect, setIsPasswordCorrect] = useState(true);
    const [rmbMe, setRmbMe] = useState(false);
    const [signInError, setSignInError] = useState(false);
    const [formData, setFormData] = useState<{ [key: string] : string }>({});
    
    const handleRmbMe = (status: boolean) => {
        setRmbMe(status);
        handleLocalStorage();
    }
    // console.log(rmbMe);

    const handleLocalStorage = () => {
        if (rmbMe) {
            localStorage.setItem("ecoyah-email", formData['email']); 
            localStorage.setItem("ecoyah-password", formData['password']);
        } else {
            localStorage.removeItem("ecoyah-email"); 
            localStorage.removeItem("ecoyah-password");
        }
    }

    const navigate = useNavigate();

    const handleClickStatus = async (status: boolean) => {
        setValidateForm(status);

        if (formData['email'] !== "" && formData['password'] !== "") {
            
            // POST user to verify credentials  
            try {
                const res: any = await makeHttpRequest('POST', BACKEND_URL + '/login', {
                    email: formData['email'],
                    password: formData['password']
                })
                // console.log(res);

                if (res.data.action) {
                    // Login successful
                    localStorage.setItem("ecoyah-email", formData['email']); 
                    navigate("/");
                } else {
                    // Login failed, handle specific cases
                    if (res.data.message === "wrong_email") {
                        setCurrEmail(formData['email']);
                        setEmailExists(false);
                    } else if (res.data.message === "wrong_credentials") {
                        setCurrPassword(formData['password']);
                        setIsPasswordCorrect(false);
                    }
                }
            } catch (error) {
                // Handle errors
                setSignInError(true);
                console.error("Error making request:", error);
            }
        }
    }

    const handleData = (type: string, data: string) => {
        setFormData((prevData) => ({...prevData, [type] : data}));
    }

    useEffect(() => {
        if (validateForm && (currEmail === formData['email'])) {
          setEmailExists(false);
        } else {
          setEmailExists(true);
        }

        if (validateForm && (currPassword === formData['password'])) {
            setIsPasswordCorrect(false);
        } else {
            setIsPasswordCorrect(true);
        }

        handleLocalStorage();
      }, [formData, rmbMe]);

    return (
        <>
            <AccountModuleContainer>
            <Stack spacing={3}>
                { signInError && <Alert severity="error">The request encountered an issue. Please refresh and try again!</Alert> }
                <Typography variant="h5" align="center" gutterBottom>Welcome Back!</Typography>
                <hr></hr>
                <TextFields label="Email" type="email" form="sign in" validate={validateForm} data={handleData} error={emailExists} current={currEmail}></TextFields>
                <TextFields label="Password" type="password" form="sign in" validate={validateForm} data={handleData} error={isPasswordCorrect} current={currPassword}></TextFields>
                {/* <Button disableRipple color="secondary" variant="text" sx={{ justifyContent: "flex-end", '&:hover': { background: "none" } }}>
                    <Typography sx={{textDecoration: 'underline'}} variant="caption" gutterBottom>Forgot Password?</Typography>
                </Button> */}
                <ReactRouterLink style={{ textAlign: "end", textDecoration: 'underline' }} to="/verify-email">Forgot Password?</ReactRouterLink>
                <Checkboxes label={rmbSignIn} type="remember me" text="none" isChecked={handleRmbMe}></Checkboxes>
                <LongButtons label="Sign In" clickStatus={handleClickStatus}></LongButtons>
            </Stack>
            </AccountModuleContainer>
            <Typography sx={{ m: 2 }} align="center" variant="body2" gutterBottom>Don't Have An Account?&nbsp;
            <b><Link color="primary.light" component={ReactRouterLink} to="/sign-up">Sign Up</Link></b>
            </Typography>
        </>
    );
}