import { useState, useEffect, ChangeEvent } from 'react';
import {
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormHelperText,
} from '@mui/material';

type LabelledCheckBoxType = {
  label: LabelType[];
  onCheckBoxChange: (checkedState: Record<string, boolean>) => void;
  validateForm?: boolean; // to account for scenarios where it's optional to select an option
};

type LabelType = {
  id: string | number,
  name: string, 
  value: boolean
}

export default function LabelledCheckBox(props: LabelledCheckBoxType) {
  // initialise the state of each label to false
  const [checked, setChecked] = useState(() => {
    const initialCheckedState: Record<string, boolean> = {};
    props.label.forEach((key: LabelType) => {
      initialCheckedState[key.id] = key.value;
    });
    return initialCheckedState;  
  });
   
  // handle state change for each label
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked({
      ...checked,
      [event.target.value]: event.target.checked,
    });
  };

  // check if at least one checkbox is selected
  const isAtLeastOneChecked = Object.values(checked).some((value) => value);

  // update the final state of all the labels to parent component
  useEffect(() => {
    props.onCheckBoxChange(checked);
  }, [checked]);

  return (
    <FormControl error={props.validateForm && !isAtLeastOneChecked}>
      <FormGroup>
        {props.label.map(function (eachLabel: LabelType, index: number) {
          return (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  size='medium'
                  name={eachLabel.name}
                  value={eachLabel.id}
                  checked={checked[eachLabel.id]}
                  onChange={handleChange}
                />
              }
              label={eachLabel.name}
            />
          );
        })}
      </FormGroup>
      {props.validateForm && !isAtLeastOneChecked && (
        <FormHelperText>Please select at least one option</FormHelperText>
      )}
    </FormControl>
  );
}
