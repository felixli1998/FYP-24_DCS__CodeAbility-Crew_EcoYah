// React Imports
import { useState, useEffect } from 'react';

// MUI Imports
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  IconButton,
} from '@mui/material';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

type ItemQuantityCardType = {
  label: string[];
  onItemQuantityChange: (itemQuantity: Record<string, number>) => void;
};

export default function ItemQuantityCard(props: ItemQuantityCardType) {
  return (
    <>
      {props.label.map(function (eachLabel: string, index: number) {
        return (
          <Card
            key={index}
            sx={{
              marginTop: '1rem',
              border: '1px solid #D4D4D4',
              boxShadow: 'none',
            }}
          >
            <CardContent>
              <Typography variant='h5' component='div'>
                {eachLabel}
              </Typography>
              <Typography
                variant='subtitle1'
                component='div'
                color='secondary.light'
              >
                Earn 20 points per kilogram donated
              </Typography>
              <Typography
                variant='subtitle1'
                component='div'
                color='#EE8F0F'
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <PaidOutlinedIcon
                  sx={{ color: '#EE8F0F', marginRight: '0.5rem' }}
                />{' '}
                20
              </Typography>
            </CardContent>
            <CardActions sx={{ width: '8rem', border: '1px solid #D4D4D4', borderRadius: "2rem", justifyContent: 'center', margin: '0rem 1rem 1rem auto' }}>
              <IconButton>
                <RemoveIcon sx={{ color: "primary.main" }}/>
              </IconButton>
              <Typography
                variant='subtitle1'
                component='div'
              >
                1
              </Typography>
              <IconButton>
                <AddIcon sx={{ color: "primary.main" }}/>
              </IconButton>
            </CardActions>
          </Card>
        );
      })}
    </>
  );
}
