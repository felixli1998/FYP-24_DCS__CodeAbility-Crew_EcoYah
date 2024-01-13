import { useState, useEffect } from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

type CheckBoxProps = {
    label: string[]
    type: string
    text: string 
    isValid: (arg: boolean) => void
}

export default function CheckBox(props: CheckBoxProps) {

  const symbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

  console.log(props.text);

  const [isTrue, setIsTrue] = useState(false);

  useEffect(() => {
    const isPasswordValid = props.text.length >= 12 &&
      /[A-Z]/.test(props.text) &&
      /[a-z]/.test(props.text) &&
      /\d/.test(props.text) &&
      symbol.test(props.text);
  
      props.isValid(isPasswordValid);

  }, [props.text]);

  return (
    <FormGroup>
        { props.label.map(function(label, i) {
            return <FormControlLabel disabled={props.type === "password"} control={<Checkbox checked={
              (props.type === "password" &&
              ((i === 0 && props.text! && props.text.length >= 12) ||
              (i === 1 && /[A-Z]/.test(props.text)) ||
              (i === 2 && /[a-z]/.test(props.text)) ||
              (i === 3 && /\d/.test(props.text)) ||
              (i === 4 && symbol.test(props.text)))) || 
              (props.type !== "password" && isTrue) } />} label={label} key={i} 
              onChange={() => { 
                if (!isTrue) {
                  props.type !== "password" && props.isValid(true);
                  setIsTrue(true);
                } else {
                  props.type !== "password" && props.isValid(false);
                  setIsTrue(false);
                }
              }}/>;
        })}
    </FormGroup>
  );
}