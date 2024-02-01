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
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { USER_ROUTES } from "../../services/routes";

interface ProfilesType {
    id: number;
    name: string;
    imageId: string;
    email: string;
}

interface ApiResponse {
    status: number;
    data: {
        action: boolean;
        message: Object[]; // Adjust the type based on the actual structure
    };
 }

export default function AdminSignIn() {

    const [profiles, setProfiles] = useState<ProfilesType[]>([]);
    const [errorFetchingProfiles, setErrorFetchingProfiles] = useState(false);

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

    const getAllAdminProfiles = async (): Promise<ApiResponse> => {
        try {
            const response = await makeHttpRequest('GET', USER_ROUTES.ADMIN_LOGIN);
            console.log(response);
            return response as ApiResponse;
        } catch (error) {
            console.error('Error:', error);
            throw error; 
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
              const res = await getAllAdminProfiles();
        
              if (res && res.status === 200) {
                const adminUsers = res.data.message;
                console.log(adminUsers);
                setProfiles(adminUsers as ProfilesType[]);
              } 
            } catch (error) {
              // Handle errors from getAllAdminProfiles or other async operations
              console.error('Error:', error);
              setErrorFetchingProfiles(true);
            }
        }
        fetchData();
    }, []);
    
    return (
        <ThemeProvider theme={theme}>
            <Container sx={{textAlign: "center", marginY: 9}}>
            {errorFetchingProfiles ? 
                <>
                    <ReportProblemIcon sx={{color: "#FF0000", marginBottom: 3, height: "70px", width: "70px"}}/>
                    <Typography variant="h4" sx={{letterSpacing: "0.12em"}}>Error fetching profiles. Please try again later.</Typography>
                </>
                    :
                <>
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
                </>
            }
            </Container>
        </ThemeProvider>
    )
}