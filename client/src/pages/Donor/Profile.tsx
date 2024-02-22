import { useState, useEffect } from 'react';

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
  CardMedia,
} from '@mui/material';

import { theme } from '../../styles/Palette';
import logo from '../../assets/EcoYah.png';
import { useNavigate } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import { green, pink, orange, blue } from '@mui/material/colors';
import PersonIcon from '@mui/icons-material/Person';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import pointsPicture from '../../assets/Reward.png';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import PaidOutlinedIcon from '@mui/icons-material/Paid';
import { makeHttpRequest } from '../../utils/Utility';
import { USER_ROUTES } from '../../services/routes';
import { capitalize } from 'lodash';
import Cookies from 'js-cookie';
import { decodeToken } from "../../utils/Common";

const navigationItems = [
  {
    category: 'Rewards',
    subCategories: [
      {
        title: 'My vouchers',
        subtitle: 'View your active and past vouchers',
        avatar: (
          <Avatar sx={{ bgcolor: orange[400] }}>
            <LocalActivityIcon />
          </Avatar>
        ),
        slug: 'vouchers',
      },
    ],
  },
  {
    category: 'Account settings',
    subCategories: [
      {
        title: 'Your profile',
        subtitle: 'Edit and view profile information',
        avatar: (
          <Avatar sx={{ bgcolor: blue[400] }}>
            <PersonIcon />
          </Avatar>
        ),
        slug: 'edit-profile',
      },
    ],
  },
  {
    category: 'General',
    subCategories: [
      {
        title: 'Contact us',
        subtitle: 'Contact or send feedback to us',
        avatar: (
          <Avatar sx={{ bgcolor: pink[400] }}>
            <LocalPhoneIcon />
          </Avatar>
        ),
        slug: 'contact-us',
      },
      {
        title: 'Notification',
        subtitle: 'Manage subscriptions and email settings',
        avatar: (
          <Avatar sx={{ bgcolor: green[400] }}>
            <NotificationsIcon />
          </Avatar>
        ),
        slug: 'notification',
      },
    ],
  },
];

// == Profile Picture Section ==
interface ProfilePictureProps {
  picture: string;
  name: string;
  role: string;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({
  picture,
  name,
  role,
}) => {
  return (
    <>
      <Box
        component='img'
        display='flex'
        justifyContent='center'
        sx={{
          marginX: 'auto',
          marginTop: 4,
          marginBottom: 2,
          width: '8rem',
          height: '8rem',
          borderRadius: '50%',
          boxShadow:
            '0px 2px 6px 0px rgba(0, 0, 0, 0.25), 0 0 10px rgba(0, 0, 0, 0.2) inset',
        }}
        alt='EcoYah'
        src={logo}
      ></Box>
      <Typography sx={{ fontWeight: 'bold' }} align='center'>
        {name}
      </Typography>
      <Typography align='center'>{role}</Typography>
    </>
  );
};

// == Reward Section ==
interface RewardProps {
  points: number;
}

const Reward: React.FC<RewardProps> = ({ points }) => {
  return (
    <Card
      sx={{
        display: 'flex',
        bgcolor: '#e0f2f1',
        borderRadius: 5,
        marginY: 2,
        height: '10rem',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto', width: '14rem' }}>
          <Typography component='div' variant='body1' fontWeight={600}>
            My points
          </Typography>
          <Typography
            variant='h6'
            color={orange[500]}
            component='div'
            display='flex'
            alignItems={'center'}
          >
            <PaidOutlinedIcon sx={{ marginRight: 0.5 }} /> {points}
          </Typography>
        </CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', pl: 2, pb: 2 }}>
          <Typography variant='body1' fontWeight={600} component='div'>
            View history
          </Typography>
          <ArrowCircleRightIcon sx={{ marginLeft: 0.5 }} color='secondary' />
        </Box>
      </Box>
      <CardMedia
        component='img'
        sx={{ width: '10rem', height: '10rem' }}
        src={pointsPicture}
        alt='Points'
      />
    </Card>
  );
};

// == Everything below Reward ==
const Others = () => {
  const navigate = useNavigate();
  return (
    <nav aria-label='main mailbox folders'>
      {navigationItems.map((category, index) => (
        <List dense sx={{ paddingTop: 0 }} key={index} disablePadding>
          <Typography
            variant='h6'
            sx={{
              marginLeft: '1rem',
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
                <IconButton edge='end' aria-label='delete'>
                  <KeyboardArrowRightIcon />
                </IconButton>
              }
            >
              <ListItemButton onClick={() => navigate(`/${subCategory.slug}`)}>
                <ListItemAvatar>{subCategory.avatar}</ListItemAvatar>
                <ListItemText
                  primary={subCategory.title}
                  primaryTypographyProps={{
                    variant: 'subtitle1',
                    fontWeight: 500,
                  }}
                  secondary={subCategory.subtitle}
                  secondaryTypographyProps={{
                    variant: 'subtitle2',
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
  const email = (() => {
    const token = Cookies.get('token');
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken) {
        return decodedToken.email;
      }
    }
    return '';
  });

  const [userInfo, setUserInfo] = useState({
    name: '',
    role: '',
    points: 0,
  });

  const retrieveProfileInfo = async () => {
    try {
      const res: any = await makeHttpRequest(
        'GET',
        USER_ROUTES.RETRIEVE_BY_EMAIL.replace(':email', email)
      );
      const { action, data } = res.data;
      if (action) {
        // Currently, we do not have points so it will be null
        const { name, role, points = 1000 } = data;
        setUserInfo({ name, role: capitalize(role), points });
      } else {
        // TODO: Currently, we do not really have any robust error message
        console.log('Error retrieving user info');
      }
    } catch (error) {
      console.log('Error retrieving user info');
    }
  };

  useEffect(() => {
    retrieveProfileInfo();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Container sx={{ width: '100%' }}>
        <ProfilePicture
          picture={''}
          name={userInfo.name}
          role={userInfo.role}
        />
        <Reward points={userInfo.points} />
        <Others />
      </Container>
    </ThemeProvider>
  );
}
