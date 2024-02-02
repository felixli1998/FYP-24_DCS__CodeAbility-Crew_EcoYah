import { useState } from 'react';
import { MuiOtpInput } from 'mui-one-time-password-input';
import { Backdrop,
         Button,
         Card,
         CardActions,
         CardContent,
         Typography} from '@mui/material';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import { ThemeProvider } from "@emotion/react";
import { theme } from "../styles/Palette";

export default function PinSignIn(props: {open: boolean}) {
  const [pin, setPin] = useState<string>('');

  const handleChange = (newValue: string) => {
    setPin(newValue);
  }

  const handleComplete = (finalValue: string) => {
    fetch('...')
  }

  const validateChar = (value: any, index: number) => {
    const isNumber = typeof value === 'number'
    const isString = typeof value === 'string'
    return (isNumber || (isString && value !== '')) && !isNaN(Number(value))
  }

  return (
    <ThemeProvider theme={theme}>
    <Backdrop open={props.open}>
        <Card sx={{display: "flex", justifyContent: "center", zIndex: 7}}>
            <CardContent sx={{marginTop: 3}}>
                <Typography variant='h3' sx={{marginBottom: 4}}><LockRoundedIcon fontSize="large" sx={{marginRight: 2}}/>Enter your PIN number</Typography>
                <MuiOtpInput
                    value={pin}
                    onChange={handleChange}
                    onComplete={handleComplete}
                    length={4}
                    autoFocus
                    validateChar={validateChar}
                    // TextFieldsProps={{ disabled: true, size: 'medium' }}
                    TextFieldsProps={{required: true, size: 'medium', sx: {paddingX: 1}}}
                />
            <CardActions sx={{display:'flex', justifyContent:'flex-end'}}>
                <Button variant="contained" size="large" sx={{marginTop: 4, bgcolor:'success.dark'}}><Typography variant='h5' sx={{letterSpacing: "0.12em"}}>Sign In</Typography></Button>
            </CardActions>
            </CardContent>
        </Card>
    </Backdrop>
    </ThemeProvider>
  )
}