import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import React from "react";

export interface SimpleDialogProps {
  open: boolean;
  title: string;
  subtitleText: string;
  children: any;
  leftButtonLabel: string;
  rightButtonLabel: string;
  onClose: (value: boolean) => void;
  handleRightButton: () => void;
}

export default function SimpleDialog(props: SimpleDialogProps) {
  const {
    open,
    title,
    subtitleText,
    children,
    leftButtonLabel,
    rightButtonLabel,
    handleRightButton,
    onClose,
  } = props;
  const [loading] = React.useState(false);

  const handleClose = () => {
    onClose(false);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle sx={{ fontSize: "1.5rem", letterSpacing: "0.18rem" }}>
        {title}
      </DialogTitle>
      <DialogContent>
        {subtitleText && (
          <DialogContentText
            sx={{ fontSize: "1.125rem", letterSpacing: "0.135rem" }}
          >
            {subtitleText}
          </DialogContentText>
        )}
        {children}
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={handleClose}
          disabled={loading}
          sx={{
            fontSize: "1.125rem",
            letterSpacing: "0.135rem",
            margin: 2,
          }}
        >
          {leftButtonLabel}
        </Button>
        <Button
          variant="contained"
          onClick={handleRightButton}
          disabled={loading}
          sx={{
            fontSize: "1.125rem",
            letterSpacing: "0.135rem",
            margin: 2,
          }}
        >
          {loading ? <CircularProgress /> : rightButtonLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
