import {
    Container,
    Grid,
    ThemeProvider,
    Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import StaffTypography from "../../components/Typography/StaffTypography";
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
        message: Object[];
    };
 }

export default function AdminSignIn() {

    const [profiles, setProfiles] = useState<ProfilesType[]>([]);
    const [errorFetchingProfiles, setErrorFetchingProfiles] = useState(false);

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
                    <StaffTypography type="title" size={3} text="Welcome Back, Admin." customStyles={{ color: "secondary.main", marginBottom: "3rem" }} />
                    <StaffTypography type="title" size={2.125} text="Choose Your Profile." customStyles={{ color: "secondary.main", marginBottom: "5rem" }} />
                    <Grid container justifyContent="center">
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