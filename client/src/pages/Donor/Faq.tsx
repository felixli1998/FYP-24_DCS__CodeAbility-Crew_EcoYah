import { Box, Container, Typography, Divider } from "@mui/material";
import { Link } from "react-router-dom";

const questionsAndAnswers = [
  {
    question: "How do I contribute to EcoYah?",
    answer:
      "Scroll through the different donation events on the platform and give your old items a new home by submitting the donation form for that item. If you wish to earn points from the donation, don't forget to tick the checkbox!",
  },
  {
    question: "How do I earn rewards?",
    answer:
      "After submitting the donation form, head down to Kunyah Cafe Food Kiosk to drop the items and points will be credited to your account! You can also participate in 'Donation Of The Week' to earn greater rewards!",
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
          Frequently asked questions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Find answers to common questions about Kunyah below. If you don't find
          what you're looking for, please{" "}
          <Typography
            component="span"
            sx={{ color: "#00796b" }}
            fontWeight={"bold"}
          >
            {/* TODO: link to a contact us page */}
            <Link to={"/"}>contact us</Link>
          </Typography>
          .
        </Typography>
      </Box>
      <Box
        sx={{
          border: 1,
          borderRadius: 2,
          padding: 2,
          borderColor: "lightgrey",
        }}
      >
        {questionsAndAnswers.map((item, index) => (
          <Box key={index}>
            <Typography
              variant="body2"
              sx={{ fontWeight: "bold", marginBottom: 2 }}
            >
              {item.question}
            </Typography>
            <Typography variant="body2" color="text.secondary">
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
