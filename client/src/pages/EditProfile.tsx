import { useState, useEffect } from "react";
import "../styles/App.css";
import { Button,
         Container,
         Stack,
         ThemeProvider, 
         Typography,
         OutlinedInput  
        } from '@mui/material';
import { theme } from '../styles/Palette';
import TextFields from "../components/TextFields";

export default function EditProfile() {



    return (
        <ThemeProvider theme={theme}>

            <Container sx={{paddingY: "20px", paddingX: "25px"}}>
                <Typography pb={1} sx={{fontWeight: "bold"}} align="center">Change Photo</Typography>
                <Stack>
                    {/* <p sx={{paddingBottom: "5px"}}><b>Name</b></p> */}
                        <Typography variant="subtitle2" pb={1} pt={2}>Name</Typography>
                        <OutlinedInput placeholder="Name" />

                        <Typography variant="subtitle2" pb={1} pt={2}>Contact</Typography>
                        <OutlinedInput placeholder="Contact" />

                        <Typography variant="subtitle2" pb={1} pt={2}>Email</Typography>
                        <OutlinedInput placeholder="Email" />

                        <Button variant="contained" color="success">Save Changes</Button>
                        <Button variant="outlined" color="error" sx={{marginTop: "16px"}}>Terminate Account</Button>


                </Stack>
            </Container>
        </ThemeProvider>
    )
}