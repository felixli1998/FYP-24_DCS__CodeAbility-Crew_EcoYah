import { Box, Typography } from "@mui/material";
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
                backgroundColor: "#546137",
                position: 'relative', // Ensure relative positioning for child elements
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "1rem",
            }}
        >           <BasicOutline
                style={{
                    position: "absolute",
                    opacity: 0.99,
                }}
            />

            <PosterImageBoundingBox
                imageId={donationDetails.images}
                folderPrefix={folderPrefixNames.POSTERS}
                // This style refers to the mask
                style={{
                    width: "1000px",
                    height: "800px",
                    position: "absolute",
                    top: "45px",
                }}
                imageScale={1.1}
                imageLeftShift="-50px"
                imageTopShift="0px" />
            <Box
                sx={{
                    justifyContent: "flex-start",
                    backgroundColor: "rgba(0, 0, 0, 0)",
                    width: "90%",
                    height: "35%",
                    padding: "1rem",
                    marginTop: "800px",
                    overflow: "hidden",
                    zIndex: "5000",
                    position:"relative"
                }}
            >
                <h1
                >
                    {donationDetails.startDate}
                </h1>
                <Typography
                    color="white"
                    variant="h1"
                    gutterBottom
                >
                    {donationDetails.startDate}
                </Typography>
                <Typography
                    color="white"
                    variant="h2"
                    gutterBottom
                >
                    {donationDetails.name}
                </Typography>
                <Typography
                    color="white"
                    variant="h3"
                    gutterBottom
                >
                    {donationDetails.location}
                </Typography>
                <Typography
                    color="white"
                    variant="h3"
                    gutterBottom
                >
                    {donationDetails.donationItems}
                </Typography>

            </Box>

            {/* Add content inside the box here */}
        </Box>
    );
}
