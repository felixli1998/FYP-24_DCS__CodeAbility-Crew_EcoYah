import { useState, useEffect } from "react";
import { Alert, Box, Button } from "@mui/material";
import StaffTypography from "../../components/Typography/StaffTypography";
import {
  SpeechSynthesisUtteranceType,
  SpeechSynthesisType,
} from "../../utils/Types";

export default function RedemptionToastNotification(props: any) {
  const { data, onAccept, onReject } = props;

  const successSound = require("../../assets/success.mp3");
  const rejectSound = require("../../assets/reject.mp3");
  const [utterance, setUtterance] =
    useState<SpeechSynthesisUtteranceType | null>(null);

  const handleAccept = () => {
    const sound = new Audio(successSound);
    sound.autoplay = true;

    const synth: SpeechSynthesisType = window.speechSynthesis;
    if (utterance) {
      utterance.text = "You have accepted.";
      synth.speak(utterance);

      setTimeout(() => {
        onAccept();
      }, utterance.text.length * 50);
    }
  };

  const handleReject = () => {
    const sound = new Audio(rejectSound);
    sound.autoplay = true;

    const synth: SpeechSynthesisType = window.speechSynthesis;
    if (utterance) {
      utterance.text = "You have rejected.";
      synth.speak(utterance);

      setTimeout(() => {
        onReject();
      }, utterance.text.length * 50);
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
    <>
      <Alert
        severity="info"
        variant="filled"
        sx={{ backgroundColor: "primary.dark", padding: "2rem" }}
      >
        <StaffTypography
          type="title"
          size={2.5}
          text={`${data.name} wants to redeem $${data.points}.`}
          customStyles={{ color: "white" }}
        ></StaffTypography>
        <Box display="flex-start">
          <Button
            variant="contained"
            sx={{
              fontSize: "1.25rem",
              letterSpacing: "0.15rem",
              width: "9rem",
              height: "3.2rem",
              backgroundColor: "white",
              color: "primary.dark",
              marginRight: "2rem",
              "&:hover": {
                backgroundColor: "white",
              },
            }}
            onClick={handleAccept}
          >
            Accept
          </Button>

          <Button
            variant="contained"
            sx={{
              fontSize: "1.25rem",
              letterSpacing: "0.15rem",
              width: "9rem",
              height: "3.2rem",
              backgroundColor: "error.main",
              color: "white",
              "&:hover": {
                backgroundColor: "error.main",
              },
            }}
            onClick={handleReject}
          >
            Reject
          </Button>
        </Box>
      </Alert>
    </>
  );
}
