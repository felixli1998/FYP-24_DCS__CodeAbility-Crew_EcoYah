// === Common reusable functions ===
import _ from "lodash";

// === Sanitisation Related ===
// Remove Leading & Trailing Spaces, Capitalise word's first letter, and 1 space between words
export const formatAndCapitalizeString = (stringVariable: string) => {
  const sanitisedString = _.replace(
    _.startCase(_.trim(stringVariable)),
    /\s+/g,
    " ",
  );

  return sanitisedString;
};

// === Validation Related ===
// Check if a string exists in an Object Array
export const isValueExistsInObjectArray = (
  ObjectArray: any,
  key: string,
  target: string,
) => {
  const isTargetExistsInObjectArray = _.some(ObjectArray, (object) => {
    return object[key] === target;
  });
  return isTargetExistsInObjectArray;
};
