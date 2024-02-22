import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {CardActions, Chip} from "@mui/material";
import { orange } from '@mui/material/colors';
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import Button from "@mui/material/Button";
import PaidOutlinedIcon from '@mui/icons-material/Paid';
import Image from "../Image/Image";
import { useNavigate } from 'react-router-dom';

type ContentCardProps = {
  contentCardData: {
    image: string;
    title: string;
    chipLabel: string;
    customChipStyle: any;
    reward: number;
    location: string;
    dropOffDateTime: string;
  };
  originalData: any;
};

export default function ContentCard(props: ContentCardProps) {
  console.log(props);
  const navigate = useNavigate();
  const {contentCardData, originalData} = props;
  const {
    image,
    title,
    chipLabel,
    reward,
    location,
    dropOffDateTime,
    customChipStyle,
  } = contentCardData;
  return (
    <Card
      variant="outlined"
      sx={{borderRadius: 4}}
      raised={true}
    >
      <Image   
        imageId={image}
        type='circle'
        width='100%'
        height='140px'
        folderPrefix='events' />
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: "1 0 auto",
          "&:last-child": {pb: 2},
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 0.5,
          }}
        >
          <Typography
            component="div"
            variant="body2"
            fontWeight={700}
          >
            {title}
          </Typography>
          <Chip
            label={chipLabel}
            color="primary"
            sx={{
              maxWidth: 98,
              backgroundColor: "#d4edda",
              color: "#155724",
              borderRadius: 1,
              ...customChipStyle,
            }}
            size="small"
          ></Chip>
        </Box>
        <Typography
          variant="h6"
          color="primary"
          component="div"
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            marginTop: 0.5,
          }}
        >
          <Typography
            variant='h6'
            color={orange[500]}
            component='div'
            display='flex'
            alignItems={'center'}
          >
            <PaidOutlinedIcon sx={{ marginRight: 0.5 }} /> {reward}
          </Typography>
        </Typography>
        <Box sx={{marginTop: "auto"}}>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            component="div"
            sx={{display: "flex", marginTop: 1}}
          >
            <LocationOnRoundedIcon
              color="action"
              fontSize="small"
              sx={{width: "1rem", marginRight: "0.2rem"}}
            ></LocationOnRoundedIcon>
            {`${location} ${dropOffDateTime}`}
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          fullWidth
          onClick={() => navigate('/donation-request-form', { state: { action: 'edit', form: originalData }})}
        >
          Edit
        </Button>
        <Button
          variant="outlined"
          fullWidth
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}
