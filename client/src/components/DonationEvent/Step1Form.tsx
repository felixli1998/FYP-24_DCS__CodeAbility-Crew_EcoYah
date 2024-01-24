import { useState } from "react";
import { useTheme } from '@mui/system';
import { Box, Typography, TextField, Button } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';


export default function Step1Form() {

    const theme = useTheme();
    const [fileUpload, setFileUpload] = useState(false);
    const [image, setImage] = useState<any>(null);

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
        <Typography variant="h5" gutterBottom sx={{ letterSpacing: "0.18rem" }}>Upload an Image of the Donation Event</Typography>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" 
            sx={{ width: "100%",  
                [theme.breakpoints.up('sm')]: {
                    width: '40.25rem', 
                }, height: "12.5rem", border: "1px dashed #5A5858", borderRadius: "4px" }}>
            { !fileUpload ? (<><UploadFileIcon sx={{ width: "3.44rem", height: "3.44rem", color: "primary.dark" }}/>
            <Button sx={{ color: "primary.dark" }}>
                <label htmlFor="ImageInput" style={{ cursor: "pointer" }}>
                <Typography variant="h5" gutterBottom sx={{ letterSpacing: "0.18rem", textDecoration:"underline", marginTop: "1rem" }}>Click to Upload</Typography>
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
        <Typography variant="h5" gutterBottom sx={{ letterSpacing: "0.18rem" }}>Enter the Name the Donation Event</Typography>
        <TextField label="Name" type="text" 
            InputLabelProps={{ shrink: true }}
            sx={{ width: 300 }}
            />
        </>
    );
};