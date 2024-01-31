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

  // TODO: Note to self, can I just use a regular useState and achieve the same outcome?
  const reducer = (state: any, action:any) => {
    switch (action.type) {
      case 'updateName':
        // console.log('state', )
        return { ...state, name: action.payload };
      case 'updateContactNum':
        return { ...state, contactNum: action.payload };
      case 'updateProfilePic':
        return { ...state, profilePic: action.payload };
      case 'updateAll':
        return { ...state, ...action.payload };
      default:
        throw new Error();
    }
  }

  const [userData, userDataDispatch] = useReducer(reducer, defaultState);

  const retrieveProfileInfo = async () => {
    try {
      const res: any = await makeHttpRequest('GET', USER_ROUTES.RETRIEVE_BY_EMAIL.replace(':email', email));
      const { action, data } = res.data;
      if(action) {
        // Currently, we do not have points so it will be null
        const { name, email, contactNum, imageUrl = profilePic } = data;
        userDataDispatch({ type: 'updateAll', payload: { name, email, contactNum, profilePic: imageUrl }})
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
    const { name, contactNum, email } = userData;
    // Ensure not empty
    if (name === "" || contactNum === "" || email === "") {
      console.log("All fields cannot be empty");
      return false;
    }
    // Ensure contact is a number
    if (isNaN(Number(contactNum))) {
      console.log("Contact must be a number");
    }
    return true;
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
    // Validate changes
    if (validateChanges()) {
      // console.log("Backend request to server to change details!");
      // console.log("Name:", nameInput);
      // console.log("Contact:", contactInput);
      // console.log("Email:", userData.email);
      return true;
    }
    // console.log("Validation failed, will not send to server!")
    console.log(userData)
    return true;
  };

  // Function to handle terminate account
  const handleTerminateAccount = () => {
    console.log("Backend request to server to terminate account!");
    console.log("Email:", userData.email);
    return true;
  };

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
            {/* Name */}
            <ProfileTextField label="Name" value={userData.name} onChange={(e) => userDataDispatch({ type: 'updateName', payload: e.target.value})} error={true} helperText="This is a required field"/>
            {/* Contact */}
            <ProfileTextField label="Contact" value={userData.contactNum} onChange={(e) => userDataDispatch({ type: 'updateContactNum', payload: e.target.value})} />
            {/* Email */}
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