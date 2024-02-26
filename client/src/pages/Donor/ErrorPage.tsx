import React from "react";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import { Typography, Paper, Container } from "@mui/material";

const ErrorPage: React.FC = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Paper elevation={0} sx={{ textAlign: "center" }}>
          <Typography variant="h3" gutterBottom>
            Oops!
          </Typography>
          <Typography variant="h4" gutterBottom>
            {error.status}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {error.statusText}
          </Typography>
          {error.data?.message && (
            <Typography variant="body2" color="error">
              {error.data.message}
            </Typography>
          )}
        </Paper>
      </Container>
    );
  }

  return null;
};

export default ErrorPage;
