import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import {useTheme} from "@mui/material/styles";
import TemporaryDrawer from "./Drawer";

const actionList = ["Sign in", "Sign out"];
const navigationList = ["Home", "Reward", "Profile", "Contact us"];

function ResponsiveAppBar() {
  const theme = useTheme();

  return (
    <AppBar
      position="static"
      color="default"
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{justifyContent: "space-between"}}
        >
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: {display: "flex"},
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            LOGO
          </Typography>
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
