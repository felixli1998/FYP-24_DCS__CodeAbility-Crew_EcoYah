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

// Donation Event-related routes //
export const DONATION_EVENT_ROUTES = {
  GET_ALL: `${BASE_URL}/donation-events/all`,
};

// Event Type-related routes //
export const EVENT_TYPE_ROUTES = {
  GET_ALL: `${BASE_URL}/event-types/event-types`,
}