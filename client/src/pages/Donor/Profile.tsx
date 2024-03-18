// React
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// MUI
import {
  Box,
  Container,
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
} from "@mui/material";
// Icons
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import PersonIcon from "@mui/icons-material/Person";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
// Components
import Image from "../../components/Image/Image";
import { folderPrefixNames } from "../../components/Image/Image";
// Utils
import { makeHttpRequest } from "../../utils/Utility";
import { USER_ROUTES } from "../../services/routes";
import { capitalize } from "lodash";

const navigationItems = [
  {
    category: "Cashback History",
    subCategories: [
      {
        title: "Cashback",
        subtitle: "View all your cashback transactions",
        avatar: (
          <Avatar sx={{ bgcolor: "#455a64" }}>
            <LocalActivityIcon />
          </Avatar>
        ),
        slug: "cashback-history",
      },
    ],
  },
  {
    category: "Account settings",
    subCategories: [
      {
        title: "Your profile",
        subtitle: "View and edit profile information",
        avatar: (
          <Avatar sx={{ bgcolor: "#455a64" }}>
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
          <Avatar sx={{ bgcolor: "#455a64" }}>
            <LocalPhoneIcon />
          </Avatar>
        ),
        slug: "contact-us",
      },
    ],
  },
];

// == Reward Section ==
interface RewardProps {
  points: number;
  expiryDate: string;
}

const Reward: React.FC<RewardProps> = ({ points, expiryDate }) => {
  return (
    <Box sx={{ marginY: 2 }}>
      <Card
        variant="outlined"
        sx={{
          borderRadius: 4,
          boxShadow: 2,
          backgroundImage: "linear-gradient(to right, #004d40, #00695c)",
        }}
      >
        <CardContent sx={{ paddingTop: 1 }}>
          <Box
            sx={{
              paddingY: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body1" fontWeight="bold" color="white">
              Cashback
            </Typography>
            <Typography variant="caption" color="white">
              Expired on {expiryDate}
            </Typography>
          </Box>
          <Typography variant="h5" component="span" color="white">
            ${points}
          </Typography>
        </CardContent>
        <CardActions
          sx={{
            p: 1.5,
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          }}
        >
          <Typography component="div" variant="caption" color="white">
            Amount available to redeem
          </Typography>
          <Link to={"/cashback-redemption"}>
            <Typography
              paddingX={2}
              paddingY={1}
              sx={{
                borderRadius: 4,
                fontWeight: "bold",
                fontSize: 12,
                backgroundColor: "#eceff1",
                color: "black",
                transition: "background-color", // Add transition for a smooth effect
                "&:hover": {
                  backgroundColor: "#607d8b",
                  color: "white",
                  boxShadow: 4,
                },
              }}
            >
              Redeem
            </Typography>
          </Link>
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
              sx={{
                border: 1,
                borderRadius: 4,
                borderColor: "lightgrey",
                marginY: 1,
              }}
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
        const { name, role, imageId, points, expiryDate } = data;
        setUserInfo({
          name,
          role: capitalize(role),
          imageId,
          points,
          expiryDate,
        });
      } else {
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
    <Container sx={{ width: "100%" }}>
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
        ) : (
          <Image
            imageId={userInfo.imageId}
            type="circle"
            width="100%"
            height="100%"
            folderPrefix={folderPrefixNames.PROFILEPICTURES}
          />
        )}
      </Box>
      <Typography sx={{ fontWeight: "bold" }} align="center">
        {userInfo.name}
      </Typography>
      <Typography align="center">{userInfo.role}</Typography>
      <Reward points={userInfo.points} expiryDate={userInfo.expiryDate} />
      <Others />
    </Container>
  );
}
