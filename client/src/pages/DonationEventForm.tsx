import { useState }from 'react';
import { Stack, Box, Stepper, Step, StepLabel, Grid, Button } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Step1Form from "../components/DonationEvent/Step1Form";
import Step2Form from "../components/DonationEvent/Step2Form";

export default function DonationEventForm() {

    const form: any = { 0: <Step1Form/> , 1: <Step2Form/>, 2: <Step2Form/> }
  
    const steps = ['Step 1', 'Step 2', 'Step 3'];
    const [activeStep, setActiveStep] = useState(0);

    const handleBack = () => {
        if (activeStep > 0) setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleNext = () => {
        if (activeStep < 2) setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }

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
                    { form[activeStep] }
                    <Box display="flex" justifyContent="space-between">
                        <Button variant="outlined" sx={{ width: "9.375rem", height: "3.75rem", borderColor: "primary.dark", color: "primary.dark" }} onClick={handleBack}>CANCEL</Button>
                        <Button variant="contained" sx={{ width: "9.375rem", height: "3.75rem", backgroundColor: "primary.dark"}} endIcon={<ChevronRightIcon />} onClick={handleNext}>NEXT</Button>
                    </Box>
                </Stack>
            </Grid>
        </Grid>
        </>
    );
};