import { useState, ChangeEvent } from 'react';
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
import { countries } from '../Countries';

type TextFieldsProps = {
    label: string
    type: string
    validate: boolean
    data: (type:string, arg: string) => void
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
        "number": "Please enter your number",
        "password": "Please enter your password",
        "confirm password": "Please enter your password again",
    }

    console.log(props.validate);

    const [value, setValue] = useState("");

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value);
        setValue(event.target.value);
    };

    console.log(value);
    props.data(props.type, value);

    const [showPassword, setShowPassword] = useState(false);
    
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
            {icon[props.type]} 
            {props.type === "number" && 
                <Autocomplete
                id="country-select-demo"
                sx={{ width: 120, mr: 1 }}
                options={countries}
                autoHighlight
                defaultValue={{
                    code: 'SG', 
                    label: 'Singapore', 
                    phone: '65',
                    suggested: true,
                  }}
                getOptionLabel={(option) => "+" + option.phone}
                renderOption={(props, option) => (
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
              />
            }
            <TextField sx={{ width : props.type === "number" ? 205 : 300 }} label={props.label} variant="standard" type={(props.type === "password" || props.type === "confirm password") && !showPassword ? "password" : "text"}
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
                error={props.validate && value === ""}
                helperText={props.validate && value === "" ? helperText[props.type] : ""}
                />
        </Box>
    );
}