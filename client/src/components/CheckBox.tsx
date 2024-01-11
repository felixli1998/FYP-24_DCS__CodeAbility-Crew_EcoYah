import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

type CheckBoxProps = {
    type: string
    label: string[]
}

export default function CheckBox(props: CheckBoxProps) {
  return (
    <FormGroup>
        { props.label.map(function(label, i){
            return <FormControlLabel control={<Checkbox />} label={label} key={i} />;
        })}

    </FormGroup>
  );
}