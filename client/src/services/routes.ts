const BASE_URL = process.env.REACT_APP_BACKEND_URL

// Users Related Routes //
export const USER_ROUTES = {
  RETRIEVE_BY_EMAIL: `${BASE_URL}/users/:email`
}

// General Related Routes //
export const GENERAL_ROUTES = {
  LOGIN: `${BASE_URL}/login`,
}

// Image Related Routes //
export const IMAGE_ROUTES = {
  UPDATE: `${BASE_URL}/images/:id`,
}