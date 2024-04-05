import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActions, Chip } from "@mui/material";
import { orange } from "@mui/material/colors";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import Button from "@mui/material/Button";
import PaidOutlinedIcon from "@mui/icons-material/Paid";
import { folderPrefixNames } from "../../components/Image/Image";
import Image from "../Image/Image";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import WithdrawRequestModal from "../Modal/WithdrawRequestModal";

type ContentCardProps = {
  contentCardData: {
    id: number;
    image: string;
    title: string;
    chipLabel: string;
    customChipStyle: any;
    reward: number;
    location: string;
    dropOffDateTime: string;
    status: string;
  };
  originalData: any;
};

export default function ContentCard(props: ContentCardProps) {
  const navigate = useNavigate();
  const { contentCardData, originalData } = props;
  const {
    id,
    image,
    title,
    chipLabel,
    reward,
    location,
    dropOffDateTime,
    customChipStyle,
    status,
  } = contentCardData;

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Card variant="outlined" sx={{ borderRadius: 4, marginBottom: 5 }}>
        <Image
          imageId={image}
          type="rectangle"
          width="100%"
          height="80%"
          folderPrefix={folderPrefixNames.EVENTS}
        />
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: "1 0 auto",
            "&:last-child": { pb: 2 },
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
            <Typography component="div" variant="h6" fontWeight={700}>
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
              variant="h6"
              color={orange[500]}
              component="div"
              display="flex"
              alignItems={"center"}
            >
              <PaidOutlinedIcon sx={{ marginRight: 0.5 }} /> {reward}
            </Typography>
          </Typography>
          <Box sx={{ marginTop: "auto" }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              component="div"
              sx={{ display: "flex", marginTop: 1 }}
            >
              <LocationOnRoundedIcon
                color="action"
                fontSize="small"
                sx={{ width: "1rem", marginRight: "0.2rem" }}
              ></LocationOnRoundedIcon>
              {`${location} ${dropOffDateTime}`}
            </Typography>
          </Box>
        </CardContent>
        {status === "active" && (
          <CardActions>
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                navigate(`/donation-request-form/${id}/${originalData.name}}`, {
                  state: { action: "edit", form: originalData },
                  replace: true,
                });
              }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => setIsModalOpen(true)}
            >
              Withdraw
            </Button>
          </CardActions>
        )}
      </Card>
      <WithdrawRequestModal
        isModalOpen={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        reqId={id}
      />
    </>
  );
}
