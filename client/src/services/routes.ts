export const BASE_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

// Parent Routes
export const PARENT_ROUTES = {
  USERS: `${BASE_URL}/users`,
  USERS_POINTS: `${BASE_URL}/points`,
  ITEMS: `${BASE_URL}/items`,
  DONATION_EVENTS: `${BASE_URL}/donation-events`,
  DONATION_REQUESTS: `${BASE_URL}/donation-requests`,
  DONATION_REQUEST_ITEMS: `${BASE_URL}/donation-request-items`,
  IMAGES: `${BASE_URL}/images`,
  LOGIN: `${BASE_URL}/login`,
  DASHBOARD: `${BASE_URL}/dashboard`,
  CASHBACK: `${BASE_URL}/transaction-history`,
};

// User Routes
export const USER_ROUTES = {
  RETRIEVE_BY_EMAIL: `${PARENT_ROUTES.USERS}/:email`,
  ADMIN_LOGIN: `${PARENT_ROUTES.USERS}/allAdmins`,
  UPDATE_USER: `${PARENT_ROUTES.USERS}/update`,
  GET_ACCOUNT_TYPE: `${PARENT_ROUTES.USERS}/get-account-type`,
};

// User Points Routes 
export const USER_POINTS_ROUTES = {
  GET_USER_POINTS: `${PARENT_ROUTES.USERS_POINTS}/:id`,
  MAKE_REQUEST: `${PARENT_ROUTES.USERS_POINTS}/request`,
  ACCEPT_REQUEST: `${PARENT_ROUTES.USERS_POINTS}/accept-request`,
  REJECT_REQUEST: `${PARENT_ROUTES.USERS_POINTS}/reject-request`,
};

// Item Routes 
export const ITEM_ROUTES = {
  CREATE_ITEM: `${PARENT_ROUTES.ITEMS}/create`,
  RETRIEVE_ALL_ITEMS: `${PARENT_ROUTES.ITEMS}/all`,
  RETRIEVE_ITEMS_BY_EVENT_TYPE_ID: `${PARENT_ROUTES.ITEMS}/:eventId`,
};

// Event Type Routes
export const EVENT_TYPE_ROUTES = {
  GET_ALL: `${BASE_URL}/event-types/event-types`,
};

// Donation Event Routes
export const DONATION_EVENT_ROUTES = {
  GET_ALL: `${PARENT_ROUTES.DONATION_EVENTS}/all`,
  CREATE_EVENT: `${PARENT_ROUTES.DONATION_EVENTS}/create`,
  BY_ID: `${PARENT_ROUTES.DONATION_EVENTS}/:id`,
};

// Donation Request Routes
export const DONATION_REQUEST_ROUTES = {
  RETRIEVE_ACTIVE_DONATION_REQUESTS: `${PARENT_ROUTES.DONATION_REQUESTS}/active-donation-requests`,
  RETRIEVE_COMPLETED_DONATION_REQUESTS: `${PARENT_ROUTES.DONATION_REQUESTS}/completed-donation-requests`,
  RETRIEVE_ACTIVE_BY_DATE: `${PARENT_ROUTES.DONATION_REQUESTS}/retrieve-active-by-date`,
  RETRIEVE_BY_USER_ID: `${PARENT_ROUTES.DONATION_REQUESTS}/retrieve-by-user-id`,
  UPDATE_STATUS: `${PARENT_ROUTES.DONATION_REQUESTS}/complete`,
  CREATE: `${PARENT_ROUTES.DONATION_REQUESTS}/create`,
  UPDATE: `${PARENT_ROUTES.DONATION_REQUESTS}/update`,
};

// Donation Request Items Routes
export const DONATION_REQUEST_ITEMS_ROUTES = {
  DELETE: `${PARENT_ROUTES.DONATION_REQUEST_ITEMS}/delete`,
};

// Image Routes
export const IMAGE_ROUTES = {
  CREATE: `${PARENT_ROUTES.IMAGES}/`,
  UPDATE: `${PARENT_ROUTES.IMAGES}/:id`,
  RETRIEVE_BY_FILE_PATH: `${PARENT_ROUTES.IMAGES}/:filePath`,
};

// Dashboard Routes
export const DASHBOARD_ROUTES = {
  GET_POPULAR_EVENT: `${PARENT_ROUTES.DASHBOARD}/get-popular-event`,
  GET_POPULAR_ITEM: `${PARENT_ROUTES.DASHBOARD}/get-popular-item`,
  GET_DONATION_REQUESTS: `${PARENT_ROUTES.DASHBOARD}/get-donation-requests`,
  GET_EVENTS_BY_MONTH: `${PARENT_ROUTES.DASHBOARD}/get-events-by-month/:month`,
  GET_ITEMS_BY_MONTH: `${PARENT_ROUTES.DASHBOARD}/get-items-by-month/:month`,
  GET_PREFERRED_DROP_OFF: `${PARENT_ROUTES.DASHBOARD}/get-preferred-drop-off`,
  GET_CASHBACK_STATUS: `${PARENT_ROUTES.DASHBOARD}/get-cashback-status`,
};

// Transaction History Routes 
export const TRANSACTION_HISTORY_ROUTES = {
  GET_TRANS_HISTORY_BY_ACTION: `${PARENT_ROUTES.CASHBACK}/get-transaction-history`,
  GET_ALL_PENDING_REQUESTS: `${PARENT_ROUTES.CASHBACK}/pending-cashback-requests`,
};
