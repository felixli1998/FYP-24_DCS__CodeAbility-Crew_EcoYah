import { Box, Typography } from "@mui/material";
// Internal
import { ReactComponent as BasicOutline } from "../../assets/poster_assets/BasicOutline.svg";
import { folderPrefixNames } from "../Image/Image";
import PosterImageBoundingBox from "./PosterImageBoundingBox"
import { IDonationDetails } from "../../pages/Admin/PosterGenerator";
import KunyahLogo from "../../assets/Kunyah.png";
import EcoyahLogo from "../../assets/EcoYah.png";

export default function BasicTemplate(donationDetails: IDonationDetails) {
    const SCALE_FACTOR = 2;
    function dateStringToDayMonthYear(dateString: string) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        return `${day} ${month} `;
    };

    let items = "";
    if (donationDetails.donationEventItems) {
        for (const item of donationDetails.donationEventItems) {
            items += item.item.name + " | ";
        }
    }
    items = items.slice(0, -3);

    return (
        <Box
            id="poster-box"
            sx={{
                width: `${1080 / SCALE_FACTOR}px`,
                height: `${1350 / SCALE_FACTOR}px`,
                backgroundColor: "#29AB87",
                position: 'relative', // Ensure relative positioning for child elements
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "1rem",
            }}
        >
            {/* Logos */}
            <Box >
                <img
                    srcSet={KunyahLogo}
                    src={KunyahLogo}
                    alt={"Home"}
                    style={{
                        width: `${115 / SCALE_FACTOR}px`,
                        height: `${115 / SCALE_FACTOR}px`,
                        position: "absolute",
                        bottom: "20px",
                        right: "20px",
                        zIndex: 100,
                    }}
                />
                <img

                    srcSet={EcoyahLogo}
                    src={EcoyahLogo}
                    alt={"Home"}
                    style={{
                        borderRadius: "50%",
                        width: `${115 / SCALE_FACTOR}px`,
                        height: `${115 / SCALE_FACTOR}px`,
                        position: "absolute",
                        bottom: "20px",
                        right: "85px",
                        zIndex: 100,
                    }}
                />
                <div style={{ 
                    backgroundColor: "#29AB87", 
                    borderRadius: "100%",
                    width: `${115 / SCALE_FACTOR}px`, height: `${115 / SCALE_FACTOR}px`, 
                    position: "absolute", 
                    bottom: "20px",
                    right: "20px", zIndex: 50 }}></div>

            </Box>
            <BasicOutline
                style={{
                    position: "absolute",
                    opacity: 1,
                    zIndex: 15,
                    backgroundColor: "rgba(0, 0, 0, 0)",
                }}
            />
            {donationDetails.imageId + "abc " + folderPrefixNames.EVENTS}

            {donationDetails.imageId && ( // Check if imageId is not null or undefined
                <PosterImageBoundingBox
                    imageId={donationDetails.imageId}
                    folderPrefix={folderPrefixNames.EVENTS}
                    // This style refers to the mask
                    style={{
                        width: `${1000 / SCALE_FACTOR}px`,
                        height: `${800 / SCALE_FACTOR}px`,
                        position: "absolute",
                        top: `${40 / SCALE_FACTOR}px`,
                    }}
                    imageScale={1.2}
                    imageLeftShift="-50px"
                    imageTopShift="0px"
                />
            )}
            <Box
                sx={{
                    justifyContent: "flex-start",
                    backgroundColor: "rgba(0, 0, 0, 0)",
                    width: "100%",
                    height: "35%",
                    padding: "1rem",
                    marginTop: `${605 / SCALE_FACTOR}px`,
                    overflow: "hidden",
                    zIndex: "5000",
                    position: "relative"
                }}
            >
                <Typography
                    color="white"
                    variant="h1"
                    style={{
                        fontFamily: 'Open Sans, sans-serif',
                        fontWeight: 700, // Apply bold (700 weight) style
                        fontSize: "2rem",
                    }}
                >
                    {dateStringToDayMonthYear(donationDetails.startDate)}
                </Typography>
                <Typography
                    color="white"
                    variant="h2"
                    style={{
                        fontFamily: 'Open Sans, sans-serif',
                        fontSize: "1rem",
                    }}
                >
                    {donationDetails.name}
                </Typography>
                <Typography
                    color="white"
                    variant="h3"
                    style={{
                        fontFamily: 'Open Sans, sans-serif',
                        fontSize: "1rem",
                    }}
                    gutterBottom
                >
                    {donationDetails.location}
                </Typography>
                <Typography
                    color="#29AB87"
                    variant="h5"
                    style={{
                        fontFamily: 'Open Sans, sans-serif',
                        fontSize: "0.9rem",
                    }}
                >
                    We are looking for the following items:
                </Typography>
                <Typography
                    color="white"
                    variant="h3"
                    style={{
                        fontFamily: 'Open Sans, sans-serif',
                        fontSize: "1.5rem",
                    }}
                    gutterBottom
                >
                    {items}
                </Typography>
                <Typography
                    marginTop={2}
                    color="white"
                    variant="h5"
                    style={{
                        fontFamily: 'Open Sans, sans-serif',
                        fontSize: "1rem",
                    }}>
                    Sign up below to donate and receive points! <br />Let's make a difference together.
                </Typography>
            </Box>
        </Box>
    );
}
