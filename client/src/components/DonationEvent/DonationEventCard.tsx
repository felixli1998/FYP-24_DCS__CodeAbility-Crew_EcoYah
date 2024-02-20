import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { styled } from "@mui/material/styles";
import {
    Button,
    Card,
    CardContent,
    CardMedia,
    Grid,
    Typography
} from '@mui/material';

type DonationEventCardProps = {
    name: string;
    description: string;
    imgSrc: string;
    numJoined: number;
    numHoursLeft: string;
    handleDonateClick: () => void;
} 

const breakpointSize = "sm";
const StyledCard = styled(Card)(({ theme }) => ({
    // maxWidth: '100%', // Initially set to take up full width
    width: '95%', // Initially set to auto width
    // margin: '8px', // Add some margin for spacing between cards
    // Define media query for larger screens
    [theme.breakpoints.up(breakpointSize)]: {
    //   maxWidth: '400px', // Set fixed width for larger screens
      width: '400px', // Set fixed width for larger screens
    },
  }));

export default function DonationEventCard(props: DonationEventCardProps) {
    return (
        <StyledCard sx={{ borderRadius: "25px"}} elevation={2}>
            <CardMedia
                component="img" 
                image={props.imgSrc}
                height="200px"
                title={props.name}
                sx={{padding: 2, borderRadius: '25px'}}
            />
            <CardContent>
                <Grid container alignItems='center'>
                    <Grid item xs={8}>
                        <Typography variant='h6' sx={{fontWeight: 'bold'}}>{props.name}</Typography>
                    </Grid>
                    <Grid item xs={4} container justifyContent='flex-end'>
                        {/* <CardActions> */}
                            <Button 
                                variant='contained'
                                size='medium'
                                onClick={() => props.handleDonateClick()}>
                                    Donate
                            </Button>
                        {/* </CardActions> */}
                    </Grid>
                </Grid>
                
                <Typography mt={2}>{props.description}</Typography>

                <Grid container alignItems='center' sx={{marginTop: 2}}>
                    <Grid item xs={7}>
                        <Typography color="text.secondary">
                            {props.numJoined > 0 ? `${props.numJoined} Donor${props.numJoined > 1 ? 's' : ''} Have Joined!` : "Be the first to make a difference!"}
                        </Typography>
                    </Grid>
                    <Grid item xs={5} container justifyContent='flex-end' alignItems='center'>
                        <AccessTimeIcon sx={{ color: 'text.secondary', marginRight: 1}}/>
                        <Typography color='text.secondary'>
                           {props.numHoursLeft} Left
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </StyledCard>
    );
}

