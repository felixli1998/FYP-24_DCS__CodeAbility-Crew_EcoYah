import axios from "axios";
import { TRANSACTION_HISTORY_ROUTES } from "./routes";

export const getAllPending = async () => {
  try {
    const res = await axios.get(
      TRANSACTION_HISTORY_ROUTES.GET_ALL_PENDING_REQUESTS,
    );
    return res.data.data;
  } catch (error) {
    console.error("Error fetching pending cashback requests: ", error);
    throw new Error("Failed to fetch pending cashback requests");
  }
};
