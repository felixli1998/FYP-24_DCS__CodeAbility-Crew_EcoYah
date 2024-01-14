import * as React from "react";
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
import {Link} from "react-router-dom";
import slugify from "slugify";

type DrawerListProps = {
  topDrawerList: string[];
  bottomDrawerList: string[];
};

function TemporaryDrawer({topDrawerList, bottomDrawerList}: DrawerListProps) {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

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
        {topDrawerList.map((text, index) => (
          <ListItem
            key={index}
            disablePadding
          >
            <ListItemButton>
              <Link
                to={text === "Home" ? `/` : `/${slugify(text, {lower: true})}`}
              >
                <ListItemText primary={text} />
              </Link>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List>
        <Divider />
        <ListItem disablePadding>
          <Button
            sx={{marginX: 2, marginY: 2}}
            variant="outlined"
            fullWidth={true}
          >
            {!isLoggedIn ? (
              <Link
                to={`/${slugify(bottomDrawerList[0], {
                  lower: true,
                })}`}
              >
                {bottomDrawerList[0]}
              </Link>
            ) : (
              <Link
                to={`/${slugify(bottomDrawerList[1], {
                  lower: true,
                })}`}
              >
                {bottomDrawerList[1]}
              </Link>
            )}
          </Button>
        </ListItem>
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
          onClose={() => setIsDrawerOpen(false)}
        >
          <IconButton
            disableRipple={true}
            onClick={() => setIsDrawerOpen(false)}
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
