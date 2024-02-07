import { useState, useEffect } from 'react';
import { Dayjs } from 'dayjs';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

type DateTimePickerValueType = {
  label: string;
  onDateTimeChange: (dateTime: Dayjs | null) => void;
};

export default function DateTimePickerValue(props: DateTimePickerValueType) {
  const [value, setValue] = useState<Dayjs | null>(null);

  // update the final state of the date time value to parent component
  useEffect(() => {
    props.onDateTimeChange(value);
  }, [value]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker 
        label={props.label}
        value={value}
        onChange={(newValue) => setValue(newValue)}
        slotProps={{
          textField: {
            InputLabelProps: { shrink: true },
          },
        }}
      />
    </LocalizationProvider>
  );
}
