import axios from "axios";
import { ITEM_ROUTES } from "./routes";

// Create a new event type
export const createItem = async (
  name: string,
  unit: string,
  eventTypeId: number,
) => {
  try {
    const response = await axios.post(ITEM_ROUTES.CREATE_ITEM, {
      name: name,
      unit: unit,
      eventTypeId: eventTypeId,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating item: ", error);
    throw new Error("Failed to create item");
  }
};

// Get all items
export const getAllItems = async () => {
  try {
    const response = await axios.get(ITEM_ROUTES.RETRIEVE_ALL_ITEMS);
    return response.data;
  } catch (error) {
    console.error("Error fetching items: ", error);
    throw new Error("Failed to fetch items");
  }
};

// Get all items based on event type (id)
export const getItemsByEventTypeId = async (eventTypeId: string) => {
  try {
    const response = await axios.get(
      ITEM_ROUTES.RETRIEVE_ITEMS_BY_EVENT_TYPE_ID.replace(
        ":eventId",
        eventTypeId,
      ),
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching items: ", error);
    throw new Error("Failed to fetch items");
  }
};
