import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import ErrorPage from '../pages/ErrorPage';
import { APP_ROUTES } from './appRoutes';
// import ContactUs from "../pages/ContactUs";

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: APP_ROUTES.map((route) => {
      let { path, element } = route;
      if (route.isAdmin) path = `/admin/${path}`;

      return {
        path,
        element,
      };
    }),
  },
]);

export default router;
