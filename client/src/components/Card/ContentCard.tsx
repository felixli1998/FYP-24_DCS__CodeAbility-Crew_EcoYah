import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import {Chip} from "@mui/material";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";

export default function ContentCard() {
  return (
    <Card
      variant="outlined"
      sx={{borderRadius: 4}}
    >
      <CardMedia
        component="img"
        image="https://picsum.photos/400/600"
        height="120"
        sx={{objectFit: "cover"}}
        alt="Live from space album cover"
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
            Live From Space
          </Typography>
          <Chip
            label="1 day left"
            color="primary"
            sx={{backgroundColor: "#d4edda", color: "#155724", borderRadius: 1}}
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
          S$ 3
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
            Kunyah Cafe 5th Feb 2024, 10:00 AM
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
