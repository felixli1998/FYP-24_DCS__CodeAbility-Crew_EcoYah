import { useState, useEffect } from "react";
import {
    Box,
    Container,
    ThemeProvider,
    Typography,
    Avatar,
    ListItemAvatar,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    IconButton,
    Card,
    CardContent,
    CardActionArea,
    CardMedia,
  } from "@mui/material";
  import RoundProfilePic from "../../components/RoundProfilePic";
  import {theme} from "../../styles/Palette";

  interface ProfileCardProps {
    displayName: string;
    username: string;
  }

const ProfileCard: React.FC<ProfileCardProps> = ({
    displayName,
    username }) => {
        return (
            <Card sx={{maxWidth: "300px", textAlign: "center"}}>
                <CardActionArea>
                <RoundProfilePic altText={"test"} pictureSrc="../assets/EcoYah.png"/>
                </CardActionArea>                
            </Card>
        )
    }

export default function AdminSignIn() {
    
    return (
        <ThemeProvider theme={theme}>
            <Container sx={{textAlign: "center"}}>
                <Typography variant="h2">Welcome Back, Admin.</Typography>
                <Typography variant="h2">Choose your profile.</Typography>
            
                <ProfileCard
                    displayName={"Test"}
                    username={"Test"}
                />
            </Container>

        </ThemeProvider>
    )
}