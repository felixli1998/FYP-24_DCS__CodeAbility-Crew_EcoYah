import axios from "axios";

const URL = process.env.REACT_APP_BACKEND_URL + "/eventTypes";

export interface EventType {
  id: number,
  name: string,
  createdAt: string,
  updatedAt: string
}

export const fetchEventTypes = async () => {
  try {
    const response = await axios.get(URL + "/event-types");
    return response.data;
  } catch (error) {
    console.error("Error fetching event types:", error);
    throw new Error("Failed to fetch event types");
  }
};
