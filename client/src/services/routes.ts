const BASE_URL = process.env.REACT_APP_BACKEND_URL

// Parent Routes
export const PARENT_ROUTES = {
  USERS: `${BASE_URL}/users`,
  DONATION_EVENTS: `${BASE_URL}/donation-events`,
  DONATION_REQUESTS: `${BASE_URL}/donation-requests`,
  IMAGES: `${BASE_URL}/images`,
  LOGIN: `${BASE_URL}/login`
};

// Users Related Routes //
export const USER_ROUTES = {
  RETRIEVE_BY_EMAIL: `${PARENT_ROUTES.USERS}/:email`,
  ADMIN_LOGIN: `${PARENT_ROUTES.USERS}/allAdmins`,
  UPDATE_USER: `${PARENT_ROUTES.USERS}/update`,
}

// Image Related Routes //
export const IMAGE_ROUTES = {
  UPDATE: `${PARENT_ROUTES.IMAGES}/:id`,
  RETRIEVE_BY_FILE_PATH: `${PARENT_ROUTES.IMAGES}/:filePath`,
}

// Donation Request Routes //
export const DONATION_REQUEST_ROUTES = {
  RETRIEVE_ACTIVE_BY_DATE: `${PARENT_ROUTES.DONATION_REQUESTS}/retrieve-active-by-date`,
  UPDATE_STATUS: `${PARENT_ROUTES.DONATION_REQUESTS}/complete`,
  CREATE: `${PARENT_ROUTES.DONATION_REQUESTS}/create`,
};

// Donation Event-related routes //
export const DONATION_EVENT_ROUTES = {
  GET_ALL: `${PARENT_ROUTES.DONATION_EVENTS}/all`,
};

// Event Type-related routes //
export const EVENT_TYPE_ROUTES = {
  GET_ALL: `${BASE_URL}/event-types/event-types`,
}