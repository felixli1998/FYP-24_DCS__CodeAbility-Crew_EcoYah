// React Imports
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import IconButton from '@mui/material/IconButton';
import GetAppIcon from '@mui/icons-material/GetApp';

// MUI Imports
import StaffTypography from "../../components/Typography/StaffTypography";
import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  Typography,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Stack,
  Grid,
  TextField,
} from "@mui/material";

// Utils Imports
import DonationEventPreview from "../../components/DonationEvent/DonationEventPreview";
import {
  getDonationEventById,
  updateDonationEventById,
} from "../../services/donationEventApi";
import { generateInstaCaption } from "../../services/openaiApi";
import { uploadImage } from "../../utils/UploadImage";

// Icons
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

// Components
import Step1Form from "../../components/DonationEvent/Step1Form";
import Step2Form from "../../components/DonationEvent/Step2Form";
import Step3Form from "../../components/DonationEvent/Step3Form";
import SimpleDialog from "../../components/Dialog/SimpleDialog";
import PosterGeneratorComponent from "../../components/PosterGenerator/PosterGeneratorComponent";

// Other Imports
import dayjs from "dayjs";
import _ from "lodash";
import {
  TelegramShareButton,
  TelegramIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from "react-share";
import html2canvas from "html2canvas";

export default function DonationEvent() {
  const navigate = useNavigate();
  const { donationEventId } = useParams();
  const [donationEvent, setDonationEventData] = useState<any>();
  const [editMode, setEditMode] = useState<Boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [showMissingFields, setShowMissingFields] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const steps = ["Step 1", "Step 2", "Step 3", "Preview"];
  const [activeStep, setActiveStep] = useState(0);

  const handleDownload = () => {
    const box = document.getElementById('poster-box');
    const SCALE_FACTOR = 2;
    if (!box) return;
    html2canvas(box, {
      scale: SCALE_FACTOR
    })
      .then(canvas => {
        const dataURL = canvas.toDataURL();
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'poster.png';
        link.click();
      });
  };

  const {
    data: donationEventData,
    isLoading: donationEventIsLoading,
    refetch: donationEventRefetch,
  } = useQuery({
    queryKey: ["donation-event-id", donationEventId],
    queryFn: () => getDonationEventById(donationEventId as string),
  });

  const handleData = (key: string, value: any) => {
    setDonationEventData((donationEvent: any) => ({
      ...donationEvent,
      [key]: value,
    }));
  };

  useEffect(() => {
    if (!donationEventIsLoading && donationEventData) {
      const donationEventFetched = donationEventData.data;
      setDonationEventData(donationEventFetched);
      setIsActive(donationEventFetched.isActive);
    }
  }, [donationEventIsLoading, donationEventData]);

  const handleEdit = async () => {
    // If start date already past, only allow toggle of isActive status
    const todayDate = new Date();
    const startDate = new Date(donationEvent.startDate);
    if (startDate < todayDate) {
      handleDialogOpen();
    } else {
      setEditMode(true);
    }
  };

  const { mutateAsync: updateDonationEventMutateAsync } = useMutation({
    mutationKey: ["updateDonationEvent"],
    // mutationFn: Performing the actual API call
    mutationFn: ({
      donationEventId,
      updateParams,
    }: {
      donationEventId: string;
      updateParams: any;
    }) => {
      return updateDonationEventById(donationEventId, updateParams);
    },
    // Execution after successful API call
    onSuccess: (response) => {
      if (response && response.data) {
        setOpenDialog(false);
        donationEventRefetch();
      }
    },
    onError: (error: any) => {
      console.error("Error creating donation event: ", error);
      setErrorMessage("An error occurred while creating the donation event.");
    },
  });

  const updateDonationEdit = async () => {
    try {
      let updateParams: any = {};
      const originalData = donationEventData.data;
      for (const key in donationEvent) {
        updateParams[key] = donationEvent[key];
      }
      if (donationEvent.imageId.includes(";base64,")) {
        const imageId = await uploadImage("events", donationEvent.imageId);
        updateParams["imageId"] = imageId[0];
      }
      const response = await updateDonationEventMutateAsync({
        donationEventId: donationEvent.id,
        updateParams,
      });
      if (response.data.action) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating donation event");
      setErrorMessage("Error updating donation event");
    }
  };

  // === For Donation Event Edit Dialog Related === //
  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setIsActive(donationEvent.isActive);
  };

  const updateDonationIsActive = async () => {
    try {
      const response = await updateDonationEventMutateAsync({
        donationEventId: donationEvent.id,
        updateParams: { isActive: isActive },
      });
    } catch (error) {
      console.error("Error updating donation event");
    }
  };
  // === For Donation Event Edit Dialog Related === //

  // === For Donation Event Form Edit Related === //
  const validateStepForm = async () => {
    switch (activeStep) {
      case 0:
        return donationEvent["name"] && donationEvent["imageId"];
      case 1:
        if (donationEvent["donationEventItems"].length === 0) {
          return false;
        }
        for (const eventItem of donationEvent["donationEventItems"]) {
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
          dayjs(donationEvent["startDate"]).isValid() &&
          dayjs(donationEvent["endDate"]).isValid() &&
          dayjs(donationEvent["startDate"]).isBefore(donationEvent["endDate"])
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

  const form: {
    [key: number]: JSX.Element;
  } = {
    0: (
      <Step1Form
        formData={donationEvent}
        showMissingFields={showMissingFields}
        handleData={handleData}
      />
    ),
    1: (
      <Step2Form
        formData={donationEvent}
        showMissingFields={showMissingFields}
        handleData={handleData}
      />
    ),
    2: (
      <Step3Form
        formData={donationEvent}
        handleData={handleData}
        showMissingFields={showMissingFields}
      />
    ),
    3: (
      <DonationEventPreview
        headerBar={
          <Box display="flex" justifyContent={"center"}>
            <StaffTypography
              type="title"
              size={2.125}
              text={`Preview the Donation Event`}
              customStyles={{ textAlign: "center" }}
            />
          </Box>
        }
        donationEvent={donationEvent}
      />
    ),
  };
  // === For Donation Event Form Edit Related === //

  // === Social Media Sharing Dialog === //
  const SocialMediaSharing = () => {
    const [open, setOpen] = useState<boolean>(false);
    const handleOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    const {
      data: instaGeneratedCaptionData,
      isLoading: instaGeneratedCaptionIsLoading,
      refetch: instaGeneratedCaptionRefetch,
    } = useQuery({
      queryKey: ["generate-instagram-caption", donationEventId],
      queryFn: () => generateInstaCaption(donationEventId as string),
    });

    return (
      <>
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
          onClick={() => handleOpen()}
        >
          Share
        </Button>
        <SimpleDialog
          open={open}
          title={"Share on Social Media"}
          subtitleText={
            "Generate poster and captions and share on social media platforms"
          }
          leftButtonLabel={"Cancel"}
          rightButtonLabel={"Generate"}
          onClose={() => handleClose()}
          handleRightButton={() => instaGeneratedCaptionRefetch()}
        >
          <Box sx={{
            width: "100%",
            marginTop: "2rem"
          }}>
            <Box sx={{
              flexDirection: ["column", "row"],
              display: "flex",
            }}>

              <Box sx={{
                flex: .5,
              }}>
                <PosterGeneratorComponent donationEvent={donationEvent} />
              </Box>
              <Box>
                <TextField
                  label="Caption"
                  id="outlined-multiline-static"
                  multiline
                  defaultValue="Generate caption..."
                  sx={{
                    marginY: 2,
                    width: "20vw",
                  }}
                  value={instaGeneratedCaptionData}
                />
                <StaffTypography type="title" size={1.5} text={`Social Media`} />
                <WhatsappShareButton
                  url={`http://kunyah.eco-yah.com/donation-request-form/${donationEventId}/${_.kebabCase(donationEvent.name)}`}
                  children={<WhatsappIcon size={55} round={true} />}
                  style={{ marginRight: 12 }}
                />
                <TelegramShareButton
                  url={`http://kunyah.eco-yah.com/donation-request-form/${donationEventId}/${_.kebabCase(donationEvent.name)}`}
                  children={<TelegramIcon size={55} round={true} />}
                  style={{ marginRight: 12 }}
                />
                {/* Download Icon */}
                <IconButton onClick={handleDownload} style={{ marginTop: "-43px", padding: 8, backgroundColor: "gray" }}> {/* Adjust padding as needed */}
                  <GetAppIcon fontSize="large" /> {/* Adjust size as needed */}
                </IconButton>
              </Box>
            </Box>
          </Box>
        </SimpleDialog>
      </>
    );
  };
  // === Social Media Sharing Dialog === //

  if (donationEventIsLoading) {
    return <Box>...Loading</Box>;
  }

  return (
    <>
      {/* Preview and Edit isActive (only) */}
      {donationEvent && !editMode && (
        <DonationEventPreview
          headerBar={
            <Box
              display="flex"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <StaffTypography
                type="title"
                size={2.125}
                text={`Donation Event`}
                customStyles={{ textAlign: "center" }}
              />
              <Box>
                <SocialMediaSharing />
                <Button
                  variant="outlined"
                  sx={{
                    fontSize: "1.25rem",
                    letterSpacing: "0.15rem",
                    width: "9.375rem",
                    height: "3.75rem",
                    borderColor: "primary.dark",
                    color: "primary.dark",
                    marginX: "2rem",
                  }}
                  onClick={() => navigate("/admin/donation-events")}
                >
                  Cancel
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
                  onClick={() => handleEdit()}
                >
                  Edit
                </Button>
              </Box>
            </Box>
          }
          donationEvent={donationEvent}
        />
      )}
      {/* Edit Dialog */}
      <SimpleDialog
        open={openDialog}
        onClose={handleDialogClose}
        subtitleText="The donation event has already started. You won't be able to edit the details except for the status."
        title={"Edit Donation Event Status"}
        children={
          <FormControlLabel
            control={
              <Switch
                checked={isActive}
                onClick={() => setIsActive(!isActive)}
                sx={{
                  width: "9rem",
                  height: "5.25rem",
                  marginTop: "2rem",
                  ".MuiSwitch-thumb": {
                    width: "4.4rem",
                    height: "4.1rem",
                    marginLeft: isActive ? "2rem" : null,
                  },
                }}
              />
            }
            label={
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  color: isActive ? "primary.dark" : "secondary.dark",
                  letterSpacing: "0.18rem",
                  marginLeft: "0.5rem",
                  marginTop: "2rem",
                }}
              >
                {isActive ? "Active" : "Inactive"}
              </Typography>
            }
          />
        }
        leftButtonLabel={"Cancel"}
        rightButtonLabel={"Save"}
        handleRightButton={updateDonationIsActive}
      />
      {/* Preview and Edit isActive (only) */}
      {/* Full Edit Mode */}
      {donationEvent && editMode && (
        <>
          <Box sx={{ m: 5 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, i) => (
                <Step key={label}>
                  <StepLabel
                    sx={{
                      ".MuiSvgIcon-root": {
                        width: "3.44rem",
                        height: "3.44rem",
                        borderRadius: "50rem",
                      },
                      ".MuiStepIcon-text": { fontSize: "1rem" },
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
          <Grid container justifyContent="center" sx={{ p: 2 }}>
            <Grid item xs={12} md={8} lg={8} container justifyContent="center">
              <Stack spacing={5}>
                {errorMessage && (
                  <Alert severity="error">
                    The request encountered an issue. Please refresh and try
                    again!
                  </Alert>
                )}
                {form[activeStep]}
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
                      onClick={() => updateDonationEdit()}
                    >
                      UPDATE
                    </Button>
                  )}
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </>
      )}
      {/* Full Edit Mode */}
    </>
  );
}
