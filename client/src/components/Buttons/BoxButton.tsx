import Button, {ButtonProps} from "@mui/material/Button";

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
  customStyles
}) => {
  return (
    <Button
      onClick={handleClick}
      variant={isSelected ? "contained" : "outlined"}
      color={color}
      size={size}
      sx={{
        height: "1rem",
        width: "1rem",
        padding: "3.5rem",
        fontWeight: "bold",
        marginRight: 1,
        ...customStyles, // Merge custom styles with existing styles
      }}
    >
      {name}
    </Button>
  );
};

export default BoxButton;
