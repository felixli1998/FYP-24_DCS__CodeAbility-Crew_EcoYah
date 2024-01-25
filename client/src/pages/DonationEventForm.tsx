import { useState }from 'react';
import { Stack, Box, Stepper, Step, StepLabel, Typography, Grid, Button } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Step1Form from "../components/DonationEvent/Step1Form";
import Step2Form from "../components/DonationEvent/Step2Form";
import Step3Form from "../components/DonationEvent/Step3Form";


export default function DonationEventForm() {

    const form: any = { 0: <Step1Form/> , 1: <Step2Form/>, 2: <Step3Form/> }
  
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
                {steps.map((label, i) => (
                <Step key={label}>
                    <StepLabel  
                        sx={{ ".MuiSvgIcon-root": { width: "3.44rem", height: "3.44rem", borderRadius: "50rem" }, ".MuiStepIcon-text": { fontSize: "1rem" } }}>
                    <Typography variant="h5" gutterBottom sx={{ color: (activeStep >= i) ? "primary.main" : null , letterSpacing: "0.18rem", fontStyle: "bold" }}>{label}</Typography>
                    </StepLabel>
                </Step>
                ))}
            </Stepper>
        </Box>
        <Grid container justifyContent="center" sx={{ p: 2 }}>
            <Grid item xs={12} md={8} lg={8}>
                <Stack spacing={5}> 
                    { form[activeStep] }
                    <Box display="flex" justifyContent="space-between">
                        <Button variant="outlined" sx={{ fontSize: "1.25rem", letterSpacing: "0.15rem", width: "9.375rem", height: "3.75rem", borderColor: "primary.dark", color: "primary.dark" }} startIcon={ activeStep !== 0  && <ArrowBackIosIcon />} onClick={handleBack}>{ activeStep === 0 ? "CANCEL" : "BACK" }</Button>
                        <Button variant="contained" sx={{ fontSize: "1.25rem", letterSpacing: "0.15rem", width: "9.375rem", height: "3.75rem", backgroundColor: "primary.dark"}} endIcon={<ArrowForwardIosIcon />} onClick={handleNext}>NEXT</Button>
                    </Box>
                </Stack>
            </Grid>
        </Grid>
        </>
    );
};