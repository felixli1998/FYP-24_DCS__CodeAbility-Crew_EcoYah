import { useState, useEffect, useReducer } from "react";
import { AppBar, Toolbar } from "@mui/material";
import TemporaryDrawer from "./Drawer";
import logo from "../../assets/Kunyah.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  NavigationList,
  ActionList,
  generateNavItem,
  NavigationListItemT,
} from "../../utils/NavBar";

type ActionReducerT = {
  authenticated: boolean;
  admin: boolean;
};

// TODO: Let's refactor this subsequently using useContext
export const isAuthenticated = () => {
  const email = localStorage.getItem("ecoyah-email");

  if (email) return true;

  return false;
};

function ResponsiveAppBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [homePath, setHomePath] = useState<string>("/");

  const defaultNavigationList: NavigationListItemT[] = [];
  const defaultActionList: NavigationListItemT[] = [];

  // TODO: Let's refactor this subsequently using useContext
  const handleLogOut = () => {
    localStorage.removeItem("ecoyah-id");
    localStorage.removeItem("ecoyah-email");
    navigate("/sign-in");
    navActionLogicMap(); // handle use case if there's no change in the URL
  };

  const handleAdminLogOut = () => {
    localStorage.removeItem("ecoyah-email");
    localStorage.removeItem("admin-id");
    navigate("/admin/sign-in");
    navActionLogicMap(); // handle use case if there's no change in the URL
  };

  const navigationReducer = (
    state: NavigationListItemT[],
    action: ActionReducerT,
  ): NavigationListItemT[] => {
    const { authenticated, admin } = action;

    if (authenticated) {
      if (admin) {
        // Admin + Authenticated //
        const NavList = [
          NavigationList.DONATION_EVENTS,
          NavigationList.DONATION_REQUEST,
          NavigationList.CASHBACK_REQUEST,
          NavigationList.DASHBOARD,
        ];
        return NavList.map((navItem) => generateNavItem(navItem, true));
      } else {
        // Donor + Authenticated //
        const NavList = [
          NavigationList.HOME,
          NavigationList.PROFILE,
          NavigationList.DONATION_REQUEST,
          NavigationList.ABOUT_US,
          NavigationList.FAQ,
        ];
        return NavList.map((navItem) => generateNavItem(navItem, false));
      }
    } else {
      if (admin) {
        // Admin + Unauthenticated //
        return [];
      } else {
        // Donor + Unauthenticated //
        const NavList = [
          NavigationList.HOME,
          NavigationList.ABOUT_US,
          NavigationList.FAQ,
        ];
        return NavList.map((navItem) => generateNavItem(navItem, false));
        // return [];
      }
    }
  };

  const actionReducer = (
    state: NavigationListItemT[],
    action: ActionReducerT,
  ): NavigationListItemT[] => {
    const { authenticated, admin } = action;
    // TODO: I am assuming that the handleLogOut function is standard across Admin and Donor. Let's refactor this subsequently
    if (authenticated)
      return [
        {
          item: ActionList.SIGN_OUT,
          action: admin ? handleAdminLogOut : handleLogOut,
        },
      ];

    const ActionItemList = [ActionList.SIGN_IN, ActionList.SIGN_UP];

    if (admin) {
      return ActionItemList.filter(
        (actionItem) => actionItem !== ActionList.SIGN_UP, // Admin does not have a sign up
      ).map((actionItem) => generateNavItem(actionItem, admin));
    } else {
      return ActionItemList.map((actionItem) =>
        generateNavItem(actionItem, admin),
      );
    }
  };

  const [navigationList, dispatchNav] = useReducer<
    React.Reducer<NavigationListItemT[], ActionReducerT>
  >(navigationReducer, defaultNavigationList);

  const [actionList, dispatchAction] = useReducer<
    React.Reducer<NavigationListItemT[], ActionReducerT>
  >(actionReducer, defaultActionList);

  // TODO: Let's refactor this subsequently using useContext or token
  const isAdmin = () => {
    const currentPath = location.pathname;

    return currentPath.includes("admin");
  };

  const navActionLogicMap = () => {
    const authenticated = isAuthenticated();
    const admin = isAdmin();

    dispatchNav({ authenticated, admin });
    dispatchAction({ authenticated, admin });
  };

  useEffect(() => {
    navActionLogicMap();

    if (isAdmin()) {
      setHomePath(
        isAuthenticated() ? "/admin/donation-events" : "/admin/sign-in",
      );
    } else {
      setHomePath("/");
    }
  }, [location.pathname]);

  return (
    <AppBar position="sticky" color="inherit" elevation={1}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Link to={homePath}>
          <img
            width="10%"
            height="100%"
            srcSet={logo}
            src={logo}
            alt={"Home"}
            loading="lazy"
            style={{ verticalAlign: "middle" }}
          />
        </Link>

        <TemporaryDrawer
          topDrawerList={navigationList}
          bottomDrawerList={actionList}
        ></TemporaryDrawer>
      </Toolbar>
    </AppBar>
  );
}
export default ResponsiveAppBar;
