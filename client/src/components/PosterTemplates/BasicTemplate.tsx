import { Box } from "@mui/material";
import Image, { folderPrefixNames } from "../../components/Image/Image";
import { DonationDetails } from "../../pages/Admin/PosterGenerator";

export default function BasicTemplate(donationDetails: DonationDetails) {
    console.log(donationDetails)
    return (
        <Box
        id="poster-box"
        sx={{
            width: donationDetails.posterWidth,
            height: donationDetails.posterHeight,
            backgroundColor: "red",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "1rem",
        }}
    >{donationDetails.name}
        <Image
            imageId={donationDetails["images"]}
            width="100%"
            height={275}
            folderPrefix={folderPrefixNames.POSTERS}
        />
        {/* Add content inside the box here */}
    </Box>
    )
}