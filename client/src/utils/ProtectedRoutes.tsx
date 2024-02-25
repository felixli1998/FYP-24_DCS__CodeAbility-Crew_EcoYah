import { Navigate } from 'react-router-dom'
import { getAccountTypeByEmail } from '../services/authenticationApi';
import { useEffect, useState } from 'react';

type ProtectedRouteT = {
  isAdmin: boolean;
  children: JSX.Element;
};

export const ProtectedRoute = (props: ProtectedRouteT) => {
  const { isAdmin, children } = props;

  const [authorised, setAuthorised] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  const isAuthorised = async (asAdmin: boolean) => {
    const email = localStorage.getItem('ecoyah-email');

    if (!email) {
      return false;
    }

    const res = await getAccountTypeByEmail(email);
    const accountType = res.data;

    if (asAdmin) {
      return accountType === 'admin' || accountType === 'staff';
    } else {
      return accountType === 'donor';
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

  if (isAdmin) {
    return authorised ? children : <Navigate to="/admin/sign-in" replace />;
  } else {
    return authorised ? children : <Navigate to="/sign-in" replace />;
  }
};
