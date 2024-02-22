// React Imports
import { useState, useEffect, ChangeEvent } from "react";

// MUI Imports
import { Box, Autocomplete, TextField } from "@mui/material";

// Other Imports
import { countries } from "../../utils/Countries";

type ContactNumberTextFieldType = {
  data: (key: string, value: string) => void;
};

type Country = {
  code: string;
  label: string;
  phone: string;
  suggested?: boolean;
};

export default function ContactNumberTextField(
  props: ContactNumberTextFieldType
) {
  const [code, setCode] = useState<string>("SG");
  const [phone, setPhone] = useState<string>("65");

  const handlePhoneChange = (
    event: ChangeEvent<{}>,
    country: Country | null
  ) => {
    if (country) {
      setCode(country.code);
      setPhone(country.phone);
    }
  };

  useEffect(() => {
    props.data("code", code);
    props.data("phone", phone);
  }, [code]);

  return (
    <Autocomplete
      id="country-select"
      sx={{ width: 100, mr: 1 }}
      options={countries}
      autoHighlight
      defaultValue={{
        code: "SG",
        label: "Singapore",
        phone: "65",
        suggested: true,
      }}
      getOptionLabel={(option) => "+" + option.phone}
      onChange={handlePhoneChange}
      renderOption={(props, option, index) => (
        <Box
          component="li"
          sx={{ "& > img": { mr: 2, flexShrink: 0 }, width: 100 }}
          {...props}
        >
          <img
            loading="lazy"
            width="20"
            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
            alt=""
          />
          +{option.phone}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Country Code"
          variant="standard"
          inputProps={{
            ...params.inputProps,
            autoComplete: "new-password",
          }}
        />
      )}
    />
  );
}
