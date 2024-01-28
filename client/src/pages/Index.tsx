import React, {useEffect, useState} from "react";
import BoxButton from "../components/Buttons/BoxButton";
import {useQuery} from "@tanstack/react-query";
import {EventType, fetchEventTypes} from "../services/eventTypesApi";

const Home: React.FC = () => {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [selectedEventType, setSelectedEventType] = useState<EventType | null>(
    null
  );
  const {
    data: eventTypesData,
    isLoading: eventTypesIsLoading,
    isError: eventTypesIsError,
  } = useQuery({
    queryKey: ["event-types"],
    queryFn: fetchEventTypes,
  });

  useEffect(() => {
    if (!eventTypesIsLoading && eventTypesData) {
      setEventTypes(eventTypesData.data.eventTypes);
    }
  }, [eventTypesData, eventTypesIsLoading]);

  const handleBoxButtonClick = (eventType: EventType) => {
    setSelectedEventType(eventType);
  };

  return (
    <div>
      <h1>Welcome to the Homepage</h1>
      <p>This is a simple React homepage template.</p>
      {eventTypes &&
        eventTypes.map((eventType: any) => (
          <BoxButton
            key={eventType.id}
            handleClick={() => handleBoxButtonClick(eventType)}
            color="primary"
            size="small"
            name={eventType.name}
            isSelected={selectedEventType === eventType}
          ></BoxButton>
        ))}
    </div>
  );
};

export default Home;
