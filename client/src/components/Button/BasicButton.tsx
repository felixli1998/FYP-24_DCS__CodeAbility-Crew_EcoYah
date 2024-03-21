import { CSSProperties, MouseEvent } from "react";
import Button from "@mui/material/Button";

type BasicButtonType = {
  label: string;
  variant: "contained" | "outlined" | "text";
  customStyles?: CSSProperties;
  onButtonChange: (status: boolean) => void;
  disabled?: boolean;
};

export default function BasicButton(props: BasicButtonType) {
  const handleSubmit = (event: MouseEvent<HTMLButtonElement>) => {
    props.onButtonChange(true);
  };

  return (
    <Button
      variant={props.variant}
      disabled={props.disabled || false}
      color="primary"
      onClick={handleSubmit}
      sx={{ ...props.customStyles }}
    >
      {props.label}
    </Button>
  );
}
