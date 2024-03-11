import { useState, useEffect } from "react";
import "../../styles/App.css";
import {
  Box,
  Container,
  ThemeProvider,
  Typography,
  Avatar,
  ListItemAvatar,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  SpeedDialIcon,
} from "@mui/material";
import BasicButton from "../../components/Button/BasicButton";

import { theme } from "../../styles/Palette";
import { useNavigate } from "react-router-dom";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import { green, pink, orange, blue } from "@mui/material/colors";
import PersonIcon from "@mui/icons-material/Person";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import { makeHttpRequest } from "../../utils/Utility";
import { USER_ROUTES } from "../../services/routes";
import { capitalize } from "lodash";
import { folderPrefixNames } from "../../components/Image/Image";
import Image from "../../components/Image/Image";

const navigationItems = [
  {
    category: "Transaction History",
    subCategories: [
      {
        title: "Transaction",
        subtitle: "View all your cash back transactions",
        avatar: (
          <Avatar sx={{bgcolor: "#455a64"}}>
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
          <Avatar sx={{bgcolor: "#455a64"}}>
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
          <Avatar sx={{bgcolor: "#455a64"}}>
            <LocalPhoneIcon />
          </Avatar>
        ),
        slug: "contact-us",
      },
      {
        title: "Notification",
        subtitle: "Manage subscriptions and email settings",
        avatar: (
          <Avatar sx={{bgcolor: "#455a64"}}>
            <NotificationsIcon />
          </Avatar>
        ),
        slug: "notification",
      },
    ],
  },
];

// == Profile Picture Section ==
// interface ProfilePictureProps {
//   picture: string;
//   name: string;
//   role: string;
// }

// const ProfilePicture: React.FC<ProfilePictureProps> = ({
//   picture,
//   name,
//   role,
// }) => {
//   const imageId = picture.trim() === "" ? "DefaultProfilePicture.jpg" : picture;
//   console.log(picture)
//   return (
//     <>
//       <Box
//         display="flex"
//         justifyContent="center"
//         sx={{
//           marginX: "auto",
//           width: "8rem",
//           height: "8rem",
//           marginTop: 4,
//         }}
//       >
//         <Image
//           imageId={imageId}
//           type="circle"
//           width="100%"
//           height="100%"
//           folderPrefix={folderPrefixNames.PROFILEPICTURES}
//         />
//       </Box>
//       <Typography sx={{ fontWeight: "bold" }} align="center">
//         {name}
//       </Typography>
//       <Typography align="center">{role}</Typography>
//     </>
//   );
// };

// == Reward Section ==
interface RewardProps {
  points: number;
  expiryDate: string;
}

const Reward: React.FC<RewardProps> = ({ points, expiryDate }) => {
  return (
    <Box sx={{ marginY: 2}}>
      <Card
        variant="outlined"
        sx={{
          borderRadius: 4,
          boxShadow: 2,
          backgroundImage: "linear-gradient(to right, #004d40, #00695c)"
        }}
      >
        <CardContent sx={{ paddingTop: 1}}>
          <Box sx={{ paddingY: 1, display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <Typography variant="body1" fontWeight="bold" color="white">
              Cashback
            </Typography>
            <Typography variant="caption" color="white">Expired on {expiryDate}</Typography>
          </Box>
          <Typography
            variant="h5"
            component="span"
            color="white"
          >
            {points}
          </Typography>
        </CardContent>
        <CardActions sx={{ p: 2, display: "flex", justifyContent: "space-between", backgroundColor: "rgba(0, 0, 0, 0.2)", }}>
          <Typography component="div" variant="caption" color="white">Amount available to redeem</Typography>
          <BasicButton label="Redeem" variant={"contained"} customStyles={{ 
            borderRadius: 4,
            fontWeight: "bold", 
            fontSize: 12,
            backgroundColor: "white",
            color: "black",
          }} onButtonChange={() => console.log("hi")} />
        </CardActions>
      </Card>
    </Box>
  );
};

// == Everything below Reward ==
const Others = () => {
  const navigate = useNavigate();
  return (
    <nav aria-label="main mailbox folders">
      {navigationItems.map((category, index) => (
        <List dense sx={{ paddingY: 0 }} key={index} disablePadding>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              marginY: 1,
            }}
          >
            {category.category}
          </Typography>
          {category.subCategories.map((subCategory, subIndex) => (
            <ListItem
            sx={{ border: 1, borderRadius: 4, borderColor: "lightgrey", marginY: 1 }}
              key={subIndex}
              disablePadding
              secondaryAction={
                <IconButton edge="end" aria-label="delete">
                  <KeyboardArrowRightIcon />
                </IconButton>
              }
            >
              <ListItemButton onClick={() => navigate(`/${subCategory.slug}`)}>
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
  );
};

export default function Profile() {
  const email = localStorage.getItem("ecoyah-email") || "";

  const [userInfo, setUserInfo] = useState({
    name: "",
    role: "",
    imageId: "",
    points: 0,
    expiryDate: "",
  });

  const [loading, setLoading] = useState(true);

  const retrieveProfileInfo = async () => {
    try {
      const res: any = await makeHttpRequest(
        "GET",
        USER_ROUTES.RETRIEVE_BY_EMAIL.replace(":email", email),
      );
      const { action, data } = res.data;
      if (action) {
        // Currently, we do not have points so it will be null
        const { name, role, imageId, points, expiryDate } = data;
        setUserInfo({ name, role: capitalize(role), imageId, points, expiryDate });
      } else {
        // TODO: Currently, we do not really have any robust error message
        console.log("Error retrieving user info");
      }
    } catch (error) {
      console.log("Error retrieving user info");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    retrieveProfileInfo();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Container sx={{ width: "100%" }}>
        {/* <ProfilePicture
          picture={userInfo.imageId}
          name={userInfo.name}
          role={userInfo.role}
        /> */}
        <Box
          display="flex"
          justifyContent="center"
          sx={{
            marginX: "auto",
            width: "8rem",
            height: "8rem",
            marginTop: 4,
          }}
        >
          {loading ? (
            <div>Loading...</div>
          ) : 
          (<Image
            imageId={userInfo.imageId}
            type="circle"
            width="100%"
            height="100%"
            folderPrefix={folderPrefixNames.PROFILEPICTURES}
          />)}
        </Box>
        <Typography sx={{ fontWeight: "bold", marginTop: "1rem" }} align="center">
          {userInfo.name}
        </Typography>
        <Typography align="center">{userInfo.role}</Typography>
        <Reward points={userInfo.points} expiryDate={userInfo.expiryDate}/>
        <Others />
      </Container>
    </ThemeProvider>
  );
}
