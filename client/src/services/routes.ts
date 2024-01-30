const BASE_URL = process.env.REACT_APP_BACKEND_URL

// Users Related Routes //
export const USER_ROUTES = {
  retrieveUserByEmail: `${BASE_URL}/users/:email`
}
