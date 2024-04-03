import { Container } from "@mui/material";

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

export default function PosterGeneratorComponent(props:any) {
    // Below function has been extracted to Poster generator page
    // const handleDownload = () => {
    //     const box = document.getElementById('poster-box');
    //     const SCALE_FACTOR = 2;
    //     if (!box) return;
    //     html2canvas(box,{
    //         scale: SCALE_FACTOR
    //     })
    //         .then(canvas => {
    //             const dataURL = canvas.toDataURL();
    //             const link = document.createElement('a');
    //             link.href = dataURL;
    //             link.download = 'poster.png';
    //             link.click();
    //         });
    // };

    return (
        <Container>
            <BasicTemplate {...props.donationEvent}/>
            {/* <button onClick={handleDownload}>Download</button> */}
        </Container>
    )
};