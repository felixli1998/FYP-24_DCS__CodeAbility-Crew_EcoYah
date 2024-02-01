// React Imports
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";

// MUI Imports
import {
  Alert,
  Box,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from "@mui/material";

// Other Imports
import dayjs from "dayjs";

// Icons
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AddIcon from "@mui/icons-material/Add";

// Components
import StaffTypography from "../components/Typography/StaffTypography";

// APIs
import { createDonationEvent } from "../services/donationEventApi";

export default function DonationEventPreview() {
  const location = useLocation();
  const navigate = useNavigate();
  const adminID = 4; // Hardcode for now
  const formData = location.state ? JSON.parse(location.state) : null;
  const [errorMessage, setErrorMessage] = useState<string>("");

  const donationEventDetails: any = {
    Name: "name",
    Type: "eventType",
    Period: ["startDate", "endDate"],
    Status: "isActive",
  };

  const displayValue = (detail: string) => {
    if (detail === "Type") {
      return formData[donationEventDetails[detail]].name;
    } else if (detail === "Status") {
      if (formData[donationEventDetails[detail]]) return "Active";
      else return "Inactive";
    } else if (detail === "Period") {
      return (
        dayjs(formData[donationEventDetails[detail][0]]).format("DD/MM/YYYY") +
        " - " +
        dayjs(formData[donationEventDetails[detail][1]]).format("DD/MM/YYYY")
      );
    } else {
      return formData[donationEventDetails[detail]];
    }
  };

  const handleBack = () => {
    navigate("/admin/donation-event-form", { state: JSON.stringify(formData) });
  };

  const handleCreate = () => {
    createItemMutateAsync({formData: formData, adminID: adminID});
  };

  const { mutateAsync: createItemMutateAsync } = useMutation({
    mutationKey: ["createDonationEvent"],
    // mutationFn: Performing the actual API call
    mutationFn: ({ formData, adminID }: { formData: any, adminID: number }) => {
      return createDonationEvent(formData, adminID);
    },
    // Execution after successful API call
    onSuccess: (response) => {
      if (response && response.data.action) {
        navigate("/admin/donation-events");
        return true;
      }
      return false;
    },
    onError: (error: any) => {
      console.error("Error creating donation event: ", error);
      setErrorMessage("An error occurred while creating the donation event.");
    },
  });

  // console.log(formData);

  useEffect(() => {
    if (formData === null) {
      navigate("/admin/donation-event-form");
    }
  }, [formData]);

  return (
    <Box display="flex" justifyContent="center" sx={{ m: 5 }}>
      <Stack spacing={3}>
       { errorMessage && <Alert severity="error">The request encountered an issue. Please refresh and try again!</Alert> }
        <StaffTypography
          type="title"
          size={2.125}
          text="Preview the Donation Event"
          customStyles={{ textAlign: "center" }}
        />
        <Box
          component="img"
          sx={{
            width: "70rem",
            height: "25rem",
            maxWidth: { xs: "22rem", md: "60rem" },
            maxHeight: { xs: "10rem", md: "45rem" },
            objectFit: "contain",
          }}
          alt={formData && formData["name"]}
          src={formData && formData["imageId"]}
        />
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <StaffTypography
              type="title"
              size={2.125}
              text="Donation Event Details"
              customStyles={{ textAlign: "center" }}
            />
          </AccordionSummary>
          {formData &&
            Object.keys(donationEventDetails).map((detail: any, i: number) => {
              return (
                <AccordionDetails key={i}>
                  <StaffTypography
                    type="title"
                    size={1.5}
                    text={`<b>${detail}</b>: ${displayValue(detail)}`}
                    customStyles={{
                      color: "secondary.main",
                      fontWeight: "none",
                    }}
                  />
                </AccordionDetails>
              );
            })}
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <StaffTypography
              type="title"
              size={2.125}
              text="Item Details"
              customStyles={{ textAlign: "center" }}
            />
          </AccordionSummary>
          {formData &&
            formData["donationEventItems"].map(function (item: any, i: number) {
              return (
                <AccordionDetails key={i}>
                  <StaffTypography
                    type="title"
                    size={1.5}
                    text={`<div><b>${i + 1}. ${item["name"]}:</b><br/>
                                    <ul>
                                        <li><b>Minimum Quantity:</b> ${
                                          item["minQty"]
                                        } ${item["unit"]}</li>
                                        <li><b>Target Quantity:</b> ${
                                          item["targetQty"]
                                        } ${item["unit"]}</li>
                                        <li><b>Points Per ${
                                          item["unit"]
                                        }:</b> ${item["pointsPerUnit"]}</li>
                                    </ul></div>`}
                    customStyles={{
                      color: "secondary.main",
                      fontWeight: "none",
                    }}
                  />
                </AccordionDetails>
              );
            })}
        </Accordion>
        <Box display="flex" justifyContent="space-between">
          <Button
            variant="outlined"
            sx={{
              fontSize: "1.25rem",
              letterSpacing: "0.15rem",
              width: "9.375rem",
              height: "3.75rem",
              borderColor: "primary.dark",
              color: "primary.dark",
            }}
            startIcon={<ArrowBackIosIcon />}
            onClick={handleBack}
          >
            BACK
          </Button>
          <Button
            variant="contained"
            sx={{
              fontSize: "1.25rem",
              letterSpacing: "0.15rem",
              width: "9.375rem",
              height: "3.75rem",
              backgroundColor: "primary.dark",
            }}
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            CREATE
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
