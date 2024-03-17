import {
  Box,
  Container,
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

const Mission = () => {
  return (
    <>
      <Typography variant="h4" sx={{ fontWeight: "bold", marginY: 2 }}>
        Kunyah's mission is to serve nice heritage food while rebuilding the
        lives of disabled as chefs.
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ marginBottom: 2 }}>
        Partner with us by donating your used items. Together, we improve social
        equity and inclusion for individuals with disabilities.
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
    </>
  );
};

const Story = () => {
  return <></>;
};

const Team = () => {
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
      description:
        "Experienced chef who unfortunately lost part of his vision.",
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

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: "bold", marginY: 2 }}>
        Our Team
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ marginBottom: 2 }}>
        Meet our founding members and the team.
      </Typography>
      {team.map((member, index) => (
        <Box key={index} sx={{ marginY: 4 }}>
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

const Stats = () => {
  return (
    <Box sx={{ marginTop: 12 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", marginY: 2 }}>
        We approach the workplace as something that adds to our lives and adds
        value to the world.
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ marginBottom: 2 }}>
        Here are the impact that we have made till date.
      </Typography>
      <Box sx={{ bgcolor: "#eceff1", padding: 4, borderRadius: 4 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: 2 }}>
          Rebuilt Lives
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ marginBottom: 2 }}
        >
          Transform the lives of Persons with Disabilites (PWDs)
        </Typography>
        <Typography variant="h4" fontWeight="bold">
          2
        </Typography>
      </Box>
      <Box
        sx={{
          bgcolor: "#263238",
          padding: 4,
          borderRadius: 4,
          marginTop: 2,
          color: "white",
        }}
      >
        <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: 2 }}>
          Meal Served
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          Serving nice heritage food
        </Typography>
        <Typography variant="h4" fontWeight="bold">
          15,000
        </Typography>
      </Box>
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
      <Typography variant="h5" sx={{ fontWeight: "bold", marginY: 2 }}>
        On the Headlines
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

const JoinUs = () => {
  return (
    <Box sx={{ marginTop: 12 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", marginY: 2 }}>
        We're always looking for awesome people to join us
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ marginBottom: 2 }}>
        We are always open to get in touch with like-minded people to support us
        either by ordering our food for your event/catering needs or angels with
        a shared vision to build a sustainable, inclusive and kinder Singapore.
      </Typography>
    </Box>
  );
};

export default function AboutUs() {
  return (
    <Container sx={{ marginTop: 3, marginX: "auto" }}>
      <Box sx={{ marginX: 1, marginY: 4 }}>
        <Mission />
        <Story />
        <Team />
        <Stats />
        <JoinUs />
        <Featured />
      </Box>
    </Container>
  );
}
