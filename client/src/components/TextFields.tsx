import { useState, useEffect, ChangeEvent } from 'react';
import { Box, Autocomplete, TextField, InputAdornment, IconButton } from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { countries } from '../utils/Countries';
import { CountryCode, isValidPhoneNumber } from 'libphonenumber-js'

type TextFieldsProps = {
    label: string
    type: string
    form?: string
    validate: boolean
    data: (type:string, arg: string) => void
    error?: boolean 
}

type Country = {
  code: string;
  label: string;
  phone: string;
  suggested?: boolean;
}

export default function TextFields(props: TextFieldsProps) {

    const icon: any = {
      "email": <EmailOutlinedIcon sx={{ color: 'secondary.main', mr: 1, my: 0.5 }} />,
      "name": <AccountCircleOutlinedIcon sx={{ color: 'secondary.main', mr: 1, my: 0.5 }} />,
      "password": <LockOutlinedIcon sx={{ color: 'secondary.main', mr: 1, my: 0.5 }} />,
      "confirm password": <LockOutlinedIcon sx={{ color: 'secondary.main', mr: 1, my: 0.5 }} />
    }
    const helperText: any = {
      "email": "Please enter your email",
      "name": "Please enter your name",
      "number": "Please enter your contact number",
      "password": "Please enter your password",
      "confirm password": "Please enter your password again",
    }

    const [value, setValue] = useState("");
    const [code, setCode] = useState("SG");
    const [phone, setPhone] = useState("65");
    const [phoneError, setPhoneError] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
        handleDataChange();
    };

    const handlePhoneChange = (event: React.ChangeEvent<{}>, country: Country | null) => {
      if (country) {
        setCode(country.code);
        setPhone(country.phone);
      }
    }

    const handleDataChange = () => {
      if (props.type === "number") {
        const isValidPhone = isValidPhoneNumber(value, code as CountryCode);
        if (isValidPhone) {
          props.data(props.type, "+" + phone + value);
          if (phoneError) {
            setPhoneError(false);
          }
        } else {
          if (!phoneError) {
            setPhoneError(true);
          }
        };
      } else {
        props.data(props.type, value);
      }
    }

    const displayError = () => {
      if ((props.validate && value === "") || 
        (props.form === "sign up" && props.type === "email" && props.error) || 
        (props.form === "sign in" && props.type === "email" && !props.error) ||
        ((props.type.includes("password")) && props.validate && props.error === false) || 
        (props.validate && phoneError)) {
        return true;
      } else {
        return false;
      }
    }

    const displayErrorMsg = () => {
      if (props.validate && value === "") {
        return helperText[props.type];
      } 
      if (props.form === "sign up" && props.type === "email" && props.error) {
        return "This email already exists. Please use a different email or proceed to login if this account belongs to you";
      } 
      if (props.form === "sign in" && props.type === "email" && !props.error) {
        return "This email does not match any registered accounts";
      }
      if (props.form === "sign up" && props.validate && props.type === "password" && !props.error) {
        return "Please enter a valid password";
      }
      if (props.form === "sign in" && props.validate && props.type === "password" && !props.error) {
        return "This password is incorrect";
      }
      if (props.validate && props.type === "confirm password" && !props.error) {
        return "Please enter the same password";
      } 
      if (props.validate && phoneError) {
        return "Please enter a valid contact number";
      } 
    }

    useEffect(() => {
      handleDataChange();
    }, [phoneError, value]);

    return (
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
            {icon[props.type]} 
            { props.type === "number" &&
                <Autocomplete
                  id="country-select-demo"
                  sx={{ width: 100, mr: 1 }}
                  options={countries}
                  autoHighlight
                  defaultValue={{
                      code: 'SG', 
                      label: 'Singapore', 
                      phone: '65',
                      suggested: true,
                    }}
                  getOptionLabel={(option) => "+" + option.phone}
                  onChange={handlePhoneChange}
                  renderOption={(props, option, index) => (
                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 }, width: 100 }} {...props}>
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
                        autoComplete: 'new-password', // disable autocomplete and autofill
                      }}
                    />
                  )}
                /> }
            <TextField sx={{ width : props.type === "number" ? 225 : 300 }} label={props.label} variant="standard" type={props.type.includes("password") && !showPassword ? "password" : "text"}
                InputProps={props.type.includes("password") ? 
                        { endAdornment: (<InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                        </InputAdornment>) }
                     : {} }
                value={value}
                onChange={handleInputChange}
                error={displayError()}
                helperText={displayErrorMsg()}
                /> 
        </Box> 
    );
}