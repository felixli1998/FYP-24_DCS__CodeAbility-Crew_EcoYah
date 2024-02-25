import axios from "axios";
import {USER_ROUTES} from "./routes";

// Get all active donation requests by user
export const getUserByEmail = async (email: string) => {
  try {
    const res = await axios.get(USER_ROUTES.RETRIEVE_BY_EMAIL.replace(":email", email))

    return res.data.data;
  } catch (error) {
    console.error("Error fetching user: ", error);
    throw new Error("Failed to fetch user");
  }
};

export const getAccountTypeByEmail = async (email: string) => {
  try {
    const res = await axios.get(
      USER_ROUTES.GET_ACCOUNT_TYPE,
      {
        params: {
          email: email
        },
      });

    return res.data.data;
  } catch (error) {
    console.error("Error fetching user: ", error);
    throw new Error("Failed to fetch user");
  }
}
