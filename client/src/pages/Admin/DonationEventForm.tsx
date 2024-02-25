// React Imports
import {useState} from "react";
import {useMutation} from "@tanstack/react-query";

// MUI Imports
import {
  Alert,
  Stack,
  Box,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Button,
} from "@mui/material";

// Icons
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

// Components
import StaffTypography from "../../components/Typography/StaffTypography";
import Step1Form from "../../components/DonationEvent/Step1Form";
import Step2Form from "../../components/DonationEvent/Step2Form";
import Step3Form from "../../components/DonationEvent/Step3Form";

// Other Imports
import dayjs from "dayjs";
import {useNavigate} from "react-router-dom";
import axios from 'axios';
import { IMAGE_ROUTES } from "../../services/routes";

// Utils Imports
import {FormDataType} from "../../utils/Types";
import DonationEventPreview from "../../components/DonationEvent/DonationEventPreview";
import {createDonationEvent} from "../../services/donationEventApi";

export default function DonationEventForm() {
  const navigate = useNavigate();
  const adminID = Number(localStorage.getItem('admin-id')); 
  const steps = ["Step 1", "Step 2", "Step 3", "Preview"];
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    imageId: "",
    startDate: new Date(),
    endDate: new Date(),
    isActive: false,
    donationEventItems: [],
    createdBy: 0,
  });
  const [showMissingFields, setShowMissingFields] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const validateStepForm = async () => {
    switch (activeStep) {
      case 0:
        return formData["name"] && formData["imageId"];
      case 1:
        if (formData["donationEventItems"].length === 0) {
          return false;
        }
        for (const eventItem of formData["donationEventItems"]) {
          for (const [key, value] of Object.entries(eventItem)) {
            if (
              key !== "currentQty" &&
              (!value || (typeof value === "number" && value <= 0))
            ) {
              return false;
            }
          }
        }
        return true;
      case 2:
        return (
          dayjs(formData["startDate"]).isValid() &&
          dayjs(formData["endDate"]).isValid()
        );
      default:
        return false;
    }
  };

  const handleNext = async () => {
    const isStepFormValid = await validateStepForm();
    if (isStepFormValid) {
      setActiveStep(activeStep + 1);
      setShowMissingFields(false);
    } else {
      setShowMissingFields(true);
    }
    return isStepFormValid;
  };

  const handleBack = () => {
    if (activeStep === 0) {
      navigate(-1); // Previous page based on URL
    }
    setActiveStep(activeStep - 1);
    setShowMissingFields(false);
  };

  const handleData = (key: string, value: any) => {
    setFormData((formData) => ({...formData, [key]: value}));
  };

  console.log(formData);

  const {mutateAsync: createItemMutateAsync} = useMutation({
    mutationKey: ["createDonationEvent"],
    // mutationFn: Performing the actual API call
    mutationFn: ({
      formData,
      adminID,
    }: {
      formData: FormDataType;
      adminID: number;
    }) => {
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

  const handleCreate = async () => {
    const fileData = new FormData();
    fileData.append("file", formData['imageId']);
    fileData.append("folderPrefix", 'events');

    let s3Image: string;
    try {
      const response = await axios.post(
        IMAGE_ROUTES.CREATE,
        fileData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        console.log(response)
        console.log(`${response.data.data.filename} uploaded successfully`);
        s3Image = response.data.data.filename;
      } else {
        console.error("Failed to update image");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setFormData((prevData: FormDataType) => ({
      ...prevData, 
      imageId: s3Image
    }));
    console.log(formData);
    createItemMutateAsync({formData: formData, adminID: adminID});
  };

  const form: {
    [key: number]: JSX.Element;
  } = {
    0: (
      <Step1Form
        formData={formData}
        showMissingFields={showMissingFields}
        handleData={handleData}
      />
    ),
    1: (
      <Step2Form
        formData={formData}
        showMissingFields={showMissingFields}
        handleData={handleData}
      />
    ),
    2: (
      <Step3Form
        formData={formData}
        handleData={handleData}
      />
    ),
    3: (
      <DonationEventPreview
        headerBar={
          <Box
            display="flex"
            justifyContent={"center"}
          >
            <StaffTypography
              type="title"
              size={2.125}
              text={`Preview the Donation Event`}
              customStyles={{textAlign: "center"}}
            />
          </Box>
        }
        donationEvent={formData}
        action={'create'}
      />
    ),
  };

  return (
    <>
      <Box sx={{m: 5}}>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
        >
          {steps.map((label, i) => (
            <Step key={label}>
              <StepLabel
                sx={{
                  ".MuiSvgIcon-root": {
                    width: "3.44rem",
                    height: "3.44rem",
                    borderRadius: "50rem",
                  },
                  ".MuiStepIcon-text": {fontSize: "1rem"},
                }}
              >
                <StaffTypography
                  type="title"
                  size={1.5}
                  text={label}
                  customStyles={{
                    color: activeStep >= i ? "primary.main" : "",
                  }}
                />
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      <Grid
        container
        justifyContent="center"
        sx={{p: 2}}
      >
        <Grid
          item
          xs={12}
          md={10}
          lg={10}
          container
          justifyContent="center"
        >
          <Stack spacing={5}>
            {errorMessage && (
              <Alert severity="error">
                The request encountered an issue. Please refresh and try again!
              </Alert>
            )}
            {form[activeStep]}
            <Box
              display="flex"
              justifyContent="space-between"
            >
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
                startIcon={activeStep !== 0 && <ArrowBackIosIcon />}
                onClick={handleBack}
              >
                {activeStep === 0 ? "CANCEL" : "BACK"}
              </Button>
              {activeStep < 3 ? (
                <Button
                  variant="contained"
                  sx={{
                    fontSize: "1.25rem",
                    letterSpacing: "0.15rem",
                    width: "9.375rem",
                    height: "3.75rem",
                    backgroundColor: "primary.dark",
                  }}
                  endIcon={<ArrowForwardIosIcon />}
                  onClick={handleNext}
                >
                  NEXT
                </Button>
              ) : (
                <Button
                  variant="contained"
                  sx={{
                    fontSize: "1.25rem",
                    letterSpacing: "0.15rem",
                    width: "9.375rem",
                    height: "3.75rem",
                    backgroundColor: "primary.dark",
                  }}
                  endIcon={<ArrowForwardIosIcon />}
                  onClick={handleCreate}
                >
                  CREATE
                </Button>
              )}
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
