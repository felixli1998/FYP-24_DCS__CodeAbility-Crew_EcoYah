import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { SpeechSynthesisUtteranceType, SpeechSynthesisType } from "../../utils/Types";

const notificationStyle = {
    fontSize: '50px',
    padding: '10px',
    minHeight: '33vh', // Set the minimum height here
    color: 'white',
    backgroundColor: 'green'
};

export default function RedemptionToastNotification(props: any) {
    console.log("RedemptionToastNotification", props)
    const data = props.toastProps.data;
    
    const successSound = require("../../assets/success.mp3");
    const rejectSound = require("../../assets/reject.mp3");
    const [utterance, setUtterance] = useState<SpeechSynthesisUtteranceType | null>(null);

    const handleAccept = () => {
        props.closeToast();
        const sound = new Audio(successSound);
        sound.play();

        const synth: SpeechSynthesisType = window.speechSynthesis;
        if (utterance) {
            utterance.text = "You have accepted.";
            synth.speak(utterance);
        }
    }
    const handleReject = () => {
        props.closeToast();
        const sound = new Audio(rejectSound);
        sound.play();

        const synth: SpeechSynthesisType = window.speechSynthesis;
        if (utterance) {
            utterance.text = "You have rejected.";
            synth.speak(utterance);
        }
    };

    useEffect(() => {
        const synth: SpeechSynthesisType = window.speechSynthesis;
        const speechSynthesisUtterance = new SpeechSynthesisUtterance();
        setUtterance(speechSynthesisUtterance);

        return () => {
            synth.cancel();
        };
    }, []);

    
    return (
        <div style={notificationStyle}>
            <div style={{ marginBottom: '10px' }}>
                <strong>Cashback Request</strong>
            </div>
            <div style={{ marginBottom: '10px' }}>
                User {data.id} wants to redeem ${data.points}.
            </div>

            <Button 
                onClick={handleAccept} 
                variant="contained" 
                color="secondary" 
                size="large"
            >
                Accept
            </Button>

            <Button 
                onClick={handleReject} 
                variant="contained" 
                color="secondary" 
                size="large"
            >
                Reject
            </Button>
        </div>
    );
};
