import axios from "axios";

const URL = process.env.REACT_APP_BACKEND_URL + "/eventTypes";

export interface EventType {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// Create a new event type
export const createEventType = async (eventTypeName: string) => {
  try {
    const response = await axios.post(URL + "/create-event-type", {
      eventTypeName: eventTypeName,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching event types:", error);
    throw new Error("Failed to fetch event types");
  }
};

// Get all event types
export const fetchEventTypes = async () => {
  try {
    const response = await axios.get(URL + "/event-types");
    return response.data;
  } catch (error) {
    console.error("Error fetching event types:", error);
    throw new Error("Failed to fetch event types");
  }
};
