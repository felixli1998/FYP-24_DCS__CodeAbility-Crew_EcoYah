import { useState, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

type DateTimePickerValueType = {
  label: string;
  onDateTimeChange: (dateTime: Dayjs | null) => void;
  validateForm: boolean;
};

export default function DateTimePickerValue(props: DateTimePickerValueType) {
  const [value, setValue] = useState<Dayjs | null>(null);

  const twelvePM = dayjs().set('hour', 12).startOf('hour');
  const twoPM = dayjs().set('hour', 14).startOf('hour');

  const calculateTimeRange = () => {
    const currentHour = dayjs().hour();
    let minDate: dayjs.Dayjs = dayjs();
    let minTime: dayjs.Dayjs | null = null;
    let maxTime: dayjs.Dayjs | null = twoPM;

    if (currentHour <= 12) {
      minTime = twelvePM;
    } else if (currentHour >= 14) {
      minDate = dayjs().add(1, 'day');
      minTime = dayjs().add(1, 'day').set('hour', 12).startOf('hour');
    }

    return { minDate, minTime, maxTime };
  };

  const { minDate, minTime, maxTime } = calculateTimeRange();

  // update the final state of the date time value to parent component
  useEffect(() => {
    props.onDateTimeChange(value);
  }, [value]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        label={props.label}
        minDate={minDate}
        minTime={minTime}
        maxTime={maxTime}
        minutesStep={30}
        value={value}
        onChange={(newValue) => setValue(newValue)}
        slotProps={{
          textField: {
            InputLabelProps: { shrink: true },
            error: props.validateForm && value === null,
            helperText:
              props.validateForm &&
              value === null &&
              'Please choose a date and time',
          },
        }}
      />
    </LocalizationProvider>
  );
}
