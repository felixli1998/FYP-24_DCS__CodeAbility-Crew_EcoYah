import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {IconProps} from "@mui/material";
import Alert from "@mui/material/Alert";

interface FormDialogProps {
  buttonName: string;
  buttonIcon: React.ReactElement<IconProps>;
  dialogTitle: string;
  formComponent: React.ReactNode;
  leftActionButtonName: string;
  rightActionButtonName: string;
  errorMessage: string;
  handleFormSubmit: (formData: any) => Promise<boolean>;
}

const FormDialog: React.FC<FormDialogProps> = ({
  buttonName,
  buttonIcon,
  dialogTitle,
  formComponent,
  leftActionButtonName,
  rightActionButtonName,
  errorMessage,
  handleFormSubmit,
}) => {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());

    try {
      const result = await handleFormSubmit(formJson);
      if (result) {
        handleClose();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Button
        variant="contained"
        startIcon={buttonIcon}
        onClick={handleClickOpen}
      >
        {buttonName}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            handleSubmit(event);
          },
        }}
      >
        <DialogTitle sx={{paddingX: "4rem"}}>{dialogTitle}</DialogTitle>
        <DialogContent>
          {formComponent}
          {
            errorMessage &&
            <Alert
              variant="filled"
              severity="error"
              sx={{marginTop: "1rem"}}
            >
              {errorMessage}
            </Alert>
          }
        </DialogContent>

        <DialogActions>
          <Button
            variant="outlined"
            onClick={handleClose}
            disabled={loading}
          >
            {leftActionButtonName}
          </Button>
          <Button
            variant="contained"
            type="submit"
            disabled={loading}
          >
            {rightActionButtonName}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default FormDialog;
