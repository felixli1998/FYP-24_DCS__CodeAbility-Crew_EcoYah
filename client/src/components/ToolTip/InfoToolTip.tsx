import * as React from "react";
import InfoIcon from "@mui/icons-material/Info";
import { Tooltip, IconButton } from "@mui/material";

type InfoToolTipType = {
  label: string;
};

export default function InfoToolTip(props: InfoToolTipType) {
  return (
    <Tooltip
      title={props.label}
      enterTouchDelay={0}
      sx={{ marginTop: "-0.5rem" }}
    >
      <IconButton>
        <InfoIcon />
      </IconButton>
    </Tooltip>
  );
}
