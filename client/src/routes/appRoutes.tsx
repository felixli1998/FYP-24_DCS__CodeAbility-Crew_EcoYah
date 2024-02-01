import Home from '../pages/Index';
import SignUp from '../pages/SignUp';
import SignIn from '../pages/SignIn';
import Profile from '../pages/Profile';
import EditProfile from '../pages/EditProfile';
import ImageComponentExample from '../pages/ImageComponentExample';

type AppRoutesT = {
  path: string;
  description: string;
  element: JSX.Element;
  isAdmin: boolean;
};

export const APP_ROUTES: AppRoutesT[] = [
  {
    path: '',
    description: 'Generic landing page for donor',
    element: <Home />,
    isAdmin: false,
  },
  {
    path: 'sign-up',
    description: 'Sign up page for the donor',
    element: <SignUp />,
    isAdmin: false,
  },
  {
    path: 'sign-in',
    description: 'Sign in page for the donor',
    element: <SignIn />,
    isAdmin: false,
  },
  {
    path: 'profile',
    description: 'Profile page for the donor',
    element: <Profile />,
    isAdmin: false,
  },
  {
    path: 'edit-profile',
    description: 'Edit profile page for the donor',
    element: <EditProfile />,
    isAdmin: false,
  },
  {
    path: 'image-component-example',
    description: 'Image component example page for the donor',
    element: <ImageComponentExample />,
    isAdmin: false,
  },
];
