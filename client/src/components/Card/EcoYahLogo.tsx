import { Box } from "@mui/material";
import logo from "../../assets/EcoYah.png";

export default function EcoYahLogo() {
  return (
    <Box
      component="img"
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        position: "relative",
        m: "auto",
        marginTop: 3,
        width: "10rem",
        height: "10rem",
        borderRadius: "50%",
        boxShadow:
          "0px 10px 10px 0px rgba(0, 0, 0, 0.25), 0 0 10px rgba(0, 0, 0, 0.2) inset",
      }}
      alt="EcoYah"
      src={logo}
    ></Box>
  );
}
