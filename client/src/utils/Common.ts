// === Common reusable functions ===
import _ from "lodash";

// ==== Password Related ====
export const validatePassword = (id: number, passwordText: string) => {
  const symbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  const checkPassword: { [key:number]: boolean } = {
    0: passwordText.length >= 12,
    1: /[A-Z]/.test(passwordText),
    2: /[a-z]/.test(passwordText),
    3: /\d/.test(passwordText),
    4: symbol.test(passwordText),
  };

  return checkPassword[id];
}

// === Sanitisation Related ===
// Remove Leading & Trailing Spaces, Capitalise word's first letter, and 1 space between words
export const formatAndCapitalizeString = (stringVariable: string) => {
  const sanitisedString = _.replace(
    _.startCase(_.trim(stringVariable)),
    /\s+/g,
    " "
  );

  return sanitisedString;
};

// === Validation Related ===
// Check if a string exists in an Object Array
export const isValueExistsInObjectArray = (
  ObjectArray: any,
  key: string,
  target: string
) => {
  const isTargetExistsInObjectArray = _.some(ObjectArray, (object) => {
    return object[key] === target;
  });
  return isTargetExistsInObjectArray;
};
