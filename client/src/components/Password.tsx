import { Box, Typography } from "@mui/material";
import TextFields from "./TextFields";
import CheckBox from "./CheckBox";
import { useState } from "react";

export default function Password() {
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    
    const passwordCriteria: string[] = [
      "At least 12 characters",
      "1 uppercase letter",
      "1 lowercase letter",
      "1 number",
      "1 symbol",
    ];

    const handlePwdCriteria = (status: boolean) => {
      setIsPasswordValid(status);
    };


  return (
    <>
    </>
  );
}
