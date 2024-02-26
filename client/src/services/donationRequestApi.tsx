import axios from "axios";
import { DONATION_REQUEST_ROUTES } from "./routes";

// Get all active donation requests by user
export const getActiveDonationRequests = async (userId: number) => {
  try {
    const response = await axios.get(
      DONATION_REQUEST_ROUTES.RETRIEVE_ACTIVE_DONATION_REQUESTS,
      {
        params: {
          userId: userId,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching event types: ", error);
    throw new Error("Failed to fetch event types");
  }
};

// Get all completed donation requests by user
export const getCompletedDonationRequests = async (userId: number) => {
  try {
    const response = await axios.get(
      DONATION_REQUEST_ROUTES.RETRIEVE_COMPLETED_DONATION_REQUESTS,
      {
        params: {
          userId: userId,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching event types: ", error);
    throw new Error("Failed to fetch event types");
  }
};

const URL = process.env.REACT_APP_BACKEND_URL + "/donation-requests";

export const retrieveDonationReqCountByEventId = async (
  donationEventId: number,
) => {
  try {
    const response = await axios.get(
      URL + "/retrieve-donation-request-count-by-event-id",
      {
        params: {
          donationEventId: donationEventId,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching donation requests: ", error);
    throw new Error("Failed to fetch donation requests");
  }
};
