import axios from "axios";
import { DASHBOARD_ROUTES } from "./routes";

export const getPopularEventToDate = async () => {
  try {
    const res = await axios.get(DASHBOARD_ROUTES.GET_POPULAR_EVENT);
    return res.data.data.data;
  } catch (error) {
    throw new Error("Failed to fetch popular event");
  }
};

export const getPopularItemToDate = async () => {
  try {
    const res = await axios.get(DASHBOARD_ROUTES.GET_POPULAR_ITEM);
    return res.data.data.data;
  } catch (error) {
    throw new Error("Failed to fetch popular item");
  }
};

export const getPreferredDropOff = async () => {
  try {
    const res = await axios.get(DASHBOARD_ROUTES.GET_PREFERRED_DROP_OFF);
    return res.data.data.data;
  } catch (error) {
    throw new Error("Failed to fetch preferred drop off data");
  }
};
