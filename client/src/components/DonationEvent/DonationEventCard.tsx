import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { styled } from "@mui/material/styles";
import Image from "../Image/Image";
import { folderPrefixNames } from "../Image/Image";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";

type DonationEventCardProps = {
  name: string;
  description: string;
  imgSrc: string;
  numJoined: number;
  timeLeft: string;
  handleDonateClick: () => void;
  disableButton: boolean;
};

const breakpointSize = "sm";
const StyledCard = styled(Card)(({ theme }) => ({
  [theme.breakpoints.up(breakpointSize)]: {
    width: "400px", // Set fixed width for larger screens
  },
}));

export default function DonationEventCard(props: DonationEventCardProps) {
  return (
    <StyledCard sx={{ borderRadius: "25px" }} elevation={2}>
      <CardMedia sx={{ paddingX: 2, paddingTop: 2, marginBottom: 0 }}>
        <Image
          imageId={props.imgSrc}
          type="rectangle"
          width="100%"
          height="100%"
          folderPrefix={folderPrefixNames.EVENTS}
        />
      </CardMedia>
      <CardContent>
        <Grid container alignItems="center">
          <Grid item xs={8}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {props.name}
            </Typography>
          </Grid>
          <Grid item xs={4} container justifyContent="flex-end">
            <Button
              variant="contained"
              size="medium"
              disabled={props.disableButton}
              onClick={() => props.handleDonateClick()}
            >
              Donate
            </Button>
          </Grid>
        </Grid>

        <Typography mt={2}>{props.description}</Typography>

        <Grid container alignItems="center" sx={{ marginTop: 2 }}>
          <Grid item xs={7}>
            <Typography color="text.secondary">
              {props.numJoined > 0
                ? `${props.numJoined} Donor${props.numJoined > 1 ? "s" : ""} Have Joined!`
                : "Be the first to make a difference!"}
            </Typography>
          </Grid>
          <Grid
            item
            xs={5}
            container
            justifyContent="flex-end"
            alignItems="center"
          >
            <AccessTimeIcon sx={{ color: "text.secondary", marginRight: 1 }} />
            <Typography color="text.secondary">{props.timeLeft}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </StyledCard>
  );
}
