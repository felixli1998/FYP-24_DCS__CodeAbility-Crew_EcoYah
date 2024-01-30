import React, {useEffect, useState} from "react";
import BoxButton from "../components/Button/BoxButton";
import FormDialog from "../components/Dialog/FormDialog";
import {useMutation, useQuery} from "@tanstack/react-query";
import {
  EventType,
  createEventType,
  fetchEventTypes,
} from "../services/eventTypesApi";
import AddIcon from "@mui/icons-material/Add";
import OutlinedTextField from "../components/TextFields/OutlinedTextField";
import {
  formatAndCapitalizeString,
  isValueExistsInObjectArray,
} from "../utils/Common";

const Home: React.FC = () => {
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

  const {mutateAsync: createEventTypeMutateAsync} = useMutation({
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
    const {eventType} = formData;
    const sanitisedEventType = formatAndCapitalizeString(eventType); // Sanitize input to safeguard duplicate creation of event type
    const existingEventTypes = eventTypesData.data.eventTypes;
    const isEventTypeExist = isValueExistsInObjectArray(
      existingEventTypes,
      "name",
      sanitisedEventType
    );

    if (isEventTypeExist) {
      setErrorMessage("Input event type already exists!");
      return false;
    }
    return createEventTypeMutateAsync(sanitisedEventType);
  };

  return (
    <div>
      <h1>Welcome to the Homepage</h1>
      <p>This is a simple React homepage template.</p>
      {eventTypesIsLoading ? (
        <div>Loading</div>
      ) : (
        eventTypes &&
        eventTypes.map((eventType: any) => (
          <BoxButton
            key={eventType.id}
            handleClick={() => handleBoxButtonClick(eventType)}
            color="primary"
            size="small"
            name={eventType.name}
            isSelected={selectedEventType === eventType}
          ></BoxButton>
        ))
      )}
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
            label="Required"
            helperText="Please enter non-numerical values"
            regExpression={/^[a-zA-Z\s]+$/}
          />
        }
        handleFormSubmit={handleFormSubmit}
      ></FormDialog>
    </div>
  );
};

export default Home;
