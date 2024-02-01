import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import TemporaryDrawer from "./Drawer";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";
import logo from "../assets/Kunyah.png";

function ResponsiveAppBar() {
  const actionList = ["Sign up", "Sign in", "Sign out"];
  const navigationList = ["Home", "Reward", "Profile", "Contact us"];

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
            <Box
              component="img"
              sx={{
                m: "auto",
                marginTop: 2,
                width: "4rem",
                height: "4rem",
                borderRadius: "100%",
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