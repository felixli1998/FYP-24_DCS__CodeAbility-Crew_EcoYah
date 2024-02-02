// React Imports
import { useState, useEffect } from 'react';

// MUI Imports
import { Stack, Box, Stepper, Step, StepLabel, Grid, Button } from '@mui/material';

// Icons
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Components
import StaffTypography from "../components/Typography/StaffTypography";
import Step1Form from "../components/DonationEvent/Step1Form";
import Step2Form from "../components/DonationEvent/Step2Form";
import Step3Form from "../components/DonationEvent/Step3Form";

// Other Imports
import dayjs from "dayjs";
import { useNavigate, useLocation } from "react-router-dom";

// Utils Imports
import { FormDataType } from "../utils/Types";

export default function DonationEventForm() {

    const navigate = useNavigate();
    const location = useLocation();

    const steps = ['Step 1', 'Step 2', 'Step 3'];
    const [activeStep, setActiveStep] = useState(0);
    const [validateStep1, setValidateStep1] = useState(false);
    const [backStep1, setBackStep1] = useState(false);
    const [validateStep2, setValidateStep2] = useState(false);
    const [backStep2, setBackStep2] = useState(false);
    const [validateStep3, setValidateStep3] = useState(false);
    const [backStep3, setBackStep3] = useState(false);
    const [formData, setFormData] = useState<FormDataType>({
      name: "",
      imageId: "",
      eventType: null,
      startDate: new Date(),
      endDate: new Date(),
      isActive: false,
      donationEventItems: [],
      createdBy: 0,
    });

    const handleBack = () => {
        switch(activeStep) {
            case 0:
                navigate("/admin/donation-event-overview");
                break;
            case 1:
                setBackStep1(true);
                setActiveStep(0);
                break;
            case 2:
                setBackStep2(true);
                setActiveStep(1);
                break;
        }
    };

    const handleNext = () => {
        switch(activeStep) {
            case 0:
                setValidateStep1(true);
                if ((formData['name'] !== "") && (formData['imageId'] !== null) && formData['eventType'] !== null) setActiveStep(1);
                break;
            case 1:
                setValidateStep2(true);
                if (formData['donationEventItems'].length !== 0) setActiveStep(2);
                break;
            case 2:
                setValidateStep3(true);
                if (dayjs(formData['startDate']).isValid() && dayjs(formData['endDate']).isValid()) navigate("/admin/donation-event-preview", { state: JSON.stringify(formData) });
                break;
        }
    }

    const handleData = (key: string, value: any) => {
        setFormData((prevData) => ({...prevData, [key] : value}));
    }

    const form: {
      [key: number]: JSX.Element;
    } = {
      0: (
        <Step1Form
          validate={validateStep1}
          data={handleData}
          back={backStep1}
          prevData={formData}
        />
      ),
      1: (
        <Step2Form
          validate={validateStep2}
          data={handleData}
          nextData={formData["eventType"]}
          back={backStep2}
          prevData={formData}
        />
      ),
      2: (
        <Step3Form
          validate={validateStep3}
          data={handleData}
          back={backStep3}
          prevData={formData}
        />
      ),
    };

    useEffect(() => {
        if (location.state) {
            setFormData(JSON.parse(location.state));
            setActiveStep(2);
            setBackStep3(true);
        }
    }, [location.state]);

    return (
        <>
        <Box sx={{ m: 5 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label, i) => (
                <Step key={label}>
                    <StepLabel  
                        sx={{ ".MuiSvgIcon-root": { width: "3.44rem", height: "3.44rem", borderRadius: "50rem" }, ".MuiStepIcon-text": { fontSize: "1rem" } }}>
                    <StaffTypography type="title" size={1.5} text={label} customStyles={{ color: (activeStep >= i) ? "primary.main" : "" }} />
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