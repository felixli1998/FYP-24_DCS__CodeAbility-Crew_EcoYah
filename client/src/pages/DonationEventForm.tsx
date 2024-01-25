import { useState } from 'react';
import { Stack, Box, Stepper, Step, StepLabel, Typography, Grid, Button } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Step1Form from "../components/DonationEvent/Step1Form";
import Step2Form from "../components/DonationEvent/Step2Form";
import Step3Form from "../components/DonationEvent/Step3Form";


export default function DonationEventForm() {
  
    const steps = ['Step 1', 'Step 2', 'Step 3'];
    const [activeStep, setActiveStep] = useState(0);
    const [validateStep1, setValidateStep1] = useState(false);
    const [validateStep2, setValidateStep2] = useState(false);
    const [validateStep3, setValidateStep3] = useState(false);
    const [formData, setFormData] = useState<{ [key: string] : any }>({});

    const handleBack = () => {
        if (activeStep > 0) setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleNext = () => {
        switch(activeStep) {
            case 0:
                setValidateStep1(true);
                if ((formData['name'] !== "") && (formData['imageId'] !== null)) setActiveStep(1);
                break;
            case 1:
                setValidateStep2(true);
                if ((Object.keys(formData['donationEventItems'][0]).length >= 1)) setActiveStep(2);
                break;
            case 2:
                setValidateStep3(true);
                break;
        }
    }

    const handleData = (key: string, value: any) => {
        setFormData((prevData) => ({...prevData, [key] : value}));
    }

    console.log(formData);

    const form: any = { 0: <Step1Form validate={validateStep1} data={handleData}/> , 1: <Step2Form validate={validateStep2} data={handleData}/>, 2: <Step3Form validate={validateStep3} data={handleData}/> }

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