import { MenuItem, Select, SelectChangeEvent } from "@mui/material";

type FilterSelectProps = {
  options: string[];
  selectedOption: string;
  handleChange: (e: SelectChangeEvent<string>) => void;
  height: string;
  width: string;
};

export default function FilterSelect(props: FilterSelectProps) {
  return (
    <Select
      value={props.selectedOption}
      onChange={props.handleChange}
      sx={{ height: props.height, width: props.width }}
    >
      {props.options.map((option) => (
        <MenuItem value={option}>{option}</MenuItem>
      ))}
    </Select>
  );
}
