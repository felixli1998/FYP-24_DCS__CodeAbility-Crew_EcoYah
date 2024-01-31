import {
    Container,
    Grid,
    ThemeProvider,
    Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import ProfileCard from "../../components/ProfileCard";
import { theme } from "../../styles/Palette";
import { makeHttpRequest } from "../../utils/Utility";

interface ProfilesType {
    id: number;
    name: string;
    imageId: string;
    email: string;
  }

export default function AdminSignIn() {

    const [profiles, setProfiles] = useState<ProfilesType[]>([]);

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

    const getAllAdminProfiles = async () => {
        const response: any = await makeHttpRequest('GET', BACKEND_URL + '/users/allAdmins');
        // const data = response.adminUsers;
        const data = response.data.message;

        console.log(data);
    
        setProfiles(data);
    }

    useEffect(() => {
        getAllAdminProfiles();
    }, []);
    
    return (
        <ThemeProvider theme={theme}>
            <Container sx={{textAlign: "center", marginY: 9}}>
                <Typography variant="h3" sx={{marginBottom: 3}}>Welcome Back, Admin.</Typography>
                <Typography variant="h4" sx={{marginBottom: 6}}>Choose your profile.</Typography>
            
                <Grid container>
                    {profiles.map(eachProfile => (
                        <Grid item md={4} display="flex" justifyContent="center" alignItems="center" key={eachProfile.id}>

                            <ProfileCard
                                id={eachProfile.id}
                                displayName={eachProfile.name}
                                imgSrc={eachProfile.imageId}
                            />
                        </Grid>
                    ))}
                </Grid>

            </Container>

        </ThemeProvider>
    )
}