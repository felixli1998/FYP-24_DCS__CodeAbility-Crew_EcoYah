import { CSSProperties, MouseEvent } from 'react';
import Button from '@mui/material/Button';

type BasicButtonProps = {
  label: string;
  variant: 'contained' | 'outlined' | 'text';
  customStyles?: CSSProperties;
  onButtonChange: (status: boolean) => void;
};

export default function BasicButton(props: BasicButtonProps) {
  const handleSubmit = (event: MouseEvent<HTMLButtonElement>) => {
    props.onButtonChange(true);
  };

  return (
    <Button
      variant={props.variant}
      color='primary'
      onClick={handleSubmit}
      sx={{ ...props.customStyles }}
    >
      {props.label}
    </Button>
  );
}
