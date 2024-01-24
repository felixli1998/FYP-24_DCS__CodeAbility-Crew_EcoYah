import { useState }from 'react';
import { useTheme } from '@mui/system';
import { Stack, Box, Stepper, Step, StepLabel, Grid, Typography, TextField, Button } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export default function DonationEventForm() {
  
    const theme = useTheme();
    const steps = ['Step 1', 'Step 2', 'Step 3'];
    const [activeStep, setActiveStep] = useState(0);
    const [fileUpload, setFileUpload] = useState(false);
    const [image, setImage] = useState<any>(null);

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFileUpload(true);
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const imageDataUrl = reader.result as string;
                setImage(imageDataUrl);
            };
            reader.readAsDataURL(file);
        };
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
                    <Typography variant="h5" gutterBottom>Upload an Image of the Donation Event</Typography>
                    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" 
                        sx={{ width: "100%",  
                            [theme.breakpoints.up('sm')]: {
                                width: '40.25rem', 
                            }, height: "12.5rem", border: "1px dashed #5A5858", borderRadius: "4px" }}>
                        { !fileUpload ? (<><UploadFileIcon sx={{ width: "3.44rem", height: "3.44rem", color: "primary.dark" }}/>
                        <Button sx={{ color: "primary.dark" }}>
                            <label htmlFor="ImageInput" style={{ cursor: "pointer" }}>
                            <Typography variant="h5" gutterBottom sx={{ textDecoration:"underline", marginTop: "1rem" }}>Click to Upload</Typography>
                            </label>
                            <input
                                type="file"
                                id="ImageInput"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleImageUpload}
                            /> 
                        </Button></>) : <img
                                            src={image}
                                            alt="donationImage"
                                            loading="lazy"
                                            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} /> }
                    </Box>
                    <Typography variant="h5" gutterBottom>Name the Donation Event</Typography>
                    <TextField label="Name" type="text" 
                        InputLabelProps={{ shrink: true }}
                        sx={{ width: 300 }}
                        />
                    <Box display="flex" justifyContent="space-between">
                        <Button variant="contained" sx={{ width: "9.375rem", height: "3.75rem", backgroundColor: "primary.dark" }}>CANCEL</Button>
                        <Button variant="contained" sx={{ width: "9.375rem", height: "3.75rem", backgroundColor: "primary.dark"}} endIcon={<ChevronRightIcon />}>NEXT</Button>
                    </Box>
                </Stack>
            </Grid>
        </Grid>
        </>
    );
};