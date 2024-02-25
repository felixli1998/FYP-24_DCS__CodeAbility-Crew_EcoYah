import { useState, useEffect } from 'react';
import '../../styles/App.css';
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
import { folderPrefixNames } from '../../components/Image/Image';
import Image from '../../components/Image/Image';

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
  const imageId = picture.trim() === '' ? 'DefaultProfilePicture.jpg' : picture;
  return (
    <>
      <Box display='flex' justifyContent='center' 
        sx={{ 
          marginX: 'auto',
          width: '8rem',
          height: '8rem', 
          marginTop: 4, 
          marginBottom: 2}}>
        <Image
          imageId={imageId}
          type='circle'
          width="100%"
          height="100%"
          folderPrefix={folderPrefixNames.PROFILEPICTURES}
        /> 
      </Box>
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
  const email = localStorage.getItem('ecoyah-email') || '';

  const [userInfo, setUserInfo] = useState({
    name: '',
    role: '',
    imageId: '',
    points: 0,
  });

  const retrieveProfileInfo = async () => {
    try {
      const res: any = await makeHttpRequest(
        'GET',
        USER_ROUTES.RETRIEVE_BY_EMAIL.replace(':email', email)
      );
      const { action, data } = res.data;
      console.log(data)
      if (action) {
        // Currently, we do not have points so it will be null
        const { name, role, imageId, points = 1000 } = data;
        setUserInfo({ name, role: capitalize(role), imageId, points });
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

  console.log(userInfo);

  return (
    <ThemeProvider theme={theme}>
      <Container sx={{ width: '100%' }}>
        <ProfilePicture
          picture={userInfo.imageId}
          name={userInfo.name}
          role={userInfo.role}
        /> 
        <Reward points={userInfo.points} />
        <Others />
      </Container>
    </ThemeProvider>
  );
}
