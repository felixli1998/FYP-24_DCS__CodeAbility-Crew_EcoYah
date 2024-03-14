// MUI Imports...
import {
  Alert,
  Box,
  Button,
  Grid,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import BackspaceOutlinedIcon from "@mui/icons-material/BackspaceOutlined";
import { SG } from "country-flag-icons/react/3x2";

// Component Imports
import BasicButton from "../../components/Button/BasicButton";

// Utils Imports
import { FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// API Imports
import {
  getUserByEmail,
  makeCashbackRequest,
} from "../../services/authenticationApi";
import { useMutation } from "@tanstack/react-query";

export default function CashbackRedemption() {
  const [user, setUser] = useState<any | null>(null);
  const [inputCashbackAmt, setInputCashbackAmt] = useState<string>("0");
  const [toast, setToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch Active/Complete request
    const email = localStorage.getItem("ecoyah-email");
    if (email) {
      getUserByEmail(email).then((res) => {
        setUser(res.data);
      });
    }
  }, []);

  const handleKeyPress = (value: string) => {
    setInputCashbackAmt((prevValue) => {
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

  const { mutateAsync } = useMutation({
    mutationKey: ["cashback-request", user],
    mutationFn: () => {
      return makeCashbackRequest(user.id, inputCashbackAmt);
    },
    onSuccess: (response) => {
      if (response && response.data) {
        setToastMessage(response.data.message);
        setToast(true);

        if (response.status === 200) {
          setInputCashbackAmt("0");
          navigate("/transaction-history"); // TODO: Redirect to transaction history
        }
      }
    },
    onError: (error: any) => {
      console.error("Error creating donation event: ", error);
    },
  });

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
        <Typography
          variant="h3"
          fontWeight={"bold"}
          textAlign={"center"}
          sx={{ marginBottom: 1 }}
        >
          ${inputCashbackAmt}
        </Typography>
        <Box
          sx={{
            bgcolor: "#b0bec5",
            paddingX: 2,
            paddingY: 1,
            borderRadius: 6,
            display: "flex",
          }}
        >
          <Box sx={{ width: 24, height: 20, mr: 1 }}>
            <SG title="Singapore" />
          </Box>
          <Typography variant="subtitle2" sx={{ color: "white" }}>
            Cashback: S$ {user && user.points}
          </Typography>
        </Box>
        {user && inputCashbackAmt > user.points && (
          <Alert
            severity="error"
            sx={{
              bgcolor: "transparent",
              marginTop: 0,
              paddingTop: 0,
              color: "#d50000",
            }}
          >
            Current amount exceeds balance
          </Alert>
        )}
      </Box>
      <Box margin={2.5}>
        <BasicButton
          label={"Redeem"}
          variant={"contained"}
          disabled={user && inputCashbackAmt > user.points}
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
          onButtonChange={() => mutateAsync()}
        />
        <NumberKeypad onKeyPress={handleKeyPress} />
      </Box>
      <Snackbar
        open={toast}
        autoHideDuration={3000}
        onClose={() => setToast(false)}
        sx={{ width: "80%", mx: "auto", marginTop: 10 }}
        message={toastMessage}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
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
