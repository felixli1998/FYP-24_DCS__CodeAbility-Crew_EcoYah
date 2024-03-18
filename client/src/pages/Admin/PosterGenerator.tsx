import { Box, Container } from "@mui/material";
import html2canvas from 'html2canvas';

export default function PosterGenerator() {
    const donationDetails = {
        startDate: "2022-01-01",
        endDate: "2022-01-31",
        donationItems: ["Laptop", "Phone", "Tablet"],
        name: "Wasting perfectly good items!",
        location: "1234 Main St, San Francisco, CA 94123",
        posterHeight: 1350,
        posterWidth: 1080,
    }

    const handleDownload = () => {
        const box = document.getElementById('poster-box');
        if (!box) return;
        html2canvas(box)
            .then(canvas => {
                const dataURL = canvas.toDataURL();
                const link = document.createElement('a');
                link.href = dataURL;
                link.download = 'poster.png';
                link.click();
            });
    };

    return (
        <Container>
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
            >
                {/* Add content inside the box here */}
            </Box>
            <button onClick={handleDownload}>Download</button>
        </Container>
    )
}
