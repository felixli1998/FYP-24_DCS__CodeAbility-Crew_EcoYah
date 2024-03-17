import { Box, Container, Typography, Divider } from "@mui/material";
import { Link } from "react-router-dom";

const questionsAndAnswers = [
  {
    question: "How do I contribute to EcoYah?",
    answer:
      "Scroll through the different donation events on the platform and give your old items a new home by submitting the donation request form. If you wish to earn cashback from the donation, don't forget to tick the checkbox!",
  },
  {
    question: "How do I earn cashback?",
    answer:
      "After submitting the donation request form, head down to Kunyah Cafe Food Kiosk to drop the items and the cashback will be credited to your account!",
  },
  {
    question: "Where should I drop off the items?",
    answer:
      "The drop-off location is at Kunyah Cafe Food Kiosk. The address is 90 Stamford Rd, #01-76 Opposite YMCA, Singapore 178903.",
  },
  {
    question:
      "I have things to donate but they're not listed. What should I do?",
    answer:
      "You can contact Kunyah Cafe directly via email to reach out for other collaboration opportunities.",
  },
];

export default function Faq() {
  return (
    <Container sx={{ marginTop: 3, marginX: "auto" }}>
      <Box sx={{ marginY: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", marginY: 2 }}>
          Frequently Asked Questions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Find answers to common questions about Kunyah below. If you can't find
          what you're looking for, please{" "}
          <Typography
            component="span"
            sx={{ color: "primary.main" }}
            fontWeight={"bold"}
          >
            {/* TODO: link to a contact us page */}
            <Link to={"/"}>contact us!</Link>
          </Typography>
        </Typography>
      </Box>
      <Box
        sx={{
          padding: 2,
        }}
      >
        {questionsAndAnswers.map((item, index) => (
          <Box key={index}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", marginBottom: 2 }}
            >
              {item.question}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {item.answer}
            </Typography>
            {questionsAndAnswers.length - 1 !== index && (
              <Divider sx={{ marginY: 2 }} />
            )}
          </Box>
        ))}
      </Box>
    </Container>
  );
}
