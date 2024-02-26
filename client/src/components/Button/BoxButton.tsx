import Button, { ButtonProps } from "@mui/material/Button";

interface BoxButtonProps {
  handleClick: () => void;
  color: ButtonProps["color"];
  size: ButtonProps["size"];
  name: string;
  isSelected: boolean;
  customStyles?: React.CSSProperties;
}

const BoxButton: React.FC<BoxButtonProps> = ({
  handleClick,
  color,
  size,
  name,
  isSelected,
  customStyles,
}) => {
  return (
    <Button
      onClick={handleClick}
      variant={isSelected ? "contained" : "outlined"}
      color={color}
      size={size}
      sx={{
        height: "5.75rem",
        width: "5.75rem",
        padding: "5.5rem",
        fontSize: "1.125rem",
        fontWeight: "bold",
        letterSpacing: "0.135rem",
        marginTop: "2rem",
        ...customStyles, // Merge custom styles with existing styles
      }}
    >
      {name}
    </Button>
  );
};

export default BoxButton;
