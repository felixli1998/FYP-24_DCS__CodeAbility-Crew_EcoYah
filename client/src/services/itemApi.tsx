import axios from "axios";

const URL = process.env.REACT_APP_BACKEND_URL + "/items";

export interface Item {
  id: number;
  name: string;
  unit: string;
  createdAt: string;
  updatedAt: string;
}

// Create a new event type
export const createItem = async (
  name: string,
  unit: string,
  eventTypeName: string
) => {
  try {
    const response = await axios.post(URL + "/create-item", {
      name: name,
      unit: unit,
      eventTypeName: eventTypeName,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating item: ", error);
    throw new Error("Failed to create item");
  }
};

// Get all event types
export const getItemsByEventTypeName = async (eventTypeName: string) => {
  try {
    const response = await axios.get(URL + "/items-by-event-type-name", {
      params: {
        eventTypeName: eventTypeName,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching items: ", error);
    throw new Error("Failed to fetch items");
  }
};
