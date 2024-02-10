// React Imports
import { useState, useEffect } from 'react';

// MUI Imports
import {
  FormControl,
  Card,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  FormHelperText,
} from '@mui/material';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

type ItemQuantityCardType = {
  label: Record<string, string | number>[];
  onItemQuantityChange: (
    itemQuantity: Record<string, Record<string, number | string>>
  ) => void;
};

type DonationRequestItemType = {
  [item: string]: {
    quantity: number;
    points: number;
    error: string;
  };
};

export default function ItemQuantityCard(props: ItemQuantityCardType) {
  const [donationRequestItems, setDonationRequestItems] =
    useState<DonationRequestItemType>({});

  // to recompute the state each time props.label changes based on user's selection
  useEffect(() => {
    const initialDonationRequestItems: DonationRequestItemType = {};
    props.label.forEach((eachLabel: Record<string, string | number>) => {
      initialDonationRequestItems[eachLabel.item] = {
        quantity: eachLabel.minQty as number,
        points:
          (eachLabel.minQty as number) * (eachLabel.pointsPerUnit as number),
        error: '',
      };
    });
    setDonationRequestItems(initialDonationRequestItems);
  }, [props.label]);

  const handleDeduction = (name: string, pointsPerUnit: number): void => {
    const foundItem = props.label.find((item) => item['item'] === name);
    if (foundItem && foundItem.minQty === donationRequestItems[name].quantity) {
      setDonationRequestItems((prevItems) => ({
        ...prevItems,
        [name]: {
          ...prevItems[name],
          error: 'It has reached the minimum quantity',
        },
      }));
    } else {
      setDonationRequestItems((prevItems) => ({
        ...prevItems,
        [name]: {
          quantity: prevItems[name].quantity - 1,
          points: (prevItems[name].quantity - 1) * pointsPerUnit,
          error: '',
        },
      }));
    }
  };

  const handleAddition = (name: string, pointsPerUnit: number): void => {
    setDonationRequestItems((prevItems) => ({
      ...prevItems,
      [name]: {
        quantity: prevItems[name].quantity + 1,
        points: (prevItems[name].quantity + 1) * pointsPerUnit,
        error: '',
      },
    }));
  };

  // update the final state of quantity and points to parent component
  useEffect(() => {
    props.onItemQuantityChange(donationRequestItems);
  }, [donationRequestItems]);

  return (
    <>
      {props.label.map(function (
        eachLabel: Record<string, string | number>,
        index: number
      ) {
        return (
          <FormControl error={donationRequestItems[eachLabel.item] && donationRequestItems[eachLabel.item].error !== ''} key={index}>
            <Card
              sx={{
                marginTop: '1rem',
                border: '1px solid #D4D4D4',
                boxShadow: 'none',
              }}
            >
              <CardContent>
                <Typography variant='h5' component='div'>
                  {eachLabel.item}
                </Typography>
                <Typography
                  variant='subtitle1'
                  component='div'
                  color='secondary.light'
                >
                  Earn {eachLabel.pointsPerUnit} points per {eachLabel.unit}{' '}
                  donated
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
                  {donationRequestItems[eachLabel.item]
                    ? donationRequestItems[eachLabel.item].points
                    : (eachLabel.minQty as number) *
                      (eachLabel.pointsPerUnit as number)}
                </Typography>
              </CardContent>
              <CardActions
                sx={{
                  width: '8rem',
                  border: '1px solid #D4D4D4',
                  borderRadius: '2rem',
                  justifyContent: 'center',
                  margin: '0rem 1rem 1rem auto',
                }}
              >
                <IconButton
                  onClick={() =>
                    handleDeduction(
                      eachLabel.item as string,
                      eachLabel.pointsPerUnit as number
                    )
                  }
                >
                  <RemoveIcon sx={{ color: 'primary.main' }} />
                </IconButton>
                <Typography variant='subtitle1' component='div'>
                  {donationRequestItems[eachLabel.item]
                    ? donationRequestItems[eachLabel.item].quantity
                    : eachLabel.minQty}
                </Typography>
                <IconButton
                  onClick={() =>
                    handleAddition(
                      eachLabel.item as string,
                      eachLabel.pointsPerUnit as number
                    )
                  }
                >
                  <AddIcon sx={{ color: 'primary.main' }} />
                </IconButton>
              </CardActions>
            </Card>
            <FormHelperText>{donationRequestItems[eachLabel.item] ? donationRequestItems[eachLabel.item].error : ''}</FormHelperText>
          </FormControl>
        );
      })}
    </>
  );
}
