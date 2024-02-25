import { Box, Button, Modal, Typography } from "@mui/material";
import { PARENT_ROUTES } from "../../services/routes";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

export default function WithdrawRequestModal(props: {
  isModalOpen: boolean;
  handleClose: () => void;
  reqId: number;
}) {
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
  const queryClient = useQueryClient();

  return (
    <>
      <Modal open={props.isModalOpen} onClose={props.handleClose}>
        <Box sx={style}>
          <Typography sx={{ mt: 2 }}>
            Are you sure you want to withdraw from this donation request?
          </Typography>
          <Box display="flex" justifyContent="flex-end">
            <Button onClick={props.handleClose}>Cancel</Button>
            <Button
              onClick={() =>
                axios
                  .put(`${PARENT_ROUTES.DONATION_REQUESTS}/withdraw`, {
                    id: props.reqId,
                  })
                  .then((resp) => {
                    console.log(resp.data);
                    queryClient.invalidateQueries({ // TODO: modify cache instead of refetching
                      queryKey: ["/get-donation-requests"],
                    });
                    props.handleClose();
                  })
                  .catch((err) => console.log(err))
              }
              color="error"
            >
              Withdraw
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
