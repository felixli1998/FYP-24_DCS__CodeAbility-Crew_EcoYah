// React Imports
import { useState, useEffect, ChangeEvent } from "react";

// MUI Imports
import { Box, TextField, InputAdornment, IconButton } from "@mui/material";

// Components
import ContactNumberTextField from "./ContactNumberTextField";

// Icons
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// Other Imports
import { CountryCode, isValidPhoneNumber } from "libphonenumber-js";

type AuthTextFieldsType = {
  label: string;
  form: string;
  validateForm: boolean;
  data: (key: string, value: string) => void;
  error?: string;
};

export default function AuthTextFields(props: AuthTextFieldsType) {

  const icon: {
    [key: string]: JSX.Element;
  } = {
    Email: (
      <EmailOutlinedIcon sx={{ color: "secondary.main", mr: 1, my: 0.5 }} />
    ),
    Name: (
      <AccountCircleOutlinedIcon
        sx={{ color: "secondary.main", mr: 1, my: 0.5 }}
      />
    ),
    Password: (
      <LockOutlinedIcon sx={{ color: "secondary.main", mr: 1, my: 0.5 }} />
    ),
    "Confirm Password": (
      <LockOutlinedIcon sx={{ color: "secondary.main", mr: 1, my: 0.5 }} />
    ),
  };

  const helperText: { [key: string]: string } = {
    Email: "Please enter your email",
    Name: "Please enter your name",
    "Contact Number": "Please enter your contact number",
    Password: "Please enter your password",
    "Confirm Password": "Please enter your password again",
  };

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const [value, setValue] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [phoneError, setPhoneError] = useState(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    handleDataChange();
  };

  const handleCodeChange = (key: string, value: string) => {
    setCode(key === "code" ? value : '');
    setPhone(key === "phone" ? value : '');
  }

  const handleDataChange = () => {
    if (props.label === "number") {
      const isValidPhone = isValidPhoneNumber(value, code as CountryCode);
      if (isValidPhone) {
        props.data(props.label, "+" + phone + value);
        if (phoneError) {
          setPhoneError(false);
        }
      } else {
        if (!phoneError) {
          setPhoneError(true);
        }
      }
    } else {
      props.data(props.label, value);
    }
  };

  const displayError = () => {
    if (
      (props.validateForm && value === "") ||
      (props.form === "sign up" && props.label === "Email" && props.error) ||
      (props.form === "sign in" && props.label === "Email" && !props.error) ||
      (props.label.includes("Password") &&
        props.validateForm &&
        !props.error) ||
      (props.validateForm && phoneError)
    ) {
      return true;
    } else {
      return false;
    }
  };

  const displayErrorMsg = () => {
    if (props.validateForm && value === "") {
      return helperText[props.label];
    }
    if (props.form === "Sign Up" && props.label === "Email" && props.error) {
      return "This email already exists. Please use a different email or proceed to login if this account belongs to you";
    }
    if (props.form === "Sign In" && props.label === "Email" && !props.error) {
      return "This email does not match any registered accounts";
    }
    if (
      props.form === "Sign Up" &&
      props.validateForm &&
      props.label === "Password" &&
      !props.error
    ) {
      return "Please enter a valid password";
    }
    if (
      props.form === "Sign In" &&
      props.validateForm &&
      props.label === "Password" &&
      !props.error
    ) {
      return "This password is incorrect";
    }
    if (props.validateForm && props.label === "Confirm Password" && !props.error) {
      return "Please enter the same password";
    }
    if (props.validateForm && phoneError) {
      return "Please enter a valid contact number";
    }
  };

  useEffect(() => {
    handleDataChange();
  }, [phoneError, value]);

  return (
    <Box sx={{ display: "flex", alignItems: "flex-end" }}>
      {icon[props.label]}
      { props.label === "Contact Number" && <ContactNumberTextField data={handleCodeChange}/> }
      <TextField
        sx={{ width: props.label === "Contact Number" ? 225 : 300 }}
        label={props.label}
        variant="standard"
        type={
          props.label.includes("Password") && !showPassword
            ? "password"
            : "text"
        }
        InputProps={
          props.label.includes("Password")
            ? {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }
            : {}
        }
        value={value}
        onChange={handleInputChange}
        error={displayError()}
        helperText={displayErrorMsg()}
      />
    </Box>
  );
}
