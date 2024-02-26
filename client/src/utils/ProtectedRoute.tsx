import { Navigate } from "react-router-dom";
import { getAccountTypeByEmail } from "../services/authenticationApi";
import { useEffect, useState } from "react";

type ProtectedRouteT = {
  isAdmin: boolean;
  children: JSX.Element;
};

const ProtectedRoute = (props: ProtectedRouteT) => {
  const { isAdmin, children } = props;

  const [authorised, setAuthorised] = useState(false);
  const [loading, setLoading] = useState(true);

  // TODO: Naive way for now, let's hook it up to the BE in the future
  const isAuthenticated = !!localStorage.getItem("ecoyah-email");

  const isAuthorised = async (asAdmin: boolean) => {
    const email = localStorage.getItem("ecoyah-email");

    if (!email) {
      return false;
    }

    const res = await getAccountTypeByEmail(email);
    const accountType = res.data;

    if (asAdmin) {
      return accountType === "admin" || accountType === "staff";
    } else {
      return accountType === "donor";
    }
  };

  useEffect(() => {
    const fetchAuthorisation = async () => {
      setLoading(true);

      const authorised = await isAuthorised(isAdmin);

      setAuthorised(authorised);
      setLoading(false);
    };

    fetchAuthorisation();
  }, [isAdmin]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={`${isAdmin ? "/admin" : ""}/sign-in`} replace />;
  }

  return authorised ? (
    children
  ) : (
    <Navigate to={`${isAdmin ? "/admin" : ""}/sign-in`} replace />
  );
};

export default ProtectedRoute;
