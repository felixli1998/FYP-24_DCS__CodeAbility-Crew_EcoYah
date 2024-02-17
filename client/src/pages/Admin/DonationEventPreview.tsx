// MUI Imports
import {
  Box,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';

// Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Components
import StaffTypography from '../../components/Typography/StaffTypography';

// Other Imports
import dayjs from 'dayjs';

// Utils Imports
import { DonationEventItems } from '../../utils/Types';

type DonationEventType = {
  donationEvent: {
    name: string;
    donationEventItems: DonationEventItems[];
    imageId: string;
    isActive: boolean;
    startDate: Date;
    endDate: Date;
  };
  headerBar: any;
};

export default function DonationEventPreview(props: DonationEventType) {
  const { donationEvent, headerBar } = props;
  const { name, imageId, startDate, endDate, isActive, donationEventItems } =
    donationEvent;

  const donationEventDetails: any = {
    Name: name,
    Period: `${dayjs(startDate).format('DD/MM/YYYY')} - ${dayjs(endDate).format(
      'DD/MM/YYYY'
    )}`,
    Status: isActive,
  };

  return (
    <Box display='flex' justifyContent='center' sx={{ m: 5 }}>
      <Stack spacing={3}>
        {headerBar}
        <Box
          component='img'
          sx={{
            width: '70rem',
            height: '25rem',
            maxWidth: { xs: '25rem', md: '80rem' },
            maxHeight: { xs: '15rem', md: '45rem' },
            paddingBottom: { xs: 2, md: 5 },
            objectFit: 'contain',
          }}
          alt={name}
          src={imageId}
        />
        <Accordion>
          <AccordionSummary
            expandIcon={
              <ExpandMoreIcon
                sx={{
                  color: 'primary.dark',
                  width: '2.75rem',
                  height: '2.75rem',
                }}
              />
            }
            aria-controls='panel1-content'
            id='panel1-header'
          >
            <StaffTypography
              type='title'
              size={2.125}
              text='Donation Event Details'
              customStyles={{ textAlign: 'center' }}
            />
          </AccordionSummary>
          <Divider />
          {donationEvent &&
            Object.keys(donationEventDetails).map((detail: any, i: number) => {
              return (
                <AccordionDetails key={i}>
                  <StaffTypography
                    type='title'
                    size={1.5}
                    text={`<b>${detail}</b>: ${donationEventDetails[detail]}`}
                    customStyles={{
                      color: 'secondary.main',
                      fontWeight: 'none',
                      marginTop: '1.5rem',
                    }}
                  />
                </AccordionDetails>
              );
            })}
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={
              <ExpandMoreIcon
                sx={{
                  color: 'primary.dark',
                  width: '2.75rem',
                  height: '2.75rem',
                }}
              />
            }
            aria-controls='panel2-content'
            id='panel2-header'
          >
            <StaffTypography
              type='title'
              size={2.125}
              text='Item Details'
              customStyles={{ textAlign: 'center' }}
            />
          </AccordionSummary>
          <Divider />
          {donationEventItems &&
            donationEventItems.map(function (
              donationEventItem: DonationEventItems,
              i: number
            ) {
              return (
                <AccordionDetails key={i}>
                  <StaffTypography
                    type='title'
                    size={1.5}
                    text={`<div><b>${i + 1}. ${
                      donationEventItem.item.name
                    }:</b><br/>
                            <ul>
                                <li><b>Minimum Quantity:</b> ${
                                  donationEventItem.minQty
                                } ${donationEventItem.item.unit}</li>
                                <li><b>Target Quantity:</b> ${
                                  donationEventItem.targetQty
                                } ${donationEventItem.item.unit}</li>
                                <li><b>Points Per ${
                                  donationEventItem.item.unit
                                }:</b> ${donationEventItem.pointsPerUnit}</li>
                            </ul></div>`}
                    customStyles={{
                      color: 'secondary.main',
                      fontWeight: 'none',
                      marginTop: '1.5rem',
                    }}
                  />
                </AccordionDetails>
              );
            })}
        </Accordion>
      </Stack>
    </Box>
  );
}
