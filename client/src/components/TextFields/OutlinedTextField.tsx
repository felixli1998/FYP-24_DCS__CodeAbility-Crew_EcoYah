import * as React from "react";
import TextField from "@mui/material/TextField";

interface OutlinedTextFieldProps {
  id: string;
  name: string;
  label: string;
  helperText: string;
  regExpression: RegExp;
}

const OutlinedTextField: React.FC<OutlinedTextFieldProps> = ({
  id,
  name,
  label,
  helperText,
  regExpression,
}) => {
  const [inputValue, setInputValue] = React.useState("");
  const [error, setError] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const isRegexTestValid = regExpression.test(value);

    setInputValue(value);
    setError(!isRegexTestValid);
  };

  return (
    <TextField
      required
      id={id}
      name={name}
      label={label}
      variant="outlined"
      margin="dense"
      fullWidth
      value={inputValue}
      onChange={handleChange}
      error={error}
      helperText={error ? helperText : ""}
    />
  );
};

export default OutlinedTextField;
