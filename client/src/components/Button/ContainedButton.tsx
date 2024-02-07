import { MouseEvent } from 'react';
import Button from '@mui/material/Button';

type ContainedButtonProps = {
  label: string;
  onButtonChange: (status: boolean) => void;
};

export default function ContainedButton(props: ContainedButtonProps) {
  const handleSubmit = (event: MouseEvent<HTMLButtonElement>) => {
    props.onButtonChange(true);
  };

  return (
    <Button variant='contained' color='primary' onClick={handleSubmit}>
      {props.label}
    </Button>
  );
}
