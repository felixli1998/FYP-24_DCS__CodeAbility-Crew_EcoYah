import axios from "axios";
import { CASHBACK_ROUTES } from "./routes";

export const getAllPending = async () => {
  try {
    const res = await axios.get(CASHBACK_ROUTES.GET_ALL_PENDING);
    return res.data.data;
  } catch (error) {
    console.error("Error fetching pending cashback requests: ", error);
    throw new Error("Failed to fetch pending cashback requests");
  }
};
