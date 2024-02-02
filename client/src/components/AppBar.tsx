import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import TemporaryDrawer from './Drawer';
import { Link, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import logo from '../assets/Kunyah.png';
import { useEffect, useReducer } from 'react';

export enum NavigationList {
  HOME = 'Home',
  ABOUT = 'About',
  CONTACT_US = 'Contact us',
  REWARD = 'Reward',
  PROFILE = 'Profile',
  CUSTOMER = 'Customer',
  DONATION = 'Donation',
  DONATION_EVENTS = 'Donation Events',
}

export enum ActionList {
  SIGN_IN = 'Sign in',
  SIGN_UP = 'Sign up',
  SIGN_OUT = 'Sign out',
}

function ResponsiveAppBar() {
  const location = useLocation();

  const defaultNavigationList: NavigationList[] = [];
  const defaultActionList: ActionList[] = [
    ActionList.SIGN_IN,
    ActionList.SIGN_UP,
    ActionList.SIGN_OUT,
  ];

  const navigationReducer = (state: NavigationList[], action: any) => {
    const { authenticated, admin } = action;

    if (authenticated) {
      if (admin) {
        return [
          NavigationList.CUSTOMER,
          NavigationList.DONATION_EVENTS,
          NavigationList.DONATION,
        ];
      } else {
        return [
          NavigationList.HOME,
          NavigationList.REWARD,
          NavigationList.PROFILE,
        ];
      }
    } else {
      if (admin) {
        return [];
      } else {
        return [NavigationList.CONTACT_US, NavigationList.ABOUT];
      }
    }
  };

  const actionReducer = (state: ActionList[], action: any) => {
    const { authenticated } = action;
    if (authenticated) return [ActionList.SIGN_OUT];

    return [ActionList.SIGN_IN, ActionList.SIGN_UP];
  };

  const [navigationList, dispatchNav] = useReducer(
    navigationReducer,
    defaultNavigationList
  );

  const [actionList, dispatchAction] = useReducer(
    actionReducer,
    defaultActionList
  );

  const isAdmin = () => {
    const currentPath = location.pathname;

    return currentPath.includes('admin');
  };

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
