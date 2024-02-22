import axios from "axios";
import {USER_ROUTES} from "./routes";

// Get all active donation requests by user
export const getUserByEmail = async (email: string) => {
  try {
    const response = await axios.get(
      USER_ROUTES.RETRIEVE_BY_EMAIL.replace(":email", email)
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching event types: ", error);
    throw new Error("Failed to fetch event types");
  }
};
