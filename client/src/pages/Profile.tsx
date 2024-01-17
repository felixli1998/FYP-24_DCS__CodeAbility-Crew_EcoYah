import { useState, useEffect } from "react";
import "../styles/App.css";
import { Box,
         Button,
         Container,
         Grid,
         Stack,
         ThemeProvider, 
         Typography,
         OutlinedInput  
        } from '@mui/material';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import LocalActivityRoundedIcon from '@mui/icons-material/LocalActivityRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import { theme } from '../styles/Palette';
import logo from "../assets/EcoYah.png";

import TextFields from "../components/TextFields";

export default function EditProfile() {

    const [name, setName] = useState("");
    const [contact, setContact] = useState("");
    const [email, setEmail] = useState("");
    const [formData, setFormData] = useState<{ [key: string] : string }>({});

    const handleData = (type: string, data: string) => {
        // console.log(type);
        // console.log(data);
        setFormData((prevData) => ({...prevData, [type] : data}));
    }


    return (
        <ThemeProvider theme={theme}>

            <Container sx={{paddingY: "20px", paddingX: "25px"}}>
                <Box 
                    component="img" 
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ position: 'relative', m: 'auto', width: '10rem', height: '10rem', borderRadius: '50%', boxShadow: "0px 5px 5px 0px rgba(0, 0, 0, 0.25), 0 0 10px rgba(0, 0, 0, 0.2) inset" }}
                    alt="EcoYah"
                    src={logo}>
                </Box>

                <Typography pb={1} pt={2} sx={{fontWeight: "bold"}} align="center">NAME</Typography>

                <Stack>
                    <Stack>

                        <Typography variant="h6" sx={{fontWeight: "bold"}} pb={1} pt={2}>Rewards</Typography>
                    
                        <Grid container spacing={1}>
                            <Grid item xs={2} display={"flex"} justifyContent="center" alignItems="center">
                                <LocalActivityRoundedIcon sx={{ color: 'secondary.main'}} fontSize="large"/>
                            </Grid>
                            
                            <Grid item xs={9}>
                                <Stack>
                                    <Typography sx={{fontWeight: "bold"}}>My Vouchers</Typography>
                                    <Typography>View your active and past vouchers</Typography>
                                </Stack>
                            </Grid>

                            <Grid item xs={1} display={"flex"} justifyContent="center" alignItems="center">
                                <KeyboardArrowRightRoundedIcon sx={{ color: 'secondary.main'}}/>
                            </Grid>

                        </Grid>
                    </Stack>

                    <Stack>
                        <Typography variant="h6" sx={{fontWeight: "bold"}} pb={1} pt={2}>Account Settings</Typography>

                        <Grid container spacing={1}>
                            <Grid item xs={2} display={"flex"} justifyContent="center" alignItems="center">
                                <AccountCircleRoundedIcon sx={{ color: 'secondary.main'}} fontSize="large"/>
                            </Grid>
                            
                            <Grid item xs={9}>
                                <Stack>
                                    <Typography sx={{fontWeight: "bold"}}>Your Profile</Typography>
                                    <Typography>Edit and view profile information</Typography>
                                </Stack>
                            </Grid>

                            <Grid item xs={1} display={"flex"} justifyContent="center" alignItems="center">
                                <KeyboardArrowRightRoundedIcon sx={{ color: 'secondary.main'}}/>
                            </Grid>

                        </Grid>
                    </Stack>

                    <Stack>

                        <Typography variant="h6" sx={{fontWeight: "bold"}} pb={1} pt={2}>General</Typography>

                        <Stack>
                            <Grid container spacing={1}>
                                <Grid item xs={2} display={"flex"} justifyContent="center" alignItems="center">
                                    <PhoneRoundedIcon sx={{ color: 'secondary.main'}} fontSize="large"/>
                                </Grid>
                                
                                <Grid item xs={9}>
                                    <Stack>
                                        <Typography sx={{fontWeight: "bold"}}>Contact Us</Typography>
                                        <Typography>Contact or send feedback to us</Typography>
                                    </Stack>
                                </Grid>

                                <Grid item xs={1} display={"flex"} justifyContent="center" alignItems="center">
                                    <KeyboardArrowRightRoundedIcon sx={{ color: 'secondary.main'}}/>
                                </Grid>

                            </Grid>
                       
                            <Grid container spacing={1} sx={{marginTop:"5px"}}>
                                <Grid item xs={2} display={"flex"} justifyContent="center" alignItems="center">
                                    <NotificationsRoundedIcon sx={{ color: 'secondary.main'}} fontSize="large"/>
                                </Grid>
                                
                                <Grid item xs={9}>
                                    <Stack>
                                        <Typography sx={{fontWeight: "bold"}}>Notification</Typography>
                                        <Typography>Manage subscriptions and email settings</Typography>
                                    </Stack>
                                </Grid>

                                <Grid item xs={1} display={"flex"} justifyContent="center" alignItems="center">
                                    <KeyboardArrowRightRoundedIcon sx={{ color: 'secondary.main'}}/>
                                </Grid>
                            </Grid> 
                        </Stack>
                    </Stack>

                        



                </Stack>
            </Container>
        </ThemeProvider>
    )
}