import { useState } from 'react';
import { Stack, Typography, IconButton } from '@mui/material';
import TextFields from "./TextFields";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';


export default function EmailCard() {

    const [validateForm, setValidateForm] = useState(false);
    const [email, setEmail] = useState("");

    const handleData = (type: string, data: string) => {
        setEmail(data);
    }

    const handleClickStatus = () => {
        setValidateForm(true);
    }
  
    return (
        <Stack spacing={3}>
            <Typography variant="h5" align="center" gutterBottom>Email Verification</Typography>
            <Typography variant="subtitle1" color="secondary.light" align="center" gutterBottom>Enter your Registered Email</Typography>
            <TextFields label="Email" type="email" form="sign in" validate={validateForm} data={handleData}></TextFields>
            <IconButton color="secondary" aria-label="chevron right" sx={{ width: 40, "&:hover": "#008000", "&:active":  "#008000", backgroundColor: "#008000" }}>
                <ChevronRightIcon sx={{ "&:hover": "white", color: "white",  }} />
            </IconButton>
        </Stack>
    );
}