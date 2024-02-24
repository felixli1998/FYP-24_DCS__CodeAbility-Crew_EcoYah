import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface BasicSelectProps {
  name: string;
  labelId: string;
  label: string;
  selectId: string;
  menuItems: { label: string; value: string }[];
  selectValue: string;
  onChange: (value: string) => void;
}

const BasicSelect: React.FC<BasicSelectProps> = ({
  name,
  labelId,
  label,
  selectId,
  menuItems,
  selectValue,
  onChange,
}) => {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value as string);
  };

  return (
    <FormControl fullWidth sx={{ marginTop: '1rem' }}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        name={name}
        labelId={labelId}
        id={selectId}
        value={selectValue}
        label={label}
        onChange={handleChange}
      >
        {menuItems.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default BasicSelect;
