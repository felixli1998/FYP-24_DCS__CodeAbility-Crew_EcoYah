import { Box, Container } from "@mui/material";
import html2canvas from 'html2canvas';

// Internal imports
import BasicTemplate from "../../components/PosterTemplates/BasicTemplate";
export interface DonationDetails {
    startDate: string;
    endDate: string;
    donationItems: string[];
    name: string;
    location: string;
    posterHeight: number;
    posterWidth: number;
    images: string ; // Assuming images can be a single string or an array of strings
}

export default function PosterGenerator() {
    const donationDetails :  DonationDetails = {
        startDate: "2022-01-01",
        endDate: "2022-01-31",
        donationItems: ["Laptop", "Phone", "Tablet"],
        name: "Wasting perfectly good items!",
        location: "1234 Main St, San Francisco, CA 94123",
        posterHeight: 1350,
        posterWidth: 1080,
        images:  "Stock3.jpg"
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
            <BasicTemplate {...donationDetails}/>
            <button onClick={handleDownload}>Download</button>
        </Container>
    )
}
