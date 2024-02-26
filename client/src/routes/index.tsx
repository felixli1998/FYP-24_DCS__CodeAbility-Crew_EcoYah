import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ErrorPage from "../pages/Donor/ErrorPage";
import { APP_ROUTES } from "./appRoutes";
import ProtectedRoute from "../utils/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: APP_ROUTES.map((route) => {
      let { path, element } = route;

      if (route.isAdmin) path = `/admin/${path}`;
      if (route.protected)
        element = <ProtectedRoute isAdmin={route.isAdmin} children={element} />;

      return {
        path,
        element,
      };
    }),
  },
]);

export default router;
