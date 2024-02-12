import { useState, useEffect } from 'react';
import { Dayjs } from 'dayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

type DatePickerValueType = {
  label: string;
  onDateChange: (dateTime: Dayjs | null) => void;
  validateForm?: boolean;
};

export default function DatePickerValue(props: DatePickerValueType) {
  const [value, setValue] = useState<Dayjs | null>(null);

  // update the final state of the date value to parent component
  useEffect(() => {
    props.onDateChange(value);
  }, [value]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={props.label}
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
        format='DD/MM/YYYY'
        sx={{ width: 350, marginBottom: '1.5rem' }}
      />
    </LocalizationProvider>
  );
}
