import { useState } from 'react';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { ThemeProvider } from "@emotion/react";
import { theme } from "../styles/Palette";
import { MuiOtpInput } from 'mui-one-time-password-input';
import { Backdrop,
         Button,
         Card,
         CardActions,
         CardContent,
         Grid,
         IconButton,
         Typography} from '@mui/material';

interface PinSignInProps {
  open: boolean;
  errorMsg: string;
  errorDisplay: boolean;
  handleCloseBackdrop: () => void;
  handleSignIn: (pin: string) => void;
}

export default function PinSignIn(props: PinSignInProps) {
  const [pin, setPin] = useState<string>('');
  const [showPin, setShowPin] = useState(false);

  const handleChange = (newValue: string) => {
    setPin(newValue);
  }

  const handleToggleShowPin = () => {
    showPin ? setShowPin(false) : setShowPin(true);
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
        <Card sx={{display: 'flex', justifyContent: 'center', marginX: 4}}>
            <CardContent sx={{marginTop: 3}}>
                <Typography variant='h3' sx={{marginBottom: 3, letterSpacing: '0.12em'}}><LockRoundedIcon fontSize='large' sx={{marginRight: 2}}/>Enter your PIN number</Typography>

                <IconButton sx={{ width: 100, height: 100 }} onClick={handleToggleShowPin}>
                  {showPin ? <VisibilityOff sx={{fontSize: 60}}/> : <Visibility sx={{fontSize: 60}}/>}
                </IconButton>

                <MuiOtpInput
                    value={pin}
                    onChange={handleChange}
                    length={4}
                    autoFocus
                    validateChar={validateChar}
                    TextFieldsProps={{
                      required: true,
                      InputProps: {
                        style: { fontSize: '4.3rem' },
                        type: showPin ? 'text' : 'password',
                    }}}
                />

                {props.errorDisplay && 
                    (<Typography variant='h4' color='error' sx={{marginTop: 4, letterSpacing: '0.12em'}}>{props.errorMsg}</Typography>)}
            
                <CardActions sx={{marginTop: 4}}>
                  <Grid container spacing={4}>
                    <Grid item xs={12} sm={6}>
                      <Button 
                          variant='outlined' size='large' color='error' 
                          onClick={() => {
                              clearPinOnCancel()
                              props.handleCloseBackdrop()
                          }}>
                          <Typography variant='h5' sx={{letterSpacing: '0.12em', fontSize: '2.75rem'}}>Cancel</Typography>
                      </Button>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Button 
                          variant='contained' size='large' sx={{bgcolor:'success.dark'}} onClick={() => props.handleSignIn(pin)}>
                            <Typography variant='h5' sx={{letterSpacing: '0.12em',  fontSize: '2.75rem'}}>Sign In</Typography>
                      </Button>
                    </Grid>

                  </Grid>

                </CardActions>

            </CardContent>
        </Card>
    </Backdrop>
    </ThemeProvider>
  )
}