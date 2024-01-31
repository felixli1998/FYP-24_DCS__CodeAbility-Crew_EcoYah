import { useState, useEffect, ChangeEvent } from "react";
import { useTheme } from '@mui/system';
import { Box, TextField, Button } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import StaffTypography from "../Typography/StaffTypography";

type Step1FormProps = {
    validate: boolean
    data: (key: string, value: string) => void
    back: boolean
    prevData: any
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
        // retrieve previously entered data
        if (props.back && (props.prevData['name']) && (props.prevData['imageId'])) {
            setName(props.prevData['name']);
            setFileUpload(true);
            setImage(props.prevData['imageId']);
        }
    }, [props.back, props.prevData]);

    useEffect(() => {
        // update new entered data
        props.data("imageId", image);
        props.data("name", name);
    }, [name, image]);

    return (
        <>
        <StaffTypography type="title" size={1.5} text="Upload an Image of the Donation Event" />
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" 
            sx={{ width: "100%",  
                [theme.breakpoints.up('sm')]: {
                    width: '40.25rem', 
                }, height: "12.5rem", border: `1px dashed ${ props.validate && !fileUpload ? "#d32f2f" : "#5A5858" }`, borderRadius: "4px" }}>
            { !fileUpload ? (<><UploadFileIcon sx={{ width: "3.44rem", height: "3.44rem", color: "primary.dark" }}/>
            <Button sx={{ color: "primary.dark" }}>
                <label htmlFor="ImageInput" style={{ cursor: "pointer" }}>
                <StaffTypography type="title" size={1.5} text="Click to Upload" customStyles={{ textDecoration:"underline", marginTop: "1rem"}}/>
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
        { (props.validate && image === null) && <StaffTypography type="helperText" size={1.5} text="Please upload an image" /> }
        <StaffTypography type="title" size={1.5} text="Enter the Name the Donation Event" />
        <TextField label="Name" type="text" 
            InputLabelProps={{ shrink: true }}
            sx={{ width: 350 }}
            value={name}
            onChange={handleTextChange}
            error={props.validate && name === ""}
            helperText={ (props.validate && name === "") && <StaffTypography type="helperText" size={1.5} text="Please enter a name" /> }
            />
        </>
    );
};