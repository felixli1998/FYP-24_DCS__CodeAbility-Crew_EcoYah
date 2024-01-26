import {createBrowserRouter} from "react-router-dom";
import App from "../App";
import ErrorPage from "../pages/ErrorPage";
import Home from "../pages/Index";
import SignUp from "../pages/SignUp";
import SignIn from "../pages/SignIn";
import Profile from "../pages/Profile";
import EditProfile from "../pages/EditProfile";
// import ContactUs from "../pages/ContactUs";
import DonationEventForm from "../pages/DonationEventForm";
import DonationEventPreview from "../pages/DonationEventPreview";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/sign-up",
        element: <SignUp />,
      },
      {
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/edit-profile",
        element: <EditProfile />,
      },
      // {
      //   path: "/contactUs",
      //   element: <ContactUs />,
      // }
      {
        path: "/admin/donation-event-form",
        element: <DonationEventForm />,
      }, 
      {
        path: "/admin/donation-event-preview",
        element: <DonationEventPreview />,
      }
    ],
  },
]);

export default router;
