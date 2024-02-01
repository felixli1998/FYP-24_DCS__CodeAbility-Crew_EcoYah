import axios from "axios";

const URL = process.env.REACT_APP_BACKEND_URL + "/donation-events";

// Create a new donation event and donation event item(s)
export const createDonationEvent = async (donationEvent: any, adminID: number) => {
  try {
    const response = await axios.post(URL + "/create", {
      name: donationEvent.name,
      imageId: "https://picsum.photos/200/300", // use https://picsum.photos/200/300 to test to prevent the payload from being too large
      eventType: donationEvent.eventType,
      startDate: donationEvent.startDate,
      endDate: donationEvent.endDate,
      isActive: donationEvent.isActive,
      donationEventItems: donationEvent.donationEventItems,
      createdBy: adminID
    });
    return response.data;
  } catch (error) {
    console.error("Error creating donation event: ", error);
    throw new Error("Failed to create donation event");
  }
};