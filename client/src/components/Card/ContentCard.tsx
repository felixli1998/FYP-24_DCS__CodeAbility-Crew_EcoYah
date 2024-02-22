import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import {CardActionArea, CardActions, Chip, Divider, Grid} from "@mui/material";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import Button from "@mui/material/Button";
import BasicButton from "../Button/BasicButton";
import {Margin, WidthFull} from "@mui/icons-material";

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
};

export default function ContentCard(props: ContentCardProps) {
  const {contentCardData} = props;
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
      <CardMedia
        component="img"
        image={image}
        height="140"
        width="100%"
        sx={{objectFit: "cover", margin: "auto"}}
        alt="Not available"
      />
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
          S$ {reward}
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
          variant="outlined"
          fullWidth
        >
          Delete
        </Button>
        <Button
          variant="contained"
          fullWidth
        >
          Edit
        </Button>
      </CardActions>
    </Card>
  );
}
