import { Avatar, Box, Stack, Typography } from "@mui/material";
import { LeaderboardRecord } from "../utils/Types";
import Image, { folderPrefixNames } from "./Image/Image";

type PodiumPositionProps = {
  height: string;
  color: string;
  stats: LeaderboardRecord;
};

export default function PodiumPostion(props: PodiumPositionProps) {
  return (
    <Stack>
      {/* <Avatar sx={{ margin: "0 auto" }} /> */}
      <Box margin="0 auto">
        <Image
          imageId={"DefaultProfilePicture.jpg"}
          type="circle"
          width="4rem"
          height="4rem"
          folderPrefix={folderPrefixNames.PROFILEPICTURES}
        />
      </Box>
      <Box
        borderRadius="20px 20px 0 0"
        bgcolor={props.color}
        width="11rem"
        height={props.height}
        padding="1rem"
        color="white"
        display="flex"
      >
        <Box alignSelf="center">
          <Typography>{props.stats.name}</Typography>
          <Typography fontWeight={900}>{props.stats.points}</Typography>
          <Typography>{"CO2 saved: " + props.stats.co2_saved}</Typography>
        </Box>
      </Box>
    </Stack>
  );
}
