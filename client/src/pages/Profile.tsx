import {useState, useEffect} from "react";
import "../styles/App.css";
import {
  Box,
  Container,
  ThemeProvider,
  Typography,
  Avatar,
  ListItemAvatar,
} from "@mui/material";

import {theme} from "../styles/Palette";
import logo from "../assets/EcoYah.png";
import {useNavigate} from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import {green, pink, orange, blue} from "@mui/material/colors";
import PersonIcon from "@mui/icons-material/Person";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import pointsPicture from "../assets/Reward.png";
import {useTheme} from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import PaidOutlinedIcon from '@mui/icons-material/Paid';

export default function Profile() {
  const navigationItems = [
    {
      category: "Rewards",
      subCategories: [
        {
          title: "My vouchers",
          subtitle: "View your active and past vouchers",
          avatar: (
            <Avatar sx={{bgcolor: orange[400]}}>
              <LocalActivityIcon />
            </Avatar>
          ),
          slug: "vouchers",
        },
      ],
    },
    {
      category: "Account settings",
      subCategories: [
        {
          title: "Your profile",
          subtitle: "Edit and view profile information",
          avatar: (
            <Avatar sx={{bgcolor: blue[400]}}>
              <PersonIcon />
            </Avatar>
          ),
          slug: "edit-profile",
        },
      ],
    },
    {
      category: "General",
      subCategories: [
        {
          title: "Contact us",
          subtitle: "Contact or send feedback to us",
          avatar: (
            <Avatar sx={{bgcolor: pink[400]}}>
              <LocalPhoneIcon />
            </Avatar>
          ),
          slug: "contact-us",
        },
        {
          title: "Notification",
          subtitle: "Manage subscriptions and email settings",
          avatar: (
            <Avatar sx={{bgcolor: green[400]}}>
              <NotificationsIcon />
            </Avatar>
          ),
          slug: "notification",
        },
      ],
    },
  ];

  const [userInfo, setUserInfo] = useState({
    name: "John Timonthy",
    role: "Donor",
    points: 1200,
  });

  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      <Container sx={{width: "100%"}}>
        <Box
          component="img"
          display="flex"
          justifyContent="center"
          sx={{
            marginX: "auto",
            marginTop: 4,
            marginBottom: 2,
            width: "8rem",
            height: "8rem",
            borderRadius: "50%",
            boxShadow:
              "0px 2px 6px 0px rgba(0, 0, 0, 0.25), 0 0 10px rgba(0, 0, 0, 0.2) inset",
          }}
          alt="EcoYah"
          src={logo}
        ></Box>
        <Typography
          sx={{fontWeight: "bold"}}
          align="center"
        >
          {userInfo.name}
        </Typography>
        <Typography align="center">{userInfo.role}</Typography>
        <Card
          sx={{
            display: "flex",
            bgcolor: "#e0f2f1",
            borderRadius: 5,
            marginY: 2,
            height: "10rem"
          }}
        >
          <Box sx={{display: "flex", flexDirection: "column"}}>
            <CardContent sx={{flex: "1 0 auto", width: "14rem"}}>
              <Typography
                component="div"
                variant="body1"
                fontWeight={600}
              >
                My points
              </Typography>
              <Typography
                variant="h6"
                color={orange[500]}
                component="div"
                display="flex"
                alignItems={"center"}
              >
                <PaidOutlinedIcon sx={{marginRight: 0.5}}/> {userInfo.points}
              </Typography>
            </CardContent>
            <Box sx={{display: "flex", alignItems: "center", pl: 2, pb: 2}}>
              <Typography
                variant="body1"
                fontWeight={600}
                component="div"
              >
                View history
              </Typography>
              <ArrowCircleRightIcon
                sx={{marginLeft: 0.5}}
                color="secondary"
              />
            </Box>
          </Box>
          <CardMedia
            component="img"
            sx={{width: "10rem", height: "10rem"}}
            src={pointsPicture}
            alt="Points"
          />
        </Card>

        <nav aria-label="main mailbox folders">
          {navigationItems.map((category, index) => (
            <List
              dense
              sx={{paddingTop: 0}}
              key={index}
              disablePadding
            >
              <Typography
                variant="h6"
                sx={{
                  marginLeft: "1rem",
                  fontWeight: 600,
                  marginTop: 2,
                }}
              >
                {category.category}
              </Typography>
              {category.subCategories.map((subCategory, subIndex) => (
                <ListItem
                  key={subIndex}
                  disablePadding
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                    >
                      <KeyboardArrowRightIcon />
                    </IconButton>
                  }
                >
                  <ListItemButton
                    onClick={() => navigate(`/${subCategory.slug}`)}
                  >
                    <ListItemAvatar>{subCategory.avatar}</ListItemAvatar>
                    <ListItemText
                      primary={subCategory.title}
                      primaryTypographyProps={{
                        variant: "subtitle1",
                        fontWeight: 500,
                      }}
                      secondary={subCategory.subtitle}
                      secondaryTypographyProps={{
                        variant: "subtitle2",
                        fontWeight: 400,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          ))}
        </nav>
      </Container>
    </ThemeProvider>
  );
}
