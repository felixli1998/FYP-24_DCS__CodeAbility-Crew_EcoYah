import axios from 'axios';
import { ADMIN_ROUTES } from './routes';
const URL = process.env.REACT_APP_BACKEND_URL + '/donation-events';

// Create a new donation event and donation event item(s)
export const createDonationEvent = async (
  donationEvent: any,
  adminID: number
) => {
  try {
    const response = await axios.post(URL + '/create', {
      name: donationEvent.name,
      imageId: 'https://picsum.photos/200/300', // use https://picsum.photos/200/300 to test to prevent the payload from being too large
      eventType: donationEvent.eventType,
      startDate: donationEvent.startDate,
      endDate: donationEvent.endDate,
      isActive: donationEvent.isActive,
      donationEventItems: donationEvent.donationEventItems,
      createdBy: adminID,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating donation event: ', error);
    throw new Error('Failed to create donation event');
  }
};

// Get all donation event
export const getDonationEvents = async () => {
  try {
    const response = await axios.get(ADMIN_ROUTES.RETRIEVE_DONATION_EVENTS);
    return response.data.data; // change this later to response.data for pagination data
  } catch (error) {
    console.error('Error fetching donation event: ', error);
    throw new Error('Failed to donation event');
  }
};

// Get a donation event by id
export const getDonationEventById = async (donationEventId: number) => {
  try {
    const response = await axios.get(
      ADMIN_ROUTES.RETRIEVE_DONATION_EVENT_BY_ID,
      {
        params: {
          id: donationEventId,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching donation event: ', error);
    throw new Error('Failed to donation event');
  }
};

// Update Donation Event by Id
export const updateDonationEventById = async (
  donationEventId: string,
  updateParams: any
) => {
  try {
    const response = await axios.put(
      ADMIN_ROUTES.UPDATE_DONATION_EVENT_BY_ID.replace(':id', donationEventId),
      {
        updateParams,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching donation event: ', error);
    throw new Error('Failed to donation event');
  }
};
