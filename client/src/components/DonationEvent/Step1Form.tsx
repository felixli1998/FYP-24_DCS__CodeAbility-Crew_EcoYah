// React Imports
import { useState, useEffect, ChangeEvent } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

// MUI Imports
import { useTheme } from "@mui/system";
import { Box, TextField, Button, Grid } from "@mui/material";

// Icons
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AddIcon from "@mui/icons-material/Add";

// Components
import StaffTypography from "../Typography/StaffTypography";
// import Image from "../Image/Image";
import BoxButton from "../Button/BoxButton";
import FormDialog from "../Dialog/FormDialog";
import OutlinedTextField from "../TextFields/OutlinedTextField";

// Common Methods & APIs
import {
  createEventType,
  fetchEventTypes,
} from "../../services/eventTypesApi";
import {
  formatAndCapitalizeString,
  isValueExistsInObjectArray,
} from "../../utils/Common";
import { EventType } from "../../utils/Types";

type Step1FormProps = {
  validate: boolean;
  data: (key: string, value: any) => void;
  back: boolean;
  prevData: any;
};

export default function Step1Form(props: Step1FormProps) {
  const theme = useTheme();
  const [fileUpload, setFileUpload] = useState<boolean>(false);
  const [image, setImage] = useState<string | undefined>(undefined);
  const [name, setName] = useState<string>("");

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    setFileUpload(true);
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageDataUrl = reader.result as string;
        setImage(imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  // === For Event Type View and Create ===
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [selectedEventType, setSelectedEventType] = useState<EventType | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  const {
    data: eventTypesData,
    isLoading: eventTypesIsLoading,
    refetch: eventTypesRefetch,
  } = useQuery({
    queryKey: ["eventTypes"],
    queryFn: fetchEventTypes,
  });

  useEffect(() => {
    if (!eventTypesIsLoading && eventTypesData) {
      setEventTypes(eventTypesData.data.eventTypes);
    }
  }, [eventTypesData, eventTypesIsLoading]);

  const { mutateAsync: createEventTypeMutateAsync } = useMutation({
    mutationKey: ["createEventType"],
    // mutationFn: Performing the actual API call
    mutationFn: (eventTypeName: string) => {
      return createEventType(eventTypeName);
    },
    // Execution after successful API call
    onSuccess: (response) => {
      if (response && response.data.eventTypes) {
        eventTypesRefetch();
        return true;
      }
      return false;
    },
    onError: (error: any) => {
      console.error("Error creating event type:", error);
      setErrorMessage("An error occurred while creating the event type.");
    },
  });

  const handleBoxButtonClick = (eventType: EventType) => {
    setSelectedEventType(eventType);
  };

  const handleFormSubmit = async (formData: any): Promise<boolean> => {
    setErrorMessage("");
    const { eventType } = formData;
    const sanitisedEventType = formatAndCapitalizeString(eventType); // Sanitize input to safeguard duplicate creation of event type
    const existingEventTypes = eventTypesData.data.eventTypes;
    const isEventTypeExist = isValueExistsInObjectArray(
      existingEventTypes,
      "name",
      sanitisedEventType
    );

    if (eventType === "") {
      setErrorMessage("Please enter an event type");
      return false;
    }

    if (isEventTypeExist) {
      setErrorMessage("The event type already exists!");
      return false;
    }
    return createEventTypeMutateAsync(sanitisedEventType);
  };
  // === For Event Type View and Create ===

  useEffect(() => {
    // retrieve previously entered data
    if (
      props.back &&
      props.prevData["name"] &&
      props.prevData["imageId"] &&
      props.prevData["eventType"]
    ) {
      setName(props.prevData["name"]);
      setFileUpload(true);
      setImage(props.prevData["imageId"]);
      setSelectedEventType(props.prevData["eventType"]);
    }
  }, [props.back, props.prevData]);

  useEffect(() => {
    // update new entered data
    props.data("imageId", image);
    props.data("name", name);
    props.data("eventType", selectedEventType);
  }, [name, image, selectedEventType]);

  return (
    <>
      <StaffTypography
        type="title"
        size={1.5}
        text="1. Upload an Image of the Donation Event"
      />
      {/* <Image imageId="1.png" imageSource="local" type="rectangle" editable={true} /> */}
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{
          width: "100%",
          [theme.breakpoints.up("sm")]: {
            width: "40.25rem",
          },
          height: "12.5rem",
          border: `1px dashed ${
            props.validate && !fileUpload ? "#d32f2f" : "#5A5858"
          }`,
          borderRadius: "4px",
        }}
      >
        {!fileUpload ? (
          <>
            <UploadFileIcon
              sx={{
                width: "3.44rem",
                height: "3.44rem",
                color: "primary.dark",
              }}
            />
            <Button sx={{ color: "primary.dark" }}>
              <label htmlFor="ImageInput" style={{ cursor: "pointer" }}>
                <StaffTypography
                  type="title"
                  size={1.5}
                  text="Click to Upload"
                  customStyles={{
                    textDecoration: "underline",
                    marginTop: "1rem",
                  }}
                />
              </label>
              <input
                type="file"
                id="ImageInput"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
            </Button>
          </>
        ) : (
          <img
            src={image}
            alt="donationImage"
            loading="lazy"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        )}
      </Box>
      {props.validate && image === undefined && (
        <StaffTypography
          type="helperText"
          size={1.5}
          text="Please upload an image"
        />
      )}
      <StaffTypography
        type="title"
        size={1.5}
        text="2. Enter the Name the Donation Event"
      />
      <TextField
        label="Name"
        type="text"
        InputLabelProps={{ shrink: true }}
        sx={{ width: 350 }}
        value={name}
        onChange={handleTextChange}
        error={props.validate && name === ""}
        helperText={
          props.validate &&
          name === "" && (
            <StaffTypography
              type="helperText"
              size={1.5}
              text="Please enter a name"
            />
          )
        }
      />
      <Box display="flex" alignItems="center">
        <StaffTypography
          type="title"
          size={1.5}
          text="3. Choose a Donation Event Type"
          customStyles={{ marginRight: 4 }}
        />
        <FormDialog
          buttonName="Add"
          buttonIcon={<AddIcon />}
          dialogTitle="Create a New Event Type"
          leftActionButtonName="Cancel"
          rightActionButtonName="Add"
          errorMessage={errorMessage}
          formComponent={
            <OutlinedTextField
              id={"create-event-type"}
              name="eventType"
              label="Event Type"
              helperText="Please enter non-numerical values"
              regExpression={/^[a-zA-Z\s]+$/}
            />
          }
          handleFormSubmit={handleFormSubmit}
        ></FormDialog>
      </Box>
      {eventTypesIsLoading ? (
        <div>Loading Event Types</div>
      ) : (
        <Grid container>
          {eventTypes &&
            eventTypes.map((eventType: any) => (
              <Grid item xs={12} md={4} key={eventType.id}>
                <BoxButton
                  key={eventType.id}
                  handleClick={() => handleBoxButtonClick(eventType)}
                  color="primary"
                  size="small"
                  name={eventType.name}
                  isSelected={selectedEventType ? selectedEventType.id === eventType.id : false}
                ></BoxButton>
              </Grid>
            ))}
        </Grid>
      )}
      {props.validate && selectedEventType === null && (
        <StaffTypography
          type="helperText"
          size={1.5}
          text="Please choose an event type"
        />
      )}
    </>
  );
}
