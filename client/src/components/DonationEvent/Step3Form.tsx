// MUI Imports
import { Typography, Grid, FormControlLabel, Switch } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

// Components
import StaffTypography from '../Typography/StaffTypography';

// Other Imports
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { FormDataType } from '../../utils/Types';

type Step3FormProps = {
  formData: FormDataType;
  handleData: (key: string, value: any) => void;
};

export default function Step3Form(props: Step3FormProps) {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  const { formData, handleData } = props;
  const { startDate, endDate, isActive } = formData;
  const datePickerFields = ['Start Date', 'End Date'];

  const handleDateChange = (field: string) => (date: Dayjs | null) => {
    if (field === 'Start Date') {
      handleData('startDate', date);
    } else {
      handleData('endDate', date);
    }
  };

  return (
    <>
      <StaffTypography
        type='title'
        size={1.5}
        text='6. Choose the Donation Event Period'
      />
      <Grid container justifyContent='space-between' spacing={1}>
        {datePickerFields.map((field, index) => (
          <Grid item xs={12} md={12} lg={6} key={index}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label={field}
                sx={{ width: 350, marginBottom: '1.5rem' }}
                slotProps={{
                  textField: {
                    placeholder: 'DD/MM/YYYY',
                    // helperText: (
                    //   <StaffTypography
                    //     type='helperText'
                    //     size={1.5}
                    //     text={displayErrorMsg(i)}
                    //   />
                    // ),
                    InputLabelProps: { shrink: true },
                    //   error: displayError(i),
                  },
                }}
                format='DD/MM/YYYY'
                timezone='Asia/Singapore'
                value={
                  field === 'Start Date' ? dayjs(startDate) : dayjs(endDate)
                }
                onChange={handleDateChange(field)}
                disablePast={true}
              />
            </LocalizationProvider>
          </Grid>
        ))}
      </Grid>
      <StaffTypography
        type='title'
        size={1.5}
        text='7. Activate the Donation Event'
      />
      <FormControlLabel
        control={
          <Switch
            checked={isActive}
            onClick={() => handleData('isActive', !isActive)}
            sx={{
              width: '9rem',
              height: '5.25rem',
              '.MuiSwitch-thumb': {
                width: '4.4rem',
                height: '4.1rem',
                marginLeft: isActive ? '2rem' : null,
              },
            }}
          />
        }
        label={
          <Typography
            variant='h5'
            gutterBottom
            sx={{
              color: isActive ? 'primary.dark' : 'secondary.dark',
              letterSpacing: '0.18rem',
              marginLeft: '0.5rem',
            }}
          >
            {isActive ? 'Active' : 'Inactive'}
          </Typography>
        }
      />
    </>
  );
}
