import slugify from 'slugify';

export enum NavigationList {
  HOME = 'Home',
  ABOUT = 'About',
  CONTACT_US = 'Contact us',
  REWARD = 'Reward',
  PROFILE = 'Profile',
  CUSTOMER = 'Customer',
  DONATION = 'Donation',
  DONATION_EVENTS = 'Donation Events',
}

export enum ActionList {
  SIGN_IN = 'Sign in',
  SIGN_UP = 'Sign up',
  SIGN_OUT = 'Sign out',
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
  isAdmin: boolean
): NavigationListItemT => {
  const slugOptions = { lower: true };
  const prefix = isAdmin ? '/admin/' : '/';
  const slugifiedItem = slugify(item, slugOptions);
  return { item, path: `${prefix}${slugifiedItem}` };
};
