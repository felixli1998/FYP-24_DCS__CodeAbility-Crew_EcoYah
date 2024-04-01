// Donor routes //
import Home from "../pages/Donor/Index";
import SignUp from "../pages/Donor/SignUp";
import SignIn from "../pages/Donor/SignIn";
import Profile from "../pages/Donor/Profile";
import EditProfile from "../pages/Donor/EditProfile";
import ImageComponentExample from "../pages/Donor/ImageComponentExample";
import { DonorHome } from "../pages/Donor/DonorHome";
import DonationRequestForm from "../pages/Donor/DonationRequestForm";
import Faq from "../pages/Donor/Faq";
import AboutUs from "../pages/Donor/AboutUs";
import CashbackRedemption from "../pages/Donor/CashbackRedemption";
import CashbackHistory from "../pages/Donor/CashbackHistory";

// Admin routes //
import AdminHome from "../pages/Admin/AdminHome";
import AdminSignIn from "../pages/Admin/SignIn";
import DonationEventForm from "../pages/Admin/DonationEventForm";
import DonationEvent from "../pages/Admin/DonationEvent";
import DonationEventsAdmin from "../pages/Admin/DonationEventsAdmin";
import DonationRequests from "../pages/Admin/DonationRequests";
import { DonationRequest } from "../pages/Donor/DonationRequest";
import LongPolling from "../pages/LongPollingPage";
import CashbackRequests from "../pages/Admin/CashbackRequests";
import Dashboard from "../pages/Admin/Dashboard";
import Leaderboard from "../pages/Donor/Leaderboard";

type AppRoutesT = {
  path: string;
  description: string; // for developers to understand what this route is for
  element: JSX.Element;
  isAdmin: boolean; // all admin routes are prefixed with /admin
  protected?: boolean; // if true, it checks if the user credential is authorized to enter this page
};

export const ADMIN_PREFIX = "admin";

export const APP_ROUTES: AppRoutesT[] = [
  {
    path: "",
    description: "Generic landing page for unauthenticated donor",
    element: <Home />,
    isAdmin: false,
  },
  {
    path: "sign-up",
    description: "Sign up page for the donor",
    element: <SignUp />,
    isAdmin: false,
  },
  {
    path: "sign-in",
    description: "Sign in page for the donor",
    element: <SignIn />,
    isAdmin: false,
  },
  {
    path: "profile",
    description: "Profile page for the donor",
    element: <Profile />,
    isAdmin: false,
    protected: true,
  },
  {
    path: "edit-profile",
    description: "Edit profile page for the donor",
    element: <EditProfile />,
    isAdmin: false,
    protected: true,
  },
  {
    path: "image-component-example",
    description: "Image component example page for the donor",
    element: <ImageComponentExample />,
    isAdmin: false,
  },
  {
    path: "home",
    description: "Home page for authenticated admin",
    element: <AdminHome />,
    isAdmin: true,
    protected: true,
  },
  {
    path: "home",
    description: "Home page for authenticated donor",
    element: <DonorHome />,
    isAdmin: false,
    protected: true,
  },
  {
    path: "sign-in",
    description: "Sign in page for the admin",
    element: <AdminSignIn />,
    isAdmin: true,
  },
  {
    path: "donation-requests",
    description: "View donation requests for authenticated donor",
    element: <DonationRequest />,
    isAdmin: false,
    protected: true,
  },
  {
    path: "donation-event-form",
    description: "Creation of donation event form for the admin",
    element: <DonationEventForm />,
    isAdmin: true,
    protected: true,
  },
  {
    path: "donation-event/:donationEventId",
    description: "View & Edit of donation event for the admin",
    element: <DonationEvent />,
    isAdmin: true,
    protected: true,
  },
  {
    path: "donation-requests",
    description: "Preview of donation requests for the admin",
    element: <DonationRequests />,
    isAdmin: true,
    protected: true,
  },
  {
    path: "donation-request-form/:id/:name",
    description: "Submission of donation request form for the donor",
    element: <DonationRequestForm />,
    isAdmin: false,
    protected: true,
  },
  {
    path: "donation-events",
    description: "View all donation events for the admin",
    element: <DonationEventsAdmin />,
    isAdmin: true,
    protected: true,
  },
  {
    path: "long-polling",
    description: "Long polling tests",
    element: <LongPolling />,
    isAdmin: false,
  },
  {
    path: "cashback-requests",
    description: "View all Cashback Requests for the admin",
    element: <CashbackRequests />,
    isAdmin: true,
  },
  {
    path: "dashboard",
    description: "View all statistics for the admin",
    element: <Dashboard />,
    isAdmin: true,
  },
  {
    path: "faq",
    description: "View all FAQ Related for the donor",
    element: <Faq />,
    isAdmin: false,
  },
  {
    path: "about-us",
    description: "View all about kunyah Related for the donor",
    element: <AboutUs />,
    isAdmin: false,
  },
  {
    path: "cashback-redemption",
    description: "Donor redeem cashback form page.",
    element: <CashbackRedemption />,
    isAdmin: false,
  },
  {
    path: "cashback-history",
    description: "Cashback history page for the donor",
    element: <CashbackHistory />,
    isAdmin: false,
    protected: true,
  },
  {
    path: "leaderboard",
    description: "Leaderboard",
    element: <Leaderboard />,
    isAdmin: false,
    protected: false,
  },
];
