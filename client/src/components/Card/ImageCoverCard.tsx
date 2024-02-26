import * as React from "react";
import { Box, Typography } from "@mui/material";
import { folderPrefixNames } from "../../components/Image/Image";
import Image from "../Image/Image";

type ImageCoverCardType = {
  image: string;
  name: string;
  startDate: string;
  endDate: string;
};

export default function ImageCoverCard(props: ImageCoverCardType) {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "20rem",
        overflow: "hidden",
      }}
    >
      <Image
        imageId={props.image}
        type="rectangle"
        width="100%"
        height="320px"
        folderPrefix={folderPrefixNames.EVENTS}
      />
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          width: "80%",
          padding: "1rem",
          opacity: "0.7",
          background: "#FFFFFF",
        }}
      >
        <Typography variant="h5">
          <b>{props.name}</b> <br />
          {new Date(props.startDate).toLocaleDateString()} -{" "}
          {new Date(props.endDate).toLocaleDateString()}
        </Typography>
      </Box>
    </Box>
  );
}
