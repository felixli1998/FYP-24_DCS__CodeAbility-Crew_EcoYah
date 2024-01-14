import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import {useTheme} from "@mui/material/styles";
import TemporaryDrawer from "./Drawer";
import {Link} from "react-router-dom";

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
          <Link to={"/"}>
            <Typography
              variant="h6"
              noWrap
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
