import { useState, useEffect, Fragment } from 'react';
import {
  Box,
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Link, useNavigate } from 'react-router-dom';
import slugify from 'slugify';
import { navigationListItemT } from '../utils/NavBar';

type DrawerListProps = {
  topDrawerList: navigationListItemT[];
  bottomDrawerList: string[];
};

function TemporaryDrawer({ topDrawerList, bottomDrawerList }: DrawerListProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  const handleLogOut = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('ecoyah-email');
    navigate('/');
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem('ecoyah-email') || '';

    if (storedEmail !== '') {
      setIsLoggedIn(true);
    }
  }, [localStorage.getItem('ecoyah-email')]);

  const list = () => (
    <Box
      role='presentation'
      onClick={() => setIsDrawerOpen(true)}
      sx={{
        width: 150,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      }}
    >
      <List>
        {topDrawerList.map((navItem, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton>
              <Link to={navItem.path}>
                <ListItemText primary={navItem.item} />
              </Link>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List>
        <Divider />
        {!isLoggedIn ? (
          bottomDrawerList.slice(0, 2).map(function (label, i) {
            return (
              <ListItem disablePadding key={i}>
                <Button
                  sx={{ marginX: 2, marginY: 2 }}
                  variant='outlined'
                  fullWidth={true}
                >
                  <Link
                    to={`/${slugify(bottomDrawerList[i], {
                      lower: true,
                    })}`}
                  >
                    {bottomDrawerList[i]}
                  </Link>
                </Button>
              </ListItem>
            );
          })
        ) : (
          <ListItem disablePadding>
            <Button
              sx={{ marginX: 2, marginY: 2 }}
              variant='outlined'
              fullWidth={true}
              onClick={handleLogOut}
            >
              {bottomDrawerList[2]}
            </Button>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <Fragment>
        <IconButton onClick={() => setIsDrawerOpen(true)}>
          <MenuIcon></MenuIcon>
        </IconButton>
        <Drawer
          anchor={'right'}
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        >
          <IconButton
            disableRipple={true}
            onClick={() => setIsDrawerOpen(false)}
            sx={{ justifyContent: 'flex-end' }}
          >
            <CloseIcon></CloseIcon>
          </IconButton>
          <Divider />
          {list()}
        </Drawer>
      </Fragment>
    </>
  );
}

export default TemporaryDrawer;
