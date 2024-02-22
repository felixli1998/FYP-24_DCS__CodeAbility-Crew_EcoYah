import axios from "axios";

const URL = process.env.REACT_APP_BACKEND_URL + "/donation-requests";

export const retrieveDonationReqCountByEventId = async (donationEventId: number) => {
  try {
    const response = await axios.get(URL + "/retrieve-donation-request-count-by-event-id", {
      params: {
        donationEventId: donationEventId
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching donation requests: ", error);
    throw new Error("Failed to fetch donation requests");
  }
}