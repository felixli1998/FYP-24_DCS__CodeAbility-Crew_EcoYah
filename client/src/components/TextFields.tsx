import { useState, useEffect, ChangeEvent } from 'react';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
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

    // console.log(props.validate);

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
        // console.log(event.target.value);
        setValue(event.target.value);
        handleDataChange();
    };
    // console.log(value);

    const handlePhoneChange = (event: React.ChangeEvent<{}>, country: Country | null) => {
      /// console.log(country);
      if (country) {
        setCode(country.code);
        setPhone(country.phone);
      }
    }
    // console.log(code);

    const handleDataChange = () => {
      if (props.type === "number") {
        const isValidPhone = isValidPhoneNumber(value, code as CountryCode);
        // console.log(isValidPhone);
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
        (props.type === "email" && props.error) || 
        ((props.type === "password" || props.type === "confirm password") && props.validate && props.error === false) || 
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
      
      if (props.type === "email" && props.error) {
        return "This email already exists. Please login instead.";
      } 
      
      if (props.validate && props.error === false && props.type === "password") {
        return "Please enter a valid password";
      } 
      
      if (props.validate && props.error === false && props.type === "confirm password") {
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
            <TextField sx={{ width : props.type === "number" ? 225 : 300 }} label={props.label} variant="standard" type={(props.type === "password" || props.type === "confirm password") && !showPassword ? "password" : "text"}
                InputProps={props.type === "password" || props.type === "confirm password" ? 
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