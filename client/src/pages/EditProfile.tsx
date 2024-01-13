import { useState } from "react";
import "../styles/App.css";
import { ThemeProvider } from '@mui/material';
import { theme } from '../styles/Palette';
import profilePic from "../assets/ProfilePicture.png";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LongSaveButtons from "../components/LongSaveButton"
import Button from '@mui/material/Button';

export default function SignUp() {

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

      // If you want to display the image preview, you can use FileReader
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prevUserData) => ({
          ...prevUserData,
          profilePic: reader.result as string, // Assuming the result is a string
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

  return (
    <ThemeProvider theme={theme}>
      <Box
        component="form"
        display="flex"
        justifyContent="center"
        alignItems="top"
        sx={{
          width: 420, height: "90vh", m: "auto",
          '& > :not(style)': { m: 2, p: 2 }, boxShadow: 5, borderRadius: 2,
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
            <Box sx={{ 
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "2rem",
               }}>
              <label htmlFor="profilePicInput">
                <Box
                  component="img"
                  sx={{
                    backgroundColor: "#E0E0E0",
                    position: 'relative', width: '7.5rem', height: '7.5rem',
                    borderRadius: '50%', boxShadow: "0px 10px 10px 0px rgba(0, 0, 0, 0.25), 0 0 10px rgba(0, 0, 0, 0.2) inset",
                    marginTop: "1rem", 
                    cursor: 'pointer',
                  }}
                  alt="profile picture"
                  src={userData.profilePic || profilePic}
                />
                <input
                  type="file"
                  id="profilePicInput"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handlePhotoUpload}
                />
              </label>
              <Typography variant="body1" align="center" sx={{fontWeight:"bold"}} > Change Photo</Typography>

            </Box>

            {/* Name */}
            <Box
              sx={{
                marginY: ".5rem",
                width: "100%",
              }}
            >
              <Typography variant="body1" align="left" sx={{fontWeight:"bold"}}> Name </Typography>
              <TextField
                id="outlined-basic"
                InputLabelProps={{ shrink: false }}
                variant="outlined"
                fullWidth
                defaultValue={userData.name}
                onChange={handleNameChange}
              />
            </Box>

            {/* Contact */}
            <Box
              sx={{
                marginY: ".5rem",
                width: "100%",
              }}
            >
              <Typography variant="body1" align="left" sx={{fontWeight:"bold"}}> Contact </Typography>
              <TextField
                id="outlined-basic"
                InputLabelProps={{ shrink: false }}
                variant="outlined"
                fullWidth
                defaultValue={userData.contact}
                onChange={handleContactChange}
              />
            </Box>

            {/* Email */}
            <Box
              sx={{
                marginY: ".5rem",
                width: "100%",
              }}
            >
              <Typography variant="body1" align="left" sx={{fontWeight:"bold"}}> Email </Typography>
              <TextField
                id="outlined-basic"
                InputLabelProps={{ shrink: false }}
                variant="outlined"
                fullWidth
                disabled
                defaultValue={userData.email} />
            </Box>
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSaveChanges()}
          >
            Save changes
          </Button>
        </Stack>
      </Box >
    </ThemeProvider >
  );
}