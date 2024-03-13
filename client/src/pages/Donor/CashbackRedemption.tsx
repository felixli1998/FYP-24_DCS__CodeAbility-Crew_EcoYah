// MUI Imports...
import {
  Box,
  Button,
  Container,
  Grid,
  ImageList,
  ImageListItem,
  Stack,
  Typography,
} from "@mui/material";
import BasicButton from "../../components/Button/BasicButton";
import { FC, useState } from "react";
import BackspaceOutlinedIcon from "@mui/icons-material/BackspaceOutlined";
import Image from "../../components/Image/Image";

export default function CashbackRedemption() {
  const [inputValue, setInputValue] = useState<string>("0");

  const handleKeyPress = (value: string) => {
    setInputValue((prevValue) => {
      if (value === "backspace") {
        const newValue = prevValue.slice(0, -1);
        return newValue || "0"; // Min is 0
      } else if (value === ".") {
        // Prevent multiple "."
        if (prevValue.includes(".")) {
          return prevValue;
        }
        const newValue = prevValue === "0" ? "0." : prevValue + value;
        return newValue;
      } else {
        const isLeadingZero = prevValue === "0" && !prevValue.includes(".");
        const isAppendingZero =
          prevValue.endsWith("0") && value === "0" && !prevValue.includes(".");

        const newValue =
          isLeadingZero || prevValue === "" ? value : prevValue + value;

        return isAppendingZero ? prevValue : newValue.slice(0, 10);
      }
    });
  };

  return (
    <Stack
      sx={{ height: "90vh" }}
      justifyContent="space-between"
      alignItems="center"
    >
      <Box
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" fontWeight={"bold"} textAlign={"center"}>
          ${inputValue}
        </Typography>
        <Typography variant="caption">Cashback Balance: $475</Typography>
      </Box>
      <Box margin={2.5}>
        <BasicButton
          label={"Redeem"}
          variant={"contained"}
          customStyles={{
            fontWeight: "bold",
            fontSize: 12,
            width: "100%",
            borderRadius: 6,
            paddingTop: 2,
            paddingBottom: 2,
            backgroundColor: "#004d40",
            marginBottom: 3,
          }}
          onButtonChange={() => console.log("REDEEM")}
        />
        <NumberKeypad onKeyPress={handleKeyPress} />
      </Box>
    </Stack>
  );
}

interface NumberKeypadProps {
  onKeyPress: (value: string) => void;
}

const NumberKeypad: FC<NumberKeypadProps> = (props: NumberKeypadProps) => {
  const { onKeyPress } = props;
  const handleKeyPress = (value: string) => {
    onKeyPress(value.toString());
  };

  return (
    <Grid container rowSpacing={4}>
      {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "backspace"].map(
        (number, index) => (
          <Grid item xs={4} key={index}>
            {number !== "backspace" ? (
              <Button
                fullWidth={true}
                key={number}
                sx={{
                  fontSize: "large",
                  padding: 0,
                  color: "black",
                  fontWeight: "bold",
                }}
                onClick={() => handleKeyPress(number)}
              >
                {number}
              </Button>
            ) : (
              <Button
                startIcon={
                  <BackspaceOutlinedIcon sx={{ width: 24, height: 24 }} />
                }
                fullWidth={true}
                key={number}
                sx={{
                  color: "black",
                  marginLeft: 0.5,
                }}
                onClick={() => handleKeyPress(number)}
              ></Button>
            )}
          </Grid>
        ),
      )}
    </Grid>
  );
};
