// React Imports
import { useState, useEffect, useReducer } from "react";

// MUI Imports
import { AppBar, Container, Toolbar, Box } from "@mui/material";

// Image
import logo from "../../assets/Kunyah.png";

// Components
import TemporaryDrawer from "./Drawer";

// Other Imports
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  NavigationList,
  ActionList,
  generateNavItem,
  NavigationListItemT,
} from "../../utils/NavBar";
import { User } from '../../utils/Types';
import Cookies from "js-cookie";
import { decodeToken } from "../../utils/Common";

type ActionReducerT = {
  authenticated: boolean;
  admin: boolean;
};

function ResponsiveAppBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User>({
    id: 0,
    email: '',
    name: '',
    imageId: 0,
    role: ''
  });

  const defaultNavigationList: NavigationListItemT[] = [];
  const defaultActionList: NavigationListItemT[] = [];

  // TODO: Let's refactor this subsequently using useContext
  const handleLogOut = () => {
    Cookies.remove('token');
    navigate("/sign-in");
    navActionLogicMap(); // handle use case if there's no change in the URL
  };

  const handleAdminLogOut = () => {
    Cookies.remove('token');
    navigate("/admin/sign-in");
    navActionLogicMap(); // handle use case if there's no change in the URL
  };

  const navigationReducer = (
    state: NavigationListItemT[],
    action: ActionReducerT
  ): NavigationListItemT[] => {
    const { authenticated, admin } = action;

    if (authenticated) {
      if (admin) {
        // Admin + Authenticated //
        const NavList = [
          NavigationList.HOME,
          NavigationList.DONATION_EVENT_FORM,
          NavigationList.DONATION_EVENT_OVERVIEW,
          NavigationList.REWARD,
          NavigationList.DONATION_REQUEST,
        ];
        return NavList.map((navItem) => generateNavItem(navItem, true));
      } else {
        // Donor + Authenticated //
        const NavList = [
          NavigationList.HOME,
          NavigationList.REWARD,
          NavigationList.PROFILE,
          NavigationList.CONTACT_US,
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
          NavigationList.REWARD,
          NavigationList.CONTACT_US,
        ];
        return NavList.map((navItem) => generateNavItem(navItem, false));
      }
    }
  };

  const actionReducer = (
    state: NavigationListItemT[],
    action: ActionReducerT
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
        (actionItem) => actionItem !== ActionList.SIGN_UP // Admin does not have a sign up
      ).map((actionItem) => generateNavItem(actionItem, admin));
    } else {
      return ActionItemList.map((actionItem) =>
        generateNavItem(actionItem, admin)
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

  // TODO: Let's refactor this subsequently using useContext
  const isAuthenticated = () => {
    const token = Cookies.get('token');
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken) {
        const payload = {
          id: decodedToken.id,
          email: decodedToken.email,
          name: decodedToken.name,
          imageId: decodedToken.imageId,
          role: decodedToken.role
        }
        setUser(payload);
        return true;
      }
    }

    return false;
  };

  const handleRedirection = () => {
    if (user.role === 'admin') {
      navigate('/admin/home');
    } else {
      navigate('/');
    }
  }

  const navActionLogicMap = () => {
    const authenticated = isAuthenticated();
    const admin = isAdmin();

    dispatchNav({ authenticated, admin });
    dispatchAction({ authenticated, admin });
  };

  useEffect(() => {
    navActionLogicMap();
  }, [location.pathname]);

  return (
    <AppBar position="static" color="default">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          <Link to='#' onClick={handleRedirection}>
            <Box
              component="img"
              sx={{
                m: "auto",
                marginTop: 2,
                width: "5rem",
                height: "5rem",
              }}
              alt="Kunyah"
              src={logo}
            ></Box>
          </Link>

          <TemporaryDrawer
            topDrawerList={navigationList}
            bottomDrawerList={actionList}
          ></TemporaryDrawer>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
