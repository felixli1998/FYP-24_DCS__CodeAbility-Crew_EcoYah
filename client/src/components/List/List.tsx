import * as React from 'react';

// MUI Imports
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Box,
  Divider,
} from '@mui/material';

// Components
import StaffTypography from '../Typography/StaffTypography';
import BasicButton from '../Button/BasicButton';

export default function ItemList() {
  const handleButtonChange = (status: boolean) => {
    console.log(status);
  };

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <ListItem alignItems='flex-start'>
        <ListItemAvatar>
          <Avatar
            alt='Remy Sharp'
            src='/static/images/avatar/1.jpg'
            sx={{ width: '5rem', height: '5rem', marginRight: '1rem' }}
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <>
              <StaffTypography
                size={1.25}
                text={`John Doe`}
                type={'title'}
                customStyles={{ color: 'secondary.main', fontWeight: 'none' }}
              />
            </>
          }
          secondary={
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'
            >
              <StaffTypography
                size={1}
                text={`Drop off on <br/> 10/12/2024, 1:00 PM`}
                type={'title'}
                customStyles={{ color: 'secondary.dark', fontWeight: 'none' }}
              />
              <BasicButton
                variant='outlined'
                label={'View More'}
                customStyles={{
                  fontSize: '1rem',
                  letterSpacing: '0.12rem',
                  width: '9.375rem',
                  height: '3.75rem',
                  color: 'primary.dark',
                  borderColor: 'primary.dark',
                }}
                onButtonChange={handleButtonChange}
              />
            </Box>
          }
        />
      </ListItem>
      <Divider variant='inset' component='li' />
    </List>
  );
}
