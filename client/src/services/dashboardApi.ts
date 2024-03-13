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

export const getEventsByMonth = async (month: string) => {
  try {
    const res = await axios.get(
      DASHBOARD_ROUTES.GET_EVENTS_BY_MONTH.replace(":month", month),
    );
    return res.data.data.data;
  } catch (error) {
    throw new Error("Failed to fetch events by month");
  }
};

export const getItemsByMonth = async (month: string) => {
  try {
    const res = await axios.get(
      DASHBOARD_ROUTES.GET_ITEMS_BY_MONTH.replace(":month", month),
    );
    return res.data.data.data;
  } catch (error) {
    throw new Error("Failed to fetch items by month");
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
