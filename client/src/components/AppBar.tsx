import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import TemporaryDrawer from './Drawer';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import logo from '../assets/Kunyah.png';
import { useEffect, useReducer } from 'react';
import {
  NavigationList,
  ActionList,
  generateNavItem,
  NavigationListItemT,
} from '../utils/NavBar';

type ActionReducerT = {
  authenticated: boolean;
  admin: boolean;
};

function ResponsiveAppBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const defaultNavigationList: NavigationListItemT[] = [];
  const defaultActionList: NavigationListItemT[] = [];

  // TODO: Let's refactor this subsequently using useContext
  const handleLogOut = () => {
    localStorage.removeItem('ecoyah-email');
    navigate('/');
  };

  const navigationReducer = (
    state: NavigationListItemT[],
    action: ActionReducerT
  ): NavigationListItemT[] => {
    const { authenticated, admin } = action;

    if (authenticated) {
      if (admin) {
        const NavList = [
          NavigationList.CUSTOMER,
          NavigationList.DONATION_EVENTS,
          NavigationList.DONATION,
        ];
        return NavList.map((navItem) => generateNavItem(navItem, true));
      } else {
        const NavList = [
          NavigationList.HOME,
          NavigationList.REWARD,
          NavigationList.PROFILE,
        ];
        return NavList.map((navItem) => generateNavItem(navItem, false));
      }
    } else {
      if (admin) {
        return [];
      } else {
        const NavList = [NavigationList.CONTACT_US, NavigationList.ABOUT];
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
      return [{ item: ActionList.SIGN_OUT, action: handleLogOut }];

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

    return currentPath.includes('admin');
  };

  // TODO: Let's refactor this subsequently using useContext
  const isAuthenticated = () => {
    const email = localStorage.getItem('ecoyah-email');

    if (email) return true;

    return false;
  };

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
    <AppBar position='static' color='default'>
      <Container maxWidth='xl'>
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Link to={'/'}>
            <Box
              component='img'
              sx={{
                m: 'auto',
                marginTop: 2,
                width: '5rem',
                height: '5rem',
              }}
              alt='Kunyah'
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
