import axios from "axios";
import { DASHBOARD_ROUTES } from "./routes";
import dayjs, { Dayjs } from "dayjs";

export const getPopularEvent = async () => {
  try {
    const res = await axios.get(DASHBOARD_ROUTES.GET_POPULAR_EVENT);
    return res.data.data.data;
  } catch (error) {
    throw new Error("Failed to fetch popular event");
  }
};

export const getPopularItem = async () => {
  try {
    const res = await axios.get(DASHBOARD_ROUTES.GET_POPULAR_ITEM);
    return res.data.data.data;
  } catch (error) {
    throw new Error("Failed to fetch popular item");
  }
};

export const getDonationRequests = async () => {
  try {
    const res = await axios.get(DASHBOARD_ROUTES.GET_DONATION_REQUESTS);
    return res.data.data.data;
  } catch (error) {
    throw new Error("Failed to fetch donation requests");
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

export const getCashbackStatus = async () => {
  try {
    const res = await axios.get(DASHBOARD_ROUTES.GET_CASHBACK_STATUS);
    return res.data.data.data;
  } catch (error) {
    throw new Error("Failed to fetch cashback status data");
  }
};

export const getRedeemedCashback = async (startDate: Dayjs, endDate: Dayjs) => {
  const formattedStartDate = dayjs(startDate).startOf("day");
  const formattedEndDate = dayjs(endDate).endOf("day");

  try {
    const res = await axios.post(DASHBOARD_ROUTES.GET_REDEEMED_CASHBACK, {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    });
    return res.data.data.data;
  } catch (error) {
    throw new Error("Failed to fetch redeeemed cashback data");
  }
};
