import * as React from 'react';
import Button from '@mui/material/Button';

type LongButtonProps = {
    label: string
}

export default function LongButton(props: LongButtonProps) {
  return (
    <Button variant="contained" color="primary">{props.label}</Button>
  );
}