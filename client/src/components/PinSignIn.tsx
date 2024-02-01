import { useState } from 'react'
import { MuiOtpInput } from 'mui-one-time-password-input'

export default function PinSignIn() {
  const [pin, setPin] = useState<string>('');

  const handleChange = (newValue: string) => {
    setPin(newValue);
  }

  const handleComplete = (finalValue: string) => {
    fetch('...')
  }

  return (
    <MuiOtpInput
      value={pin}
      onChange={handleChange}
      onComplete={handleComplete}
      length={4}
      autoFocus
      validateChar={(character: string, index: number) => true}
    />
  )
}