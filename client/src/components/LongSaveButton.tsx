import * as React from 'react';
import Button from '@mui/material/Button';

type LongButtonProps = {
    label: string
    clickStatus: (arg: boolean) => void
}

export default function LongButton(props: LongButtonProps) {
  
  function handleSignUp(e: { preventDefault: () => void; }) {
    e.preventDefault();
    // console.log('You clicked sign up.');
    props.clickStatus(true);
  }

  return (
    <Button variant="contained" 
      color="primary" 
      onClick={handleSignUp}>{props.label}</Button>
  );
}