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
  data: any;
  onItemQuantityChange: (
    itemQuantity: Record<string, Record<string, string | number>>
  ) => void;
};

type DonationRequestItemType = {
  [id: number]: {
    quantity: number;
    points: number;
    error: string;
  };
};

export default function ItemQuantityCard(props: ItemQuantityCardType) {
  console.log(props.label)
  const [donationRequestItems, setDonationRequestItems] =
    useState<DonationRequestItemType>({});

  // to recompute the state each time props.label changes based on user's selection
  useEffect(() => {
    const initialDonationRequestItems: DonationRequestItemType = {};
    props.label.forEach((eachLabel: Record<string, string | number>) => {
      if (props.data.length >= 1) {
        const foundItem = props.data.find((item: any) => item.donationEventItem.id === eachLabel.id)
        if (foundItem) {
          initialDonationRequestItems[eachLabel.id as number] = {
            quantity: foundItem.quantity as number,
            points:
              (foundItem.quantity as number) * (foundItem.donationEventItem.pointsPerUnit as number),
            error: "",
          };
        }
      } 
      initialDonationRequestItems[eachLabel.id as number] = {
        quantity: eachLabel.minQty as number,
        points:
          (eachLabel.minQty as number) * (eachLabel.pointsPerUnit as number),
        error: "",
      };
    });
    setDonationRequestItems(initialDonationRequestItems);
  }, [props.label]);

  const handleDeduction = (id: number, pointsPerUnit: number): void => {
    const foundItem = props.label.find((item) => item["id"] === id);
    if (foundItem && foundItem.minQty === donationRequestItems[id].quantity) {
      setDonationRequestItems((prevItems) => ({
        ...prevItems,
        [id]: {
          ...prevItems[id],
          error: "It has reached the minimum quantity",
        },
      }));
    } else {
      setDonationRequestItems((prevItems) => ({
        ...prevItems,
        [id]: {
          quantity: prevItems[id].quantity - 1,
          points: (prevItems[id].quantity - 1) * pointsPerUnit,
          error: "",
        },
      }));
    }
  };

  const handleAddition = (id: number, pointsPerUnit: number): void => {
    setDonationRequestItems((prevItems) => ({
      ...prevItems,
      [id]: {
        quantity: prevItems[id].quantity + 1,
        points: (prevItems[id].quantity + 1) * pointsPerUnit,
        error: "",
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
          <FormControl
            error={
              donationRequestItems[eachLabel.id as number] &&
              donationRequestItems[eachLabel.id as number].error !== ""
            }
            key={index}
          >
            <Card
              sx={{
                marginTop: "1rem",
                border: "1px solid #D4D4D4",
                boxShadow: "none",
              }}
            >
              <CardContent>
                <Typography variant="h5" component="div">
                  {eachLabel.item}
                </Typography>
                <Typography
                  variant="subtitle1"
                  component="div"
                  color="secondary.light"
                >
                  Earn {eachLabel.pointsPerUnit} cashback per {eachLabel.unit}{" "}
                  donated
                </Typography>
                <Typography
                  variant="subtitle1"
                  component="div"
                  color="#EE8F0F"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <PaidOutlinedIcon
                    sx={{ color: "#EE8F0F", marginRight: "0.5rem" }}
                  />{" "}
                  {donationRequestItems[eachLabel.id as number]
                    ? donationRequestItems[eachLabel.id as number].points
                    : (eachLabel.minQty as number) *
                      (eachLabel.pointsPerUnit as number)}
                </Typography>
              </CardContent>
              <CardActions
                sx={{
                  width: "8rem",
                  border: "1px solid #D4D4D4",
                  borderRadius: "2rem",
                  justifyContent: "center",
                  margin: "0rem 1rem 1rem auto",
                }}
              >
                <IconButton
                  onClick={() =>
                    handleDeduction(
                      eachLabel.id as number,
                      eachLabel.pointsPerUnit as number
                    )
                  }
                >
                  <RemoveIcon sx={{ color: "primary.main" }} />
                </IconButton>
                <Typography variant="subtitle1" component="div">
                  {donationRequestItems[eachLabel.id as number]
                    ? donationRequestItems[eachLabel.id as number].quantity
                    : eachLabel.minQty}
                </Typography>
                <IconButton
                  onClick={() =>
                    handleAddition(
                      eachLabel.id as number,
                      eachLabel.pointsPerUnit as number
                    )
                  }
                >
                  <AddIcon sx={{ color: "primary.main" }} />
                </IconButton>
              </CardActions>
            </Card>
            <FormHelperText>
              {donationRequestItems[eachLabel.id as number]
                ? donationRequestItems[eachLabel.id as number].error
                : ""}
            </FormHelperText>
          </FormControl>
        );
      })}
    </>
  );
}
