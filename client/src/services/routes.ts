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

// Admin Related Routes //
export const ADMIN_ROUTES = {
  RETRIEVE_DONATION_EVENTS: `${BASE_URL}/donation-events/all`,
  RETRIEVE_DONATION_EVENT_BY_ID: `${BASE_URL}/donation-events/:id`,
  UPDATE_DONATION_EVENT_BY_ID: `${BASE_URL}/donation-events/:id`
}