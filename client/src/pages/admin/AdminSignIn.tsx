import { useState, useEffect } from "react";
import {styled} from "@mui/material/styles";
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
    Stack
  } from "@mui/material";
import RoundProfilePic from "../../components/RoundProfilePic";
import {theme} from "../../styles/Palette";

import profilePic from "../../assets/ProfilePicture.png";

// interface ProfileCardProps {
// displayName: string;
// username: string;
// }

// const ProfileCard: React.FC<ProfileCardProps> = ({
//     displayName,
//     username }) => {
//         return (
//             <Card sx={{maxWidth: "220px", textAlign: "center", borderRadius: "20%", backgroundColor: "#013B23"}}>
//                 <CardActionArea onMouseOver={()=> console.log("hovered")}>
//                     <RoundProfilePic altText={"test"} pictureSrc={profilePic}/>
//                     <Typography variant="h5" color={"white"} sx={{paddingBottom: 3}}>{displayName}</Typography>
//                 </CardActionArea>                
//             </Card>
//         )
//     }
// const useStyles = makeStyles({
//     root: {
//       maxWidth: 310,
//       transition: "transform 0.15s ease-in-out"
//     },
//     cardHovered: {
//       transform: "scale3d(1.05, 1.05, 1)"
//     }
//   });
const StyledCard = styled(Card)(({ theme }) => ({
    transition: "transform 0.15s ease-in-out",
    "&:hover": { transform: "scale3d(1.3, 1.3, 1)" },
  }))

function ProfileCard(props: { displayName: string, username: string }) {

    const [raised, setRaised] = useState(false);

    function hoverCard(){
        console.log("hovered");
        setRaised(true);
    }

    function outHoverCard(){
        console.log("hovered out");
        setRaised(false);
    }

    return (
        <StyledCard raised={raised} sx={{maxWidth: "220px", textAlign: "center", borderRadius: "20%", backgroundColor: "#013B23"}}>
            <CardActionArea onMouseOver={()=> hoverCard()} onMouseOut={() => outHoverCard()}>
                <RoundProfilePic altText={"test"} pictureSrc={profilePic}/>
                <Typography variant="h5" color={"white"} sx={{paddingBottom: 3}}>{props.displayName}</Typography>
            </CardActionArea>                
        </StyledCard>
    )
}

export default function AdminSignIn() {

    const [profiles, setProfiles] = useState([]);
    
    return (
        <ThemeProvider theme={theme}>
            <Container sx={{textAlign: "center", marginY: 9}}>
                <Typography variant="h2" sx={{marginBottom: 5}}>Welcome Back, Admin.</Typography>
                <Typography variant="h3" sx={{marginBottom: 3}}>Choose your profile.</Typography>
            
            <Stack direction="row" spacing={2}>

                <ProfileCard
                    displayName={"Name"}
                    username={"test-userName"}
                />

                <ProfileCard
                    displayName={"Name"}
                    username={"test-userName"}
                />
            </Stack>
            </Container>

        </ThemeProvider>
    )
}