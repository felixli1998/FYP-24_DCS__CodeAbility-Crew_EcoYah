import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
// MUI
import { Box, Button, Stack } from "@mui/material";
// Components
import ProfilePic from "../../components/EditProfile/ProfilePic";
import ProfileTextField from "../../components/EditProfile/ProfileTextField";
import { useFeedbackNotification } from "../../components/useFeedbackNotification";
// import TerminateModal from "../components/EditProfile/TerminateModal";
import { uploadImage } from "../../utils/UploadImage";
import { folderPrefixNames } from "../../components/Image/Image";
// Services
import { IMAGE_ROUTES, USER_ROUTES } from "../../services/routes";
import { makeHttpRequest } from "../../utils/Utility";

type ErrorActionT = {
  type: "requiredField" | "invalidContact" | "reset" | "resetAll";
  payload: keyof UserStateT;
};

type ErrorStateT = {
  [key in keyof UserStateT]: {
    error: boolean;
    helperText: string;
  };
};

type UserActionT =
  | { type: keyof UserStateT; payload: string }
  | { type: "all"; payload: UserStateT };

type UserStateT = {
  name: string;
  contactNum: string;
  email: string;
  imageId: string;
};

export default function EditProfile() {
  const [base64ImageString, setBase64ImageString] = useState<string>("");

  const email = localStorage.getItem("ecoyah-email") || "";
  const { displayNotification, FeedbackNotification } =
    useFeedbackNotification();
  const navigate = useNavigate();

  const defaultUserState: UserStateT = {
    name: "",
    contactNum: "",
    email: "",
    imageId: "",
  };

  const defaultErrorState: ErrorStateT = {
    name: { error: false, helperText: "" },
    contactNum: { error: false, helperText: "" },
    email: { error: false, helperText: "" },
    imageId: { error: false, helperText: "" },
  };

  // TODO: Note to self, can I just use a regular useState and achieve the same outcome?
  const userDataReducer = (state: UserStateT, action: UserActionT) => {
    switch (action.type) {
      case "name":
        return { ...state, name: action.payload };
      case "contactNum":
        return { ...state, contactNum: action.payload };
      case "imageId":
        return { ...state, imageId: action.payload };
      case "all":
        return { ...state, ...action.payload };
      default:
        throw new Error();
    }
  };

  const errorReducer = (state: ErrorStateT, action: ErrorActionT) => {
    const FIELDS_MAPPER = {
      name: "name",
      contactNum: "contact number",
      email: "email",
      imageId: "profile picture",
    };

    switch (action.type) {
      case "requiredField":
        return {
          ...state,
          [action.payload]: {
            error: true,
            helperText: `Please enter your ${FIELDS_MAPPER[action.payload]}`,
          },
        };
      case "invalidContact":
        return {
          ...state,
          [action.payload]: {
            error: true,
            helperText: "Please enter a valid contact number",
          },
        };
      case "reset":
        return { ...state, [action.payload]: { error: false, helperText: "" } };
      case "resetAll":
        return { ...defaultErrorState };
    }
  };

  const [userData, userDataDispatch] = useReducer(
    userDataReducer,
    defaultUserState,
  );
  const [errorData, errorDataDispatch] = useReducer(
    errorReducer,
    defaultErrorState,
  );

  // Doing this slightly dirtily for now instead of using the image component
  const retrieveImage = (imageId: string) => {
    const filepath = folderPrefixNames.PROFILEPICTURES + "/" + imageId;

    return IMAGE_ROUTES.RETRIEVE_BY_FILE_PATH.replace(":filePath", filepath);
  };

  const retrieveProfileInfo = async () => {
    try {
      const res: any = await makeHttpRequest(
        "GET",
        USER_ROUTES.RETRIEVE_BY_EMAIL.replace(":email", email),
      );
      const { action, data } = res.data;

      if (action) {
        const { name, email, contactNum, imageId } = data;
        userDataDispatch({
          type: "all",
          payload: { name, email, contactNum, imageId: imageId },
        });
        // TODO: The profile pic receieved here is /static/media/ProfilePicture.7ed21e034b8cb055135a.png
        // It should be the same as when you are in /profile, which resolves to DefaultProfilePic.jpg
      } else {
        // TODO: Currently, we do not really have any robust error message
        displayNotification(
          "error",
          "We encountered some error while retrieving your profile information. Please try again later",
        );
      }
    } catch (error) {
      console.log(error);
      displayNotification(
        "error",
        "Whoooops. We might be facing some technical error! Please try again later",
      );
    }
  };

  useEffect(() => {
    retrieveProfileInfo();
  }, [email]);

  // Function to validate changes are valid
  const validateChanges = () => {
    const requiredFieldS: (keyof UserStateT)[] = [
      "name",
      "contactNum",
      "email",
    ];
    let isValid = true;

    requiredFieldS.forEach((field) => {
      if (userData[field] === "") {
        isValid = false;
        errorDataDispatch({ type: "requiredField", payload: field });
      }
    });

    // Ensure contact is a number
    if (isNaN(Number(userData["contactNum"]))) {
      isValid = false;
      errorDataDispatch({ type: "invalidContact", payload: "contactNum" });
    }

    return isValid;
  };

  // Function to handle photo upload
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        userDataDispatch({
          type: "imageId",
          payload: reader.result as string,
        });
        setBase64ImageString(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  // This is to check whether if this is an S3 image or a blob
  const isS3Image = (imageId: string) => {
    const dataUrlSubstring = "data:";

    return !imageId.includes(dataUrlSubstring);
  };

  // Function to handle save changes
  const handleSaveChanges = async () => {
    if (!validateChanges()) return;

    try {
      let payload: any = { ...userData };

      if (base64ImageString !== "") {
        const imageId = await uploadImage(
          "profile-pictures",
          base64ImageString,
        );

        payload["imageId"] = imageId[0];
      }

      const res: any = await makeHttpRequest(
        "PUT",
        USER_ROUTES.UPDATE_USER,
        payload,
      );

      if (res.data.action) {
        displayNotification(
          "success",
          "Your profile has been updated successfully!",
        );
        retrieveProfileInfo();
      } else {
        displayNotification(
          "error",
          "Encountered an error while saving changes. Please try again",
        );
      }
    } catch (error) {
      console.log(error);
      displayNotification(
        "error",
        "Whoooops. We might be facing some technical error! Please try again later",
      );
    }
  };

  const handleFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: keyof UserStateT,
  ) => {
    userDataDispatch({ type: field, payload: event.target.value });
    errorDataDispatch({ type: "reset", payload: field }); // Remove existing error message
  };

  return (
    <>
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
        <Stack spacing={6}>
          <Box
            sx={{
              width: 350,
              display: "flex",
              flexDirection: "column",
              justifyContent: "left",
              alignItems: "center",
            }}
          >
            <ProfilePic
              profilePic={
                isS3Image(userData.imageId)
                  ? retrieveImage(userData.imageId)
                  : userData.imageId
              }
              handlePhotoUpload={handlePhotoUpload}
            />
            <ProfileTextField
              label="Name"
              value={userData.name}
              onChange={(e) => handleFieldChange(e, "name")}
              error={errorData.name.error}
              helperText={errorData.name.helperText}
            />
            <ProfileTextField
              label="Contact"
              value={userData.contactNum}
              onChange={(e) => handleFieldChange(e, "contactNum")}
              error={errorData.contactNum.error}
              helperText={errorData.contactNum.helperText}
            />
            <ProfileTextField
              label="Email"
              value={userData.email}
              disabled={true}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "left",
              gap: "1rem",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              sx={{
                fontWeight: "bold",
                height: "3rem",
              }}
              onClick={() => handleSaveChanges()}
            >
              Save changes
            </Button>
            <Button
              variant="outlined"
              color="error"
              sx={{
                fontWeight: "bold",
                height: "3rem",
              }}
              onClick={() => navigate("/profile")}
            >
              Cancel
            </Button>
          </Box>
          {/* TODO */}
          {/* <TerminateModal handleConfirmTerminate={handleTerminateAccount}/> */}
        </Stack>
      </Box>
      <FeedbackNotification />
    </>
  );
}
