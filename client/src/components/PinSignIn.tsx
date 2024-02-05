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

interface PinSignInProps {
  open: boolean;
  errorMsg: string;
  errorDisplay: boolean;
  handleCloseBackdrop: () => void;
  handleSignIn: (pin: string) => void;
}

export default function PinSignIn(props: PinSignInProps) {
  const [pin, setPin] = useState<string>('');

  const handleChange = (newValue: string) => {
    setPin(newValue);
  }

  const validateChar = (value: any) => {
    return (!isNaN(Number(value)) && (value !== ' '))
  }

  function clearPinOnCancel(){
    setPin('');
  }

  return (
    <ThemeProvider theme={theme}>
    <Backdrop open={props.open}>
        <Card sx={{display: 'flex', justifyContent: 'center', zIndex: 7}}>
            <CardContent sx={{marginTop: 3}}>
                <Typography variant='h3' sx={{marginBottom: 4, letterSpacing: '0.12em'}}><LockRoundedIcon fontSize='large' sx={{marginRight: 2}}/>Enter your PIN number</Typography>
                <MuiOtpInput
                    value={pin}
                    onChange={handleChange}
                    length={4}
                    autoFocus
                    validateChar={validateChar}
                    // TextFieldsProps={{required: true, size: 'medium', sx: {paddingX: 1}}}
                    TextFieldsProps={{required: true, sx: {paddingX: 1}, InputProps: {
                      style: { fontSize: '70px' },
                    }}}

                />

                {props.errorDisplay && 
                    (<Typography variant='h4' color='error' sx={{marginTop: 4, letterSpacing: '0.12em', display: 'block'}}>{props.errorMsg}</Typography>)}
            
                <CardActions sx={{marginTop: 4, display:'flex', justifyContent:'flex-end'}}>
                    <Button 
                        variant='outlined' size='large' color='error' 
                        onClick={() => {
                            clearPinOnCancel()
                            props.handleCloseBackdrop()
                        }} 
                        sx={{marginRight: 2}}>
                        <Typography variant='h5' sx={{letterSpacing: '0.12em', fontSize: '2.75rem'}}>Cancel</Typography>
                    </Button>

                    <Button 
                        variant='contained' size='large' sx={{bgcolor:'success.dark'}} onClick={() => props.handleSignIn(pin)}>
                          <Typography variant='h5' sx={{letterSpacing: '0.12em',  fontSize: '2.75rem'}}>Sign In</Typography>
                    </Button>
                </CardActions>

            </CardContent>
        </Card>
    </Backdrop>
    </ThemeProvider>
  )
}