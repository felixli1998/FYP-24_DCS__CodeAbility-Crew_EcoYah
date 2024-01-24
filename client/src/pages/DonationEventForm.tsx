import { useState }from 'react';
import { useTheme } from '@mui/system';
import { Stack, Box, Stepper, Step, StepLabel, Grid, Typography, TextField, Button } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export default function DonationEventForm() {
  
    const theme = useTheme();
    const steps = ['Step 1', 'Step 2', 'Step 3'];
    const [activeStep, setActiveStep] = useState(0);

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <>
            <Box sx={{ m: 5 }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                    ))}
                </Stepper>
            </Box>
            <Grid container justifyContent="center" sx={{ p: 2 }}>
                <Grid item xs={12} md={8} lg={8}>
                    <Stack spacing={5}>
                        <Typography variant="h5" gutterBottom>Upload an Image of the Donation Event</Typography>
                        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" 
                            sx={{ width: "100%",  
                                [theme.breakpoints.up('sm')]: {
                                    width: '40.25rem', 
                                }, height: "12.5rem", border: "1px dashed #5A5858", borderRadius: "4px" }}>
                            <UploadFileIcon sx={{ width: "3.44rem", height: "3.44rem", color: "primary.dark" }}/>
                            <Typography variant="h5" gutterBottom>Click to upload</Typography>
                        </Box>
                        <Typography variant="h5" gutterBottom>Name the Donation Event</Typography>
                        <TextField label="Name" type="text" 
                            InputLabelProps={{ shrink: true }}
                            sx={{ width: 300 }}
                            />
                        <Box display="flex" justifyContent="space-between">
                            <Button variant="contained" sx={{ width: "9.375rem", height: "3.75rem", backgroundColor: "primary.dark"}}>CANCEL</Button>
                            <Button variant="contained" sx={{ width: "9.375rem", height: "3.75rem", backgroundColor: "primary.dark"}} endIcon={<ChevronRightIcon />}>NEXT</Button>
                        </Box>
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
};