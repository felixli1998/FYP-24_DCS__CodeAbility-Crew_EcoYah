import { useState, useEffect, ChangeEvent } from "react";
import { useTheme } from '@mui/system';
import { Box, Typography, TextField, Button, FormHelperText } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

type Step1FormProps = {
    validate: boolean
    data: (key: string, value: string) => void
}

export default function Step1Form(props: Step1FormProps) {

    const theme = useTheme();
    const [fileUpload, setFileUpload] = useState(false);
    const [image, setImage] = useState<any>(null);
    const [name, setName] = useState("");

    const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
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

    const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
    }

    useEffect(() => {
        props.data("imageId", image);
        props.data("name", name);
    }, [name, image]);

    return (
        <>
        <Typography variant="h5" gutterBottom sx={{ letterSpacing: "0.18rem", marginBottom: "1.5rem" }}>Upload an Image of the Donation Event</Typography>
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
        { (props.validate && image === null) && <FormHelperText error>Please upload an image</FormHelperText> }
        <Typography variant="h5" gutterBottom sx={{ letterSpacing: "0.18rem", marginBottom: "1.5rem" }}>Enter the Name the Donation Event</Typography>
        <TextField label="Name" type="text" 
            InputLabelProps={{ shrink: true }}
            sx={{ width: 300 }}
            value={name}
            onChange={handleTextChange}
            error={props.validate && name === ""}
            helperText={ (props.validate && name === "") && "Please enter a name" }
            />
        </>
    );
};