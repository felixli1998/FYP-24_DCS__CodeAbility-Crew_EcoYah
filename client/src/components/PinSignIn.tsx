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

export default function PinSignIn(props: {open: boolean, errorMsg: string, errorDisplay: string, handleCloseBackdrop: () => void, handleSignIn: (pin: number) => void}) {
  const [pin, setPin] = useState<string>('');

  const handleChange = (newValue: string) => {
    setPin(newValue);
  }

  const validateChar = (value: any, index: number) => {
    const isNumber = typeof value === 'number'
    const isString = typeof value === 'string'
    return (isNumber || (isString && value !== '')) && !isNaN(Number(value))
  }

  function clearPinOnCancel(){
    setPin('');
  }

  return (
    <ThemeProvider theme={theme}>
    <Backdrop open={props.open}>
        <Card sx={{display: "flex", justifyContent: "center", zIndex: 7}}>
            <CardContent sx={{marginTop: 3}}>
                <Typography variant='h3' sx={{marginBottom: 4, letterSpacing: "0.12em"}}><LockRoundedIcon fontSize="large" sx={{marginRight: 2}}/>Enter your PIN number</Typography>
                <MuiOtpInput
                    value={pin}
                    onChange={handleChange}
                    length={4}
                    autoFocus
                    validateChar={validateChar}
                    // TextFieldsProps={{ disabled: true, size: 'medium' }}
                    TextFieldsProps={{required: true, size: 'medium', sx: {paddingX: 1}}}
                />

                <Typography variant='h4' color='error' sx={{marginTop: 4, letterSpacing: "0.12em", display: props.errorDisplay}}>{props.errorMsg}</Typography>
            
                <CardActions sx={{marginTop: 4, display:'flex', justifyContent:'flex-end'}}>
                    <Button 
                        variant="outlined" size="large" color='error' 
                        onClick={() => {
                            clearPinOnCancel()
                            props.handleCloseBackdrop()
                        }} 
                        sx={{marginRight: 2}}>
                        <Typography variant='h5' sx={{letterSpacing: "0.12em"}}>Cancel</Typography>
                    </Button>

                    <Button 
                        variant="contained" size="large" sx={{bgcolor:'success.dark'}} onClick={() => props.handleSignIn(Number(pin))}><Typography variant='h5' sx={{letterSpacing: "0.12em"}}>Sign In</Typography></Button>
                </CardActions>

            </CardContent>
        </Card>
    </Backdrop>
    </ThemeProvider>
  )
}