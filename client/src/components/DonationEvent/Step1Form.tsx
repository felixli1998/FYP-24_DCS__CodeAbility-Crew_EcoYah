// React Imports
import {ChangeEvent} from "react";

// MUI Imports
import {useTheme} from "@mui/system";
import {Box, TextField, Button, Grid} from "@mui/material";

// Icons
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

// Components
import StaffTypography from "../Typography/StaffTypography";

// Utils Imports
import {FormDataType} from "../../utils/Types";

type Step1FormProps = {
  formData: FormDataType;
  showMissingFields: boolean;
  handleData: (key: string, value: any) => void;
};

export default function Step1Form(props: Step1FormProps) {
  const {formData, handleData, showMissingFields} = props;
  const {imageId, name} = formData;
  const theme = useTheme();

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageDataUrl = reader.result as string;
        handleData("imageId", imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleData("name", event.target.value);
  };

  // === For Event Type View and Create ===
  // const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  // const [errorMessage, setErrorMessage] = useState<string>('');
  // const {
  //   data: eventTypesData,
  //   isLoading: eventTypesIsLoading,
  //   refetch: eventTypesRefetch,
  // } = useQuery({
  //   queryKey: ['eventTypes'],
  //   queryFn: fetchEventTypes,
  // });

  // useEffect(() => {
  //   if (!eventTypesIsLoading && eventTypesData) {
  //     setEventTypes(eventTypesData.data.eventTypes);
  //   }
  // }, [eventTypesData, eventTypesIsLoading]);

  // const { mutateAsync: createEventTypeMutateAsync } = useMutation({
  //   mutationKey: ['createEventType'],
  //   // mutationFn: Performing the actual API call
  //   mutationFn: (eventTypeName: string) => {
  //     return createEventType(eventTypeName);
  //   },
  //   // Execution after successful API call
  //   onSuccess: (response) => {
  //     if (response && response.data.eventTypes) {
  //       eventTypesRefetch();
  //       return true;
  //     }
  //     return false;
  //   },
  //   onError: (error: any) => {
  //     console.error('Error creating event type:', error);
  //     setErrorMessage('An error occurred while creating the event type.');
  //   },
  // });

  // const handleBoxButtonClick = (eventType: EventType) => {
  //   handleData('eventType', eventType);
  // };

  // const handleFormSubmit = async (formData: any): Promise<boolean> => {
  //   setErrorMessage('');
  //   const { eventType } = formData;
  //   const sanitisedEventType = formatAndCapitalizeString(eventType); // Sanitize input to safeguard duplicate creation of event type
  //   const existingEventTypes = eventTypesData.data.eventTypes;
  //   const isEventTypeExist = isValueExistsInObjectArray(
  //     existingEventTypes,
  //     'name',
  //     sanitisedEventType
  //   );

  //   if (eventType === '') {
  //     setErrorMessage('Please enter an event type');
  //     return false;
  //   }

  //   if (isEventTypeExist) {
  //     setErrorMessage('The event type already exists!');
  //     return false;
  //   }
  //   return createEventTypeMutateAsync(sanitisedEventType);
  // };
  // === For Event Type View and Create ===

  return (
    <>
      <Box display="flex" justifyContent="center" alignItems="center">
        <StaffTypography
          type="title"
          size={1.5}
          text="1. Upload an Image of the Donation Event"
        />
        <Button
          variant="outlined"
          sx={{
            fontSize: "1rem",
            fontWeight: "bold",
            letterSpacing: "0.12rem",
            marginX: "2rem",
            padding: "1rem 1rem",
            color: "primary.dark",
            borderColor: "primary.dark",
          }}
          startIcon={<CloudUploadIcon sx={{ color: "primary.dark" }} />}
        >
          <label htmlFor="ImageInput" style={{ cursor: "pointer" }}>
            Upload File
          </label>
          <input
            type="file"
            id="ImageInput"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
        </Button>
      </Box>
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
          height: "20.5rem",
          padding: "1rem",
          border: `1px dashed ${
            showMissingFields && !imageId ? "#d32f2f" : "#5A5858"
          }`,
          borderRadius: "4px",
        }}
      >
        {imageId && (
          <img
            src={imageId}
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
      {showMissingFields && !imageId && (
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
        error={showMissingFields && name === ""}
        helperText={
          showMissingFields &&
          name === "" && (
            <StaffTypography
              type="helperText"
              size={1.5}
              text="Please enter a name"
            />
          )
        }
      />
      {/* <Box display='flex' alignItems='center'>
        <StaffTypography
          type='title'
          size={1.5}
          text='3. Choose a Donation Event Type'
          customStyles={{ marginRight: 4 }}
        />
        <FormDialog
          buttonName='Add'
          buttonIcon={<AddIcon />}
          dialogTitle='Create a New Event Type'
          leftActionButtonName='Cancel'
          rightActionButtonName='Add'
          errorMessage={errorMessage}
          formComponent={
            <OutlinedTextField
              id={'create-event-type'}
              name='eventType'
              label='Event Type'
              helperText='Please enter non-numerical values'
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
            eventTypes.map((eventTypeItem: any) => (
              <Grid item xs={12} md={4} key={eventTypeItem.id}>
                <BoxButton
                  key={eventTypeItem.id}
                  handleClick={() => handleBoxButtonClick(eventTypeItem)}
                  color='primary'
                  size='small'
                  name={eventTypeItem.name}
                  isSelected={
                    eventType ? eventType.id === eventTypeItem.id : false
                  }
                ></BoxButton>
              </Grid>
            ))}
        </Grid>
      )}
      {showMissingFields && !eventType && (
        <StaffTypography
          type='helperText'
          size={1.5}
          text='Please choose an event type'
        />
      )} */}
    </>
  );
}
