const BASE_URL = process.env.REACT_APP_BACKEND_URL

// Users Related Routes //
export const USER_ROUTES = {
  RETRIEVE_BY_EMAIL: `${BASE_URL}/users/:email`,
  CREATE_USER: `${BASE_URL}/users`,
  ADMIN_LOGIN: `${BASE_URL}/users/allAdmins`,
  UPDATE_USER: `${BASE_URL}/users/update`,
}

// General Related Routes //
export const GENERAL_ROUTES = {
  LOGIN: `${BASE_URL}/login`,
}

// Image Related Routes //
export const IMAGE_ROUTES = {
  UPDATE: `${BASE_URL}/images/:id`,
  RETRIEVE_BY_FILE_PATH: `${BASE_URL}/images/:filePath`,
}

// ITEM Related Routes //
export const ITEM_ROUTES = {
  CREATE_ITEM: `${BASE_URL}/items/create`,
  RETRIEVE_ALL_ITEMS: `${BASE_URL}/items/all`,
  RETRIEVE_ITEMS_BY_EVENT_TYPE_ID: `${BASE_URL}/items/:eventId`
}

// DONATION EVENT Related Routes //
export const DONATION_EVENT_ROUTES = {
  GET_ALL: `${BASE_URL}/donation-events/all`,
  CREATE_EVENT: `${BASE_URL}/donation-events/create`,
  RETRIEVE_DONATION_EVENTS: `${BASE_URL}/donation-events/all`,
  RETRIEVE_DONATION_EVENT_BY_ID: `${BASE_URL}/donation-events/:id`,
  UPDATE_DONATION_EVENT_BY_ID: `${BASE_URL}/donation-events/:id`
}

// Donation Request Routes //
export const DONATION_REQUEST_ROUTES = {
  RETRIEVE_ACTIVE_DONATION_REQUESTS: `${BASE_URL}/donation-requests/active-donation-requests`,
  RETRIEVE_COMPLETED_DONATION_REQUESTS: `${BASE_URL}/donation-requests/completed-donation-requests`,
  RETRIEVE_ACTIVE_BY_DATE: `${BASE_URL}/donation-requests/retrieve-active-by-date`,
  UPDATE_STATUS: `${BASE_URL}/donation-requests/complete`,
  CREATE: `${BASE_URL}/donation-requests/create`,
};

// Event Type-related routes //
export const EVENT_TYPE_ROUTES = {
  GET_ALL: `${BASE_URL}/event-types/event-types`,
}