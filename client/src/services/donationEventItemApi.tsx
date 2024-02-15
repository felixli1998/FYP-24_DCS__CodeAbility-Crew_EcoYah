import axios from "axios";

const URL = process.env.REACT_APP_BACKEND_URL + "/donation-event-item";

export const getDonationEventItemsByDonationId = async (donationEventId: number) => {
  try {
    console.log(URL + "/items-by-donation-event-id")
    const response = await axios.get(URL + "/items-by-donation-event-id", {
        params: {
            donationEventId: donationEventId
        }
    });
    console.log(response)
    return response.data;
  } catch (error) {
    console.error("Error fetching donation event items: ", error);
    throw new Error("Failed to fetch donation event items");
  }
}