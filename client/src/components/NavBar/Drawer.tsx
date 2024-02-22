import { useState, Fragment } from "react";
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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import { NavigationListItemT } from "../../utils/NavBar";

type DrawerListProps = {
  topDrawerList: NavigationListItemT[];
  bottomDrawerList: NavigationListItemT[];
};

function TemporaryDrawer({ topDrawerList, bottomDrawerList }: DrawerListProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const BottomList = () => {
    return bottomDrawerList.map((actionItem, idx) => {
      if (actionItem.path) {
        return (
          <ListItem key={idx} disablePadding>
            <Button
              sx={{ marginX: 2, marginY: 2 }}
              variant="outlined"
              fullWidth={true}
            >
              <Link to={actionItem.path}>
                <ListItemText primary={actionItem.item} />
              </Link>
            </Button>
          </ListItem>
        );
      }

      if (actionItem.action) {
        return (
          <ListItem key={idx} disablePadding>
            <Button
              sx={{ marginX: 2, marginY: 2 }}
              variant="outlined"
              fullWidth={true}
              onClick={actionItem.action}
            >
              {actionItem.item}
            </Button>
          </ListItem>
        );
      }

      return null;
    });
  };

  const list = () => (
    <Box
      role="presentation"
      onClick={() => setIsDrawerOpen(true)}
      sx={{
        width: 150,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      <List>
        {topDrawerList.map((navItem, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton>
              {navItem.path && (
                <Link to={navItem.path}>
                  <ListItemText primary={navItem.item} />
                </Link>
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List>
        <Divider />
        {BottomList()}
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
          anchor={"right"}
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        >
          <IconButton
            disableRipple={true}
            onClick={() => setIsDrawerOpen(false)}
            sx={{ justifyContent: "flex-end" }}
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
