import {createBrowserRouter} from "react-router-dom";
import App from "../App";
import ErrorPage from "../pages/ErrorPage";
import SignUp from "../pages/SignUp";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        //   path: "contacts/:contactId",
        //   element: <Contact />,
      },
    ],
  },
]);

export default router;
