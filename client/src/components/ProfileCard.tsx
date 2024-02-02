import {
    Card,
    CardActionArea,
    Typography
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import RoundProfilePic from "./RoundProfilePic";

const StyledCard = styled(Card)(({ theme }) => ({
    transition: "transform 0.15s ease-in-out",
    "&:hover": { transform: "scale3d(1.3, 1.3, 1)" },
}))

export default function ProfileCard(props: { displayName: string, imgSrc: string, id: number }) {

    const [raised, setRaised] = useState(false);

    function hoverCard(){
        setRaised(true);
    }

    function outHoverCard(){
        setRaised(false);
    }

    // function handleClick(id: number){
    //     console.log(`Clicked on profile with id: ${id}`);
    // }

    return (
        <StyledCard raised={raised} sx={{width: "220px", textAlign: "center", borderRadius: "20%", backgroundColor: "#013B23", marginBottom: "3rem"}}>
            <CardActionArea onMouseOver={()=> hoverCard()} onMouseOut={() => outHoverCard()}>
                <RoundProfilePic altText={"test"} pictureSrc={props.imgSrc}/>
                <Typography variant="h4" color={"white"} sx={{paddingBottom: 3, letterSpacing: "0.12em"}}>{props.displayName}</Typography>
            </CardActionArea>                
        </StyledCard>
    )
}