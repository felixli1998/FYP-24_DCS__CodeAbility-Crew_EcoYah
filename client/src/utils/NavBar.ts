import slugify from "slugify";

export enum NavigationList {
  HOME = "Home",
  CONTACT_US = "Contact us",
  REWARD = "Reward",
  PROFILE = "Profile",
  DONATION = "Donation",
  DONATION_EVENT_FORM = "Donation Event Form",
  DONATION_EVENT_OVERVIEW = "Donation Event Overview",
  DONATION_REQUEST = "Donation Requests",
  DONATION_EVENTS = "Donation Events",
  CASHBACK_REQUEST = "Cashback Requests",
  DASHBOARD = "Dashboard",
}

export enum ActionList {
  SIGN_IN = "Sign in",
  SIGN_UP = "Sign up",
  SIGN_OUT = "Sign out",
}

export type NavigationListItemT = {
  item: NavigationList | ActionList;
  path?: string;
  action?: () => void;
};

// Takes in a NavigationList or ActionList
// slugifies it and depending if it's admin, it will add the relevant prefix
// returns the item and the path { 'Contact', '/contact'}
export const generateNavItem = (
  item: NavigationList | ActionList,
  isAdmin: boolean,
): NavigationListItemT => {
  const slugOptions = { lower: true };
  const prefix = isAdmin ? "/admin/" : "/";
  const slugifiedItem = item === "Home" ? "" : slugify(item, slugOptions);
  return { item, path: `${prefix}${slugifiedItem}` };
};
