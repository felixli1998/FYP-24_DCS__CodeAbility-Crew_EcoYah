import { useState } from "react";
import { Box, Typography } from "@mui/material";

interface ProfilePicProps {
  profilePic: any;
  handlePhotoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfilePic({
  profilePic,
  handlePhotoUpload,
}: ProfilePicProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "2rem",
      }}
    >
      <label htmlFor="profilePicInput">
        <Box
          component="img"
          sx={{
            backgroundColor: "#E0E0E0",
            position: "relative",
            width: "7.5rem",
            height: "7.5rem",
            borderRadius: "50%",
            boxShadow:
              "0px 10px 10px 0px rgba(0, 0, 0, 0.25), 0 0 10px rgba(0, 0, 0, 0.2) inset",
            marginTop: "1rem",
            cursor: "pointer",
          }}
          alt="profile picture"
          src={profilePic || profilePic}
        />
        <input
          type="file"
          id="profilePicInput"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handlePhotoUpload}
        />
      </label>
      <Typography variant="body1" align="center" sx={{ fontWeight: "bold" }}>
        {" "}
        Change Photo
      </Typography>
    </Box>
  );
}
