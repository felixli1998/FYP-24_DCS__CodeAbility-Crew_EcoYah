import { useEffect, useReducer, useState } from "react";
import "../styles/App.css";
import { ThemeProvider } from '@mui/material';
import { theme } from '../styles/Palette';
import profilePic from "../assets/ProfilePicture.png";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

// Components
import ProfilePic from "../components/EditProfile/ProfilePic";
import ProfileTextField from "../components/EditProfile/ProfileTextField";
import TerminateModal from "../components/EditProfile/TerminateModal";
import { makeHttpRequest } from "../utils/Utility";
import { USER_ROUTES } from "../services/routes";

export default function EditProfile() {
  const email = localStorage.getItem("ecoyah-email") || "";

  const defaultState = {
    name: "",
    contactNum: "",
    email: "",
    profilePic: ""
  }

  const defaultErrorState = {
    name: { error: false, helperText: "" },
    contactNum: { error: false, helperText: "" },
    email: { error: false, helperText: "" },
    profilePic: { error: false, helperText: "" }
  }

  // TODO: Note to self, can I just use a regular useState and achieve the same outcome?
  const userDataReducer = (state: any, action:any) => {
    switch (action.type) {
      case 'name':
        return { ...state, name: action.payload };
      case 'contactNum':
        return { ...state, contactNum: action.payload };
      case 'profilePic':
        return { ...state, profilePic: action.payload };
      case 'all':
        return { ...state, ...action.payload };
      default:
        throw new Error();
    }
  }

  const errorReducer = (state: any, action:any) => {
    switch(action.type) {
      case 'Required Field':
        return { ...state, [action.payload]: {error: true, helperText: "This is a required field"} };
      case 'Invalid Contact':
        return { ...state, [action.payload]: {error: true, helperText: "Please input a valid value."} };
      case 'Reset':
        return { ...state, [action.payload]: {error: false, helperText: ""} };
      case 'Reset All':
        return { ...defaultErrorState };
    }
  }

  const [userData, userDataDispatch] = useReducer(userDataReducer, defaultState);
  const [errorData, errorDataDispatch] = useReducer(errorReducer, defaultErrorState);

  const retrieveProfileInfo = async () => {
    try {
      const res: any = await makeHttpRequest('GET', USER_ROUTES.RETRIEVE_BY_EMAIL.replace(':email', email));
      const { action, data } = res.data;
      if(action) {
        // Currently, we do not have points so it will be null
        const { name, email, contactNum, imageUrl = profilePic } = data;
        userDataDispatch({ type: 'all', payload: { name, email, contactNum, profilePic: imageUrl }})
      } else {
        // TODO: Currently, we do not really have any robust error message
        console.log("Error retrieving user info");
      }
    } catch (error) {
      console.log("Error retrieving user info");
    }
  };

  useEffect(() => {
    retrieveProfileInfo();
  }, [email]);

  // // Function to validate changes are valid
  const validateChanges = () => {
    const REQUIRED_FIELDS = ['name', 'contactNum', 'email'];

    REQUIRED_FIELDS.forEach((field) => {
      if(userData[field].trim() === "") {
        errorDataDispatch({ type: 'Required Field', payload: field });
      }
    })

    // Ensure contact is a number
    if (isNaN(Number(userData['contactNum']))) {
      errorDataDispatch({ type: 'Invalid Contact', payload: 'contactNum' });
    }

    if(Object.values(errorData).some((error: any) => error.error)) {
      return false;
    }

    return true
  };

  // Function to handle photo upload
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      userDataDispatch({ type: 'updateProfilePic', payload: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        userDataDispatch({ type: 'updateProfilePic', payload: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to handle save changes
  const handleSaveChanges = () => {
    if (!validateChanges()) return

    // TODO: INVOKE FUNCTION TO SAVE CHANGES
  };

  // Function to handle terminate account
  const handleTerminateAccount = () => {
    console.log("Backend request to server to terminate account!");
    console.log("Email:", userData.email);
    return true;
  };

  const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    userDataDispatch({ type: field, payload: event.target.value });
    errorDataDispatch({ type: 'Reset', payload: field }); // Remove existing error message
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        component="form"
        display="flex"
        justifyContent="center"
        alignItems="top"
        sx={{
          marginTop: "2rem",
        }}
        noValidate
        autoComplete="off"
      >
        <Stack spacing={3} justifyContent={"space-between"} >
          <Box
            sx={{
              width: 350,
              display: "flex",
              flexDirection: "column",
              justifyContent: "left",
              alignItems: "center",
              marginBottom: "3rem",
            }}
          >
            <ProfilePic
              profilePic={userData.profilePic}
              handlePhotoUpload={handlePhotoUpload}
            />
            <ProfileTextField label="Name" value={userData.name} onChange={(e) => handleFieldChange(e, 'name')} error={errorData.name.error} helperText={errorData.name.helperText}/>
            <ProfileTextField label="Contact" value={userData.contactNum} onChange={(e) => handleFieldChange(e, 'contactNum')} error={errorData.contactNum.error} helperText={errorData.contactNum.helperText}/>
            <ProfileTextField label="Email" value={userData.email} disabled={true} />
          </Box>

          <Button
            variant="contained"
            color="primary"
            sx={{
              fontWeight: 'bold', // Make the font bold
              height: '3rem', // Adjust the height to make it thicker
            }}
            onClick={() => handleSaveChanges()}
          >
            Save changes
          </Button>

          <TerminateModal handleConfirmTerminate={handleTerminateAccount}/>
        </Stack>
      </Box >
    </ThemeProvider >
  );
}