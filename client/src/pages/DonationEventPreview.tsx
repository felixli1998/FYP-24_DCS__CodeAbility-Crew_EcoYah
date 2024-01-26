import { useEffect } from 'react';
import { Box, Stack, Typography, Accordion, AccordionSummary, AccordionDetails, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import AddIcon from '@mui/icons-material/Add';
import { useLocation, useNavigate } from "react-router-dom";
import moment from 'moment-timezone';

export default function DonationEventPreview() {

    const location = useLocation();
    const navigate = useNavigate();
    const formData = location.state ? JSON.parse(location.state) : null;

    const donationEventDetails: any = {'Name' : 'name', 'Type': 'eventType', 'Period': [ 'startDate', 'endDate'], 'Status': 'isActive'};

    const displayValue = (detail: any) => {
        if (formData && detail === "Status") {
            if (formData[donationEventDetails[detail]]) return "Active";
            else return "Inactive";
        } else if (detail === "Period") {
            return moment(formData[donationEventDetails[detail][0]]).tz('Asia/Singapore').format('DD/MM/YYYY') + " - " + moment(formData[donationEventDetails[detail][1]]).tz('Asia/Singapore').format('DD/MM/YYYY');
        } else {
            return formData[donationEventDetails[detail]];
        } 
    }

    const handleBack = () => {
        navigate("/admin/donation-event-form", { state: 2 });
    }

    // console.log(formData);

    useEffect(() => {
        if (formData === null) {
            navigate("/admin/donation-event-form");
        }
    }, [formData]);
  
    return (
        <Box display="flex" justifyContent="center" sx={{ m: 5 }}>
            <Stack spacing={3}>
                <Typography variant="h4" align="center" gutterBottom sx={{ color: "primary.dark", letterSpacing: "0.255rem", fontWeight: "bold" }}>Preview the Donation Event</Typography>
                <Box
                    component="img"
                    sx={{
                        width: "70rem",
                        height: "25rem",
                        maxWidth: { xs: "22rem", md: "60rem" },
                        maxHeight: { xs: "10rem", md: "45rem" },
                        objectFit: "contain"
                    }}
                    alt={formData && formData['name']}
                    src={formData && formData['imageId']}
                    />
                <Accordion>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    >
                    <Typography variant="h4" gutterBottom sx={{ color: "primary.dark", letterSpacing: "0.225rem", fontWeight: "bold" }}>Donation Event Details</Typography>
                    </AccordionSummary>
                    { formData && Object.keys(donationEventDetails).map((detail: any, i: number)=>{
                        return (
                            <AccordionDetails key={i}>
                                <Typography component={'span'} variant="h5" gutterBottom sx={{ letterSpacing: "0.18rem", marginBottom: "1.5rem" }}>
                                    <span><b>{`${detail}:`}</b> {displayValue(detail)}</span>
                                </Typography>
                            </AccordionDetails> )
                        })
                    }
                </Accordion>
                <Accordion>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                    >
                    <Typography variant="h4" gutterBottom sx={{ color: "primary.dark", letterSpacing: "0.225rem", fontWeight: "bold" }}>Item Details</Typography> 
                    </AccordionSummary>
                    { formData && formData['donationEventItems'].map(function(item: any, i: number) {
                        return (
                            <AccordionDetails key={i}>
                                <Typography component={'span'} variant="h5" gutterBottom sx={{ letterSpacing: "0.18rem", marginBottom: "1.5rem" }}>
                                    <b>{i+1}. {`${item['name']}:`}</b> <br/>
                                    <ul>
                                        <li><b>Minimum Quantity:</b> {item['minQty']} {item['unit']}</li>
                                        <li><b>Target Quantity:</b> {item['targetQty']} {item['unit']}</li>
                                        <li><b>Points Per {item['unit']}:</b> {item['pointsPerUnit']}</li>
                                    </ul>
                                </Typography>
                            </AccordionDetails> )
                    }) }
                </Accordion>
                <Box display="flex" justifyContent="space-between">
                    <Button variant="outlined" sx={{ fontSize: "1.25rem", letterSpacing: "0.15rem", width: "9.375rem", height: "3.75rem", borderColor: "primary.dark", color: "primary.dark" }} startIcon={<ArrowBackIosIcon />} onClick={handleBack}>BACK</Button>
                    <Button variant="contained" sx={{ fontSize: "1.25rem", letterSpacing: "0.15rem", width: "9.375rem", height: "3.75rem", backgroundColor: "primary.dark"}} startIcon={<AddIcon />}>CREATE</Button>
                </Box>
            </Stack>
        </Box>
    );
};