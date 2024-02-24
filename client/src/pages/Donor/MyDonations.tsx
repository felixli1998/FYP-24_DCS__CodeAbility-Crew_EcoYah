import { Box, Button, Modal, Typography } from "@mui/material";
import { PARENT_ROUTES } from "../../services/routes";
import axios from "axios";
import { useState } from "react";

const reqId = 2;

export default function MyDonations() {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Delete Request</Button>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography sx={{ mt: 2 }}>
            Are you sure you want to delete this donation request?
          </Typography>
          <Box display="flex" justifyContent="flex-end">
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              onClick={() =>
                axios
                  .post(`${PARENT_ROUTES.DONATION_REQUESTS}/cancel`, {
                    id: reqId,
                  })
                  .then((resp) => console.log(resp.data))
                  .catch((err) => console.log)
              }
              color="error"
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
