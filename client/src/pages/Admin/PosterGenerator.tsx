import { Container } from "@mui/material";
import html2canvas from 'html2canvas';
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { DONATION_EVENT_ROUTES } from "../../services/routes";
import axios from "axios";


// Internal imports
import BasicTemplate from "../../components/PosterTemplates/BasicTemplate";

export interface IDonationDetails {
    name: string,
    startDate: string,
    endDate: string,
    imageId: string,
    donationEventItems: any,
    location?: string,
};

const defaultDonationDetails: IDonationDetails = {
    startDate: "",
    endDate: "",
    imageId: "",
    donationEventItems: [],
    name: ""
};

export default function PosterGenerator() {
    const { donationEventId } = useParams(); // Fetching the donationEventId from the URL
    const [donationEventDetails, setDonationEventDetails] = useState<IDonationDetails>(defaultDonationDetails);
    useEffect(() => {
        if (!donationEventId) setDonationEventDetails(defaultDonationDetails);
        else {
            axios
                .get(DONATION_EVENT_ROUTES.BY_ID.replace(":id", donationEventId))
                .then((resp) => {
                    console.log(resp.data.data);
                    setDonationEventDetails(resp.data.data);
                })
            // Make axios call to fetch the donation event details
        }
    }, [donationEventId]);
    if (!donationEventId) return <div>Please enter a donation event ID.</div>;

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
            <BasicTemplate {...donationEventDetails} />
            <button onClick={handleDownload}>Download</button>
        </Container>
    )
}
