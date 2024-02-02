import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import TemporaryDrawer from './Drawer';
import { Link, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import logo from '../assets/Kunyah.png';
import { useEffect, useReducer } from 'react';
import { NavigationList, ActionList, generateNavItem } from '../utils/NavBar';

type navigationListItemT = {
  item: NavigationList | ActionList;
  path: string;
};

function ResponsiveAppBar() {
  const location = useLocation();

  const defaultNavigationList: navigationListItemT[] = [];
  const defaultActionList: ActionList[] = [
    ActionList.SIGN_IN,
    ActionList.SIGN_UP,
    ActionList.SIGN_OUT,
  ];

  const navigationReducer = (
    state: navigationListItemT[],
    action: any
  ): navigationListItemT[] => {
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
        return NavList.map((navItem) => generateNavItem(navItem, true));
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

  const actionReducer = (state: ActionList[], action: any) => {
    const { authenticated } = action;
    if (authenticated) return [ActionList.SIGN_OUT];

    return [ActionList.SIGN_IN, ActionList.SIGN_UP];
  };

  const [navigationList, dispatchNav] = useReducer<
    React.Reducer<navigationListItemT[], any>
  >(navigationReducer, defaultNavigationList);

  const [actionList, dispatchAction] = useReducer(
    actionReducer,
    defaultActionList
  );

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
                width: '4rem',
                height: '4rem',
                borderRadius: '100%',
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
