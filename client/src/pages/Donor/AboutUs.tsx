import {
  Box,
  Container,
  Grid,
  ImageList,
  ImageListItem,
  Typography,
} from "@mui/material";

// Other Imports
import KunyahGroupPhoto from "../../assets/GroupPhoto.jpeg";
import Aaron from "../../assets/Aaron.jpeg";
import Alex from "../../assets/Alex.png";
import LayHoon from "../../assets/LayHoon.png";
import SiewMay from "../../assets/SiewMay.png";
import Eatbook from "../../assets/Eatbook.png";
import Cna from "../../assets/Cna.png";
import Mothership from "../../assets/Mothership.png";
import Sethlui from "../../assets/Sethlui.png";

const team = [
  {
    name: "Aaron Yeoh",
    title: "Founder",
    description:
      "Social entrepreneur. Have been in youth & community development work since 2009",
    image: Aaron,
  },
  {
    name: "Chan Lay Hoon",
    title: "Co-Founder",
    description:
      "Beside the love to cook, she is also a food scientist and works with Alex on natural flavouring.",
    image: LayHoon,
  },
  {
    name: "Alex Seow",
    title: "Chef",
    description: "Experienced chef who unfortunately lost part of his vision.",
    image: Alex,
  },
  {
    name: "Oh Siew May",
    title: "Assistant Chef",
    description:
      "Home cook born with cerebral palsy, she is highly independent, positive in life and attitude.",
    image: SiewMay,
  },
];

const OurTeam = () => {
  return (
    <Box>
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", textAlign: "center", marginY: 2 }}
      >
        Our Team
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ marginBottom: 2 }}>
        Meet our founding members and the team.
      </Typography>
      {team.map((member, index) => (
        <Box key={index} sx={{ marginY: 2 }}>
          <img
            src={member.image}
            alt="Sample Text"
            width="100%"
            height="300"
            style={{ objectFit: "cover", borderRadius: 20 }}
            loading="lazy"
          />
          <Box>
            <Typography variant="h6" fontWeight="bold" sx={{ marginTop: 1 }}>
              {member.name}
            </Typography>
            <Typography variant="body1">{member.title}</Typography>
            <Typography
              variant="body1"
              sx={{ marginTop: 0.5 }}
              color="text.secondary"
            >
              {member.description}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

const Featured = () => {
  const itemData = [
    {
      img: Sethlui,
      title: "Sethlui",
    },
    {
      img: Mothership,
      title: "Mothership",
    },
    {
      img: Cna,
      title: "CNA",
    },
    {
      img: Eatbook,
      title: "Eatbook",
    },
  ];

  return (
    <>
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", textAlign: "center", marginY: 2 }}
      >
        On the headlines
      </Typography>
      <Box sx={{ border: 1, borderRadius: 4, borderColor: "lightgray" }}>
        <ImageList cols={2}>
          {itemData.map((item) => (
            <ImageListItem key={item.img} sx={{ padding: 2 }}>
              <img
                srcSet={`${item.img}?w=120&h=120&fit=crop&auto=format&dpr=2 2x`}
                src={`${item.img}?w=120&h=120&fit=crop&auto=format`}
                alt={item.title}
                loading="lazy"
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Box>
    </>
  );
};

export default function AboutUs() {
  return (
    <Container sx={{ marginTop: 3, marginX: "auto" }}>
      <Box sx={{ marginX: 1, marginY: 4 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", textAlign: "center", marginY: 2 }}
        >
          Our Mission
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ marginBottom: 2 }}
        >
          Kunyah's mission is to serve nice heritage food while rebuilding the
          lives of disabled as chefs. Partner with us today by donating your
          used items. Together, we improve social equity and inclusion for
          individuals with disabilities.
        </Typography>
        <Box>
          <img
            src={KunyahGroupPhoto}
            alt="Sample Text"
            width="100%"
            height="100%"
            style={{ objectFit: "cover", borderRadius: 20 }}
            loading="lazy"
          />
        </Box>
        <OurTeam />
        <Featured />
      </Box>
    </Container>
  );
}
