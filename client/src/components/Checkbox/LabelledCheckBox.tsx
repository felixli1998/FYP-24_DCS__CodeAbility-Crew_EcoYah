import { useState, useEffect, ChangeEvent } from 'react';
import { FormGroup, FormControlLabel, Checkbox } from '@mui/material';

type LabelledCheckBoxType = {
  label: string[];
  onCheckBoxChange: (checkedState: Record<string, boolean>) => void;
};

export default function LabelledCheckBox(props: LabelledCheckBoxType) {
  // initialise the state of each label to false
  const [checked, setChecked] = useState(() => {
    const initialCheckedState: Record<string, boolean> = {};
    props.label.forEach((key: string) => {
      initialCheckedState[key] = false;
    });
    return initialCheckedState;
  });

  // handle state change for each label
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked({
      ...checked,
      [event.target.name]: event.target.checked,
    });
  };

  // update the final state of all the labels to parent component
  useEffect(() => {
    props.onCheckBoxChange(checked);
  }, [checked]);

  return (
    <FormGroup>
      {props.label.map(function (eachLabel: string, index: number) {
        return (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                size='medium'
                name={eachLabel}
                checked={checked[eachLabel]}
                onChange={handleChange}
              />
            }
            label={eachLabel}
          />
        );
      })}
    </FormGroup>
  );
}
