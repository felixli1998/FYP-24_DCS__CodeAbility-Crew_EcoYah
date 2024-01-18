import { useState } from "react";
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

export default function EditProfile() {
  // Function to get current user data
  const [userData, setUserData] = useState({
    name: "John Timonthy",
    contact: "12345678",
    email: "johntimonthy@gmail.com",
    profilePic: profilePic,
  });

  // User data state variables
  const [nameInput, setNameInput] = useState(userData.name);
  const [contactInput, setContactInput] = useState(userData.contact);
  const [profilePicInput, setProfilePicInput] = useState<File | null>(null);

  // Function to handle changes
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameInput(event.target.value);
  };

  const handleContactChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContactInput(event.target.value);
  };

  // Function to handle photo upload
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfilePicInput(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prevUserData) => ({
          ...prevUserData,
          profilePic: reader.result as string, 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to validate changes are valid
  const validateChanges = () => {
    console.log("Basic validation, might need to ensure OTP etc");
    // Ensure not empty
    if (nameInput === "" || contactInput === "" || userData.email === "") {
      console.log("All fields cannot be empty");
      return false;
    }
    // Ensure contact is a number
    if (isNaN(Number(contactInput))) {
      console.log("Contact must be a number");
    }
    return true;
  };

  // Function to handle save changes
  const handleSaveChanges = () => {
    // Validate changes
    if (validateChanges()) {
      console.log("Backend request to server to change details!");
      console.log("Name:", nameInput);
      console.log("Contact:", contactInput);
      console.log("Email:", userData.email);
      return true;
    }
    console.log("Validation failed, will not send to server!")
    return false;
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
            <ProfileTextField label="Name" value={userData.name} onChange={handleNameChange} />
            {/* Contact */}
            <ProfileTextField label="Contact" value={userData.contact} onChange={handleContactChange} />
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

          < TerminateModal handleConfirmTerminate={handleTerminateAccount}/>
        </Stack>
      </Box >
    </ThemeProvider >
  );
}