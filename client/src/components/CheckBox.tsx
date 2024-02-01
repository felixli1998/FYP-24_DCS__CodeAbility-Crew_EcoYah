import { useState, useEffect } from 'react';
import { FormGroup, FormControlLabel } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';

type CheckBoxProps = {
  label: string[];
  type: string;
  text: string;
  isChecked?: (arg: boolean) => void;
};

export default function CheckBox(props: CheckBoxProps) {
  const symbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

  const [isTrue, setIsTrue] = useState(false);

  useEffect(() => {
    const isPasswordValid =
      props.text.length >= 12 &&
      /[A-Z]/.test(props.text) &&
      /[a-z]/.test(props.text) &&
      /\d/.test(props.text) &&
      symbol.test(props.text);

    props.isChecked?.(isPasswordValid);
  }, [props.text]);

  return (
    <FormGroup>
      {props.label.map(function (label, i) {
        return (
          <FormControlLabel
            disabled={props.type === 'password'}
            control={
              <Checkbox
                checked={
                  (props.type === 'password' &&
                    ((i === 0 && props.text! && props.text.length >= 12) ||
                      (i === 1 && /[A-Z]/.test(props.text)) ||
                      (i === 2 && /[a-z]/.test(props.text)) ||
                      (i === 3 && /\d/.test(props.text)) ||
                      (i === 4 && symbol.test(props.text)))) ||
                  (props.type !== 'password' && isTrue)
                }
              />
            }
            label={label}
            key={i}
            onChange={() => {
              setIsTrue((prevIsTrue) => !prevIsTrue);
              if (props.type !== 'password') props.isChecked?.(!isTrue);
            }}
          />
        );
      })}
    </FormGroup>
  );
}
