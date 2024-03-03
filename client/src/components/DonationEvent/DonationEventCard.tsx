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
import Person from "@mui/icons-material/Person";
import { green } from "@mui/material/colors";

type DonationEventCardProps = {
  name: string;
  description: any;
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
    <StyledCard sx={{ borderRadius: "8px", border: 1, borderColor: "lightgray" }} elevation={0}>
      <CardMedia>
        <Image
          imageId={props.imgSrc}
          width="100%"
          height="100%"
          folderPrefix={folderPrefixNames.EVENTS}
        />
      </CardMedia>
      <CardContent sx={{ paddingTop: 1}}>
        <Grid item xs={8}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {props.name}
          </Typography>
        </Grid>

        <Grid mt={1}>{props.description}</Grid>

        <Grid container alignItems="center" sx={{ marginTop: 2 }}>
          <Grid item xs={7} sx={{ display: "flex"}}>
            <Person color="disabled" sx={{ marginRight: 0.5}}/> 
            <Typography color="text.disabled" whiteSpace="nowrap">
              {props.numJoined} Donor Joined
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
        <Grid>
            <Button
              variant="contained"
              size="large"
              fullWidth
              sx={{ marginTop: 2}}
              disabled={props.disableButton}
              onClick={() => props.handleDonateClick()}
            >
              Donate
            </Button>
          </Grid>
      </CardContent>
    </StyledCard>
  );
}
