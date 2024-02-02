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
import { USER_ROUTES, GENERAL_ROUTES } from "../../services/routes";
import PinSignIn from "../../components/PinSignIn";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";

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
    const [openPinSignIn, setOpenPinSignIn] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState('');
    const [errorDisplay, setErrorDisplay] = useState('none');
    const [errorMsg, setErrorMsg] = useState('');

    const navigate = useNavigate();

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

    function handleClick(email: string){
        console.log(`Clicked on profile with email: ${email}`);
        setOpenPinSignIn(true);
        setSelectedProfile(email);
    }

    function handleCloseBackdrop(){
        setOpenPinSignIn(false);
    }

    const handleSignIn = async (pin: number) => {
        console.log("Sign in clicked. Profile id: ", selectedProfile);
        console.log("Sign in clicked. pin: ", pin);

        const pinLength = pin.toString().length;
        console.log("Pin length: ", pinLength);

        if(pin === 0 || pinLength === 0){
            setErrorDisplay("block");
            setErrorMsg("Please enter your PIN.");
        }
        else if(pinLength > 0 && pinLength < 4){
            setErrorDisplay("block");
            setErrorMsg("PIN must be 4 digits long.");
        } else {
            try {
                const res: any = await makeHttpRequest('POST', GENERAL_ROUTES.LOGIN, {
                    email: selectedProfile,
                    password: pin.toString()
                });
                console.log(res);

                if(res.data.action){
                    setErrorDisplay("none");
                    localStorage.setItem("ecoyah-email", selectedProfile);
                    navigate("/");
                } else {
                    setErrorDisplay("block");
                    setErrorMsg("An error occurred. Please try again.");
                }
            } catch (error) {
                setErrorDisplay("block");
                setErrorMsg("An error occurred. Please try again.");
                console.error('Error:', error);
            }
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
                            <Grid item md={4} display="flex" justifyContent="center" alignItems="center" key={eachProfile.id} onClick={() => handleClick(eachProfile.email)}>
                                <ProfileCard
                                    id={eachProfile.id}
                                    displayName={eachProfile.name}
                                    imgSrc={eachProfile.imageId}
                                />
                            </Grid>
                        ))}
                    </Grid>

                    <PinSignIn
                        errorMsg={errorMsg}
                        errorDisplay={errorDisplay} 
                        open={openPinSignIn}
                        handleCloseBackdrop={handleCloseBackdrop}
                        handleSignIn={handleSignIn}/>

                </>
            }
            </Container>
        </ThemeProvider>
    )
}