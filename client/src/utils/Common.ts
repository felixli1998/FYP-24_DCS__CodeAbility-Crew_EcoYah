// === Common reusable functions ===
import _ from "lodash";
import { SeriesArray } from "./Types";
import { ChartsAxisClasses } from "@mui/x-charts";

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

// ==== Dashboard Related ====
export const displaySeries = (
  seriesLabels: Record<string, number[]>,
  chart: string,
) => {
  const seriesArray: SeriesArray[] = [];
  for (const [key, value] of Object.entries(seriesLabels)) {
    seriesArray.push({
      data: value,
      label: key,
      id: key,
      stack: chart === "bar" ? "total" : undefined,
      curve: chart === "line" ? "natural" : undefined,
    });
  }
  return seriesArray;
};

export const getChartStyles = (
  axisClasses: ChartsAxisClasses,
  seriesLabels: Record<string, number[]>,
) => {
  if (Object.keys(seriesLabels).length >= 1) {
    return {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: "translate(-10px, 0)",
        letterSpacing: "0.00938em",
        fontSize: "1rem",
        fontWeight: "bold",
      },
      [`.${axisClasses.bottom} .${axisClasses.label}`]: {
        transform: "translate(0, 5px)",
        letterSpacing: "0.00938em",
        fontSize: "1rem",
        fontWeight: "bold",
      },
    };
  }
  return {};
};
