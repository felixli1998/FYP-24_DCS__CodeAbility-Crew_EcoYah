import axios from "axios";
import {USER_ROUTES} from "./routes";

// Get all active donation requests by user
export const getUserByEmail = async (email: string) => {
  try {
    const res = await axios.get(USER_ROUTES.RETRIEVE_BY_EMAIL.replace(":email", email))

    return res.data.data;
  } catch (error) {
    console.error("Error fetching event types: ", error);
    throw new Error("Failed to fetch event types");
  }
};
