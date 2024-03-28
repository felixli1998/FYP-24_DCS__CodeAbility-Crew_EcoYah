import React from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export interface SimpleDialogProps {
  open: boolean;
  title: string;
  subtitleText: string;
  children: any;
  leftButtonLabel: string;
  rightButtonLabel: string;
  onClose: (value: boolean) => void;
  handleLeftButton?: () => void;
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
    handleLeftButton,
    handleRightButton,
    onClose,
  } = props;
  const [loading] = React.useState(false);

  const handleClose = () => {
    onClose(false);
  };

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="lg">
      <DialogTitle sx={{ fontSize: "1.5rem", letterSpacing: "0.18rem" }}>
        {title}
      </DialogTitle>
      {handleLeftButton && (
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      )}
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
          onClick={handleLeftButton ? handleLeftButton : handleClose}
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
