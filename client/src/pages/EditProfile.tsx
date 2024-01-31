import { useEffect, useReducer } from "react";
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
import { useFeedbackNotification } from "../components/useFeedbackNotification";
// import TerminateModal from "../components/EditProfile/TerminateModal";
import { makeHttpRequest } from "../utils/Utility";
import { USER_ROUTES } from "../services/routes";
import { useNavigate } from "react-router-dom";


type ErrorActionT = {
  type: 'requiredField' | 'invalidContact' | 'reset' | 'resetAll',
  payload: keyof UserStateT
}

type ErrorStateT = {
  [key in keyof UserStateT]: {
    error: boolean;
    helperText: string;
  };
};

type UserActionT =
| { type: keyof UserStateT ; payload: string }
| { type: 'all'; payload: UserStateT };


type UserStateT = {
  name: string;
  contactNum: string;
  email: string;
  profilePic: string | File;
}

export default function EditProfile() {
  const email = localStorage.getItem("ecoyah-email") || "";
  const { displayNotification, FeedbackNotification } = useFeedbackNotification();
  const navigate = useNavigate();

  const defaultUserState: UserStateT = {
    name: "",
    contactNum: "",
    email: "",
    profilePic: ""
  }

  const defaultErrorState: ErrorStateT = {
    name: { error: false, helperText: "" },
    contactNum: { error: false, helperText: "" },
    email: { error: false, helperText: "" },
    profilePic: { error: false, helperText: "" }
  }

  // TODO: Note to self, can I just use a regular useState and achieve the same outcome?
  const userDataReducer = (state: UserStateT, action: UserActionT) => {
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

  const errorReducer = (state: ErrorStateT, action:ErrorActionT) => {
    const FIELDS_MAPPER = {
      'name': 'name',
      'contactNum': 'contact number',
      'email': 'email',
      'profilePic': 'profile picture'
    }

    switch(action.type) {
      case 'requiredField':
        return { ...state, [action.payload]: {error: true, helperText: `Please enter your ${FIELDS_MAPPER[action.payload]}.`} };
      case 'invalidContact':
        return { ...state, [action.payload]: {error: true, helperText: "Please enter a valid contact number."} };
      case 'reset':
        return { ...state, [action.payload]: {error: false, helperText: ""} };
      case 'resetAll':
        return { ...defaultErrorState };
    }
  }

  const [userData, userDataDispatch] = useReducer(userDataReducer, defaultUserState);
  const [errorData, errorDataDispatch] = useReducer(errorReducer, defaultErrorState);

  const retrieveProfileInfo = async () => {
    try {
      const res: any = await makeHttpRequest('GET', USER_ROUTES.RETRIEVE_BY_EMAIL.replace(':email', email));
      const { action, data } = res.data;

      if(action) {
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

  // Function to validate changes are valid
  const validateChanges = () => {
    const requiredFieldS: (keyof UserStateT)[] = ['name', 'contactNum', 'email'];
    let isValid = true;

    requiredFieldS.forEach((field) => {
      if(userData[field] === "") {
        isValid = false;
        errorDataDispatch({ type: 'requiredField', payload: field });
      }
    })

    // Ensure contact is a number
    if (isNaN(Number(userData['contactNum']))) {
      isValid = false;
      errorDataDispatch({ type: 'invalidContact', payload: 'contactNum' });
    }

    return isValid;
  };

  // Function to handle photo upload
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        userDataDispatch({ type: 'profilePic', payload: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to handle save changes
  const handleSaveChanges = async () => {
    if(!validateChanges()) return;

    try {
      const res: any = await makeHttpRequest('PUT', USER_ROUTES.UPDATE_USER, userData);
      if(res.data.action) {
        displayNotification('success', 'Your profile has been updated successfully!')
        retrieveProfileInfo();
      } else {
        displayNotification('error', 'Encountered an error while saving changes. Please try again.')
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>, field: keyof UserStateT) => {
    userDataDispatch({ type: field, payload: event.target.value });
    errorDataDispatch({ type: 'reset', payload: field }); // Remove existing error message
  }

  // // Function to handle terminate account
  // const handleTerminateAccount = () => {
  //   // console.log("Email:", userData.email);
  //   return true;
  // };

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
          <Button
            variant="outlined"
            color="error"
            sx={{
              fontWeight: 'bold', // Make the font bold
              height: '3rem', // Adjust the height to make it thicker
            }}
            onClick={() => navigate('/profile')}
          >
            Cancel
          </Button>
          {/* TODO */}
          {/* <TerminateModal handleConfirmTerminate={handleTerminateAccount}/> */}
        </Stack>
      </Box >
      <FeedbackNotification />
    </ThemeProvider >
  );
}