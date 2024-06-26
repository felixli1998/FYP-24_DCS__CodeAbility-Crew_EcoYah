import { useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import utc from 'dayjs/plugin/utc';
import timezone from "dayjs/plugin/timezone";

type DateTimePickerValueType = {
  label: string;
  data: Record<string, Date | string>;
  onDateTimeChange: (dateTime: Dayjs | null) => void;
  validateForm: boolean;
};

export default function DateTimePickerValue(props: DateTimePickerValueType) {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  const [value, setValue] = useState<Dayjs | null>(null);

  const twelvePM = dayjs().set("hour", 12).startOf("hour");
  const twoPM = dayjs().set("hour", 14).startOf("hour");

  const calculateTimeRange = () => {
    const currentHour = dayjs().hour();
    let minDate: dayjs.Dayjs = dayjs();
    let minTime: dayjs.Dayjs | null = null;
    let maxTime: dayjs.Dayjs | null = twoPM;

    if (currentHour <= 12) {
      minTime = twelvePM;
    } else if (currentHour < 14) {
      minTime = twoPM;
    } else {
      minDate = dayjs().add(1, "day");
      minTime = dayjs().add(1, "day").set("hour", 12).startOf("hour");
    }

    return { minDate, minTime, maxTime };
  };

  const { minDate, minTime, maxTime } = calculateTimeRange();

  useEffect(() => {
    if (props.data.dropOffTime !== "") {
      setValue(dayjs(props.data.dropOffDate));
    }
  }, []);

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
            error:
              (props.validateForm && value === null) ||
              (props.validateForm && value!.hour() < 12),
            helperText:
              (props.validateForm &&
                value === null &&
                "Please choose a date and time") ||
              (props.validateForm &&
                value!.hour() < 12 &&
                "Please select a timing from 12pm - 2pm") ||
              "As part of operational hours, the available timings for donation drop offs are from 12pm - 2pm",
          },
        }}
        format="DD/MM/YYYY HH:mm"
        timezone="Asia/Singapore"
      />
    </LocalizationProvider>
  );
}
