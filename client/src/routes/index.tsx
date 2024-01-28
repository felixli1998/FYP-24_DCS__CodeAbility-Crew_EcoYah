import {createBrowserRouter} from "react-router-dom";
import App from "../App";
import ErrorPage from "../pages/ErrorPage";
import Home from "../pages/Index";
import SignUp from "../pages/SignUp";
import SignIn from "../pages/SignIn";
import Profile from "../pages/Profile";
import EditProfile from "../pages/EditProfile";
import ImageComponentExample from "../pages/ImageComponentExample";
// import ContactUs from "../pages/ContactUs";

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
      {
        path: "/image-component-example",
        element: <ImageComponentExample />,
      },
      // {
      //   path: "/contactUs",
      //   element: <ContactUs />,
      // }
    ],
  },
]);

export default router;
