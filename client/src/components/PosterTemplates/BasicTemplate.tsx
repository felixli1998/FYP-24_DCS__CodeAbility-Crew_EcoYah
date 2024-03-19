import { Box } from "@mui/material";
import PosterImageBoundingBox from "./PosterImageBoundingBox"
import { DonationDetails } from "../../pages/Admin/PosterGenerator";

// Internal
import { ReactComponent as BasicOutline } from "../../assets/poster_assets/BasicOutline.svg";
import { folderPrefixNames } from "../Image/Image";

export default function BasicTemplate(donationDetails: DonationDetails) {
    console.log(donationDetails);
    return (
        <Box
            id="poster-box"
            sx={{
                width: donationDetails.posterWidth,
                height: donationDetails.posterHeight,
                backgroundColor:  "#546137",
                position: 'relative', // Ensure relative positioning for child elements
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "1rem",
            }}
        >
            <BasicOutline 
                style={{ 
                    position: "absolute", 
                    zIndex:1,
                }} 
            />
            <PosterImageBoundingBox 
                imageId={donationDetails.images}
                folderPrefix={folderPrefixNames.POSTERS}
                // This style refers to the mask
                style={{
                    width:"1000px",
                    height:"800px",
                    position: "absolute",
                    top: "45px",
                }}
                imageScale={1.1}
                imageLeftShift="-50px"
                imageTopShift="0px" />
    
            {/* Add content inside the box here */}
        </Box>
    );
}
