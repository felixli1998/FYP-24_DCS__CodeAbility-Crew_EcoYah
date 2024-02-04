import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { DonationEvent } from "../types/DonationEvent";

export default function DonationEventCard(props: DonationEvent) {
  return (
    <Card>
      <CardMedia image={props.image_id} />
      <CardContent>
        <Typography color="red">
          {"[" +
            Math.floor(
              (+props.end_date - +props.start_date) / (1000 * 60 * 60 * 24),
            ) +
            " DAYS LEFT] " +
            props.start_date.toLocaleDateString() +
            "-" +
            props.end_date.toLocaleDateString()}
        </Typography>
        <Typography variant="h5">{props.name}</Typography>
      </CardContent>
      <CardActions>
        <Button sx={{ justifyContent: "flex-end" }}>View More</Button>
      </CardActions>
    </Card>
  );
}
