import * as React from 'react';
import Button from '@mui/material/Button';

type LongButtonsProps = {
    label: string
}

export default function LongButtons(props: LongButtonsProps) {
  return (
    <Button variant="contained">{props.label}</Button>
  );
}