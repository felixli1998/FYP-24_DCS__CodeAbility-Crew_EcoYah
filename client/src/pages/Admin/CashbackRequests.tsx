// MUI Imports
import { Stack } from "@mui/material";

// Components
import StaffTypography from "../../components/Typography/StaffTypography";
import RedemptionNotification from "../../components/RedemptionNotification/RedemptionNotification";

export default function CashbackRequests() {
    return (
        <Stack spacing={5} sx={{ margin: { xs: "2rem 2rem", md: "2rem 4rem" } }}>
            <StaffTypography
                type="title"
                size={3}
                text={"Cashback Requests"}
            ></StaffTypography>
            <RedemptionNotification />
      </Stack>
    )
}