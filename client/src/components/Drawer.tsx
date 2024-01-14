import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import {IconButton} from "@mui/material";

type DrawerListProps = {
  topDrawerList: string[];
  bottomDrawerList: string[];
};

function TemporaryDrawer({topDrawerList, bottomDrawerList}: DrawerListProps) {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const list = () => (
    <Box
      role="presentation"
      onClick={handleDrawerOpen}
      sx={{
        width: 150,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      <List>
        {topDrawerList.map((text, index) => (
          <ListItem
            key={text}
            disablePadding
          >
            <ListItemButton>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {bottomDrawerList.map((text, index) => (
          <ListItem
            key={text}
            disablePadding
          >
            <ListItemButton>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <React.Fragment>
        <IconButton onClick={() => setIsDrawerOpen(true)}>
          <MenuIcon></MenuIcon>
        </IconButton>
        <Drawer
          anchor={"right"}
          open={isDrawerOpen}
          onClose={handleDrawerClose}
        >
          <IconButton
            disableRipple={true}
            onClick={handleDrawerClose}
            sx={{justifyContent: "flex-end"}}
          >
            <CloseIcon></CloseIcon>
          </IconButton>
          <Divider />
          {list()}
        </Drawer>
      </React.Fragment>
    </div>
  );
}

export default TemporaryDrawer;
