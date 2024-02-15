import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../pages/Auth/Auth';

const Protected = ({isAdminRoute = false}) => {
  const { user } = useAuth();

  if (!user) {
    // User not logged in, redirect to login
    return <Navigate to="/login" />;
  } else if (isAdminRoute && !user.is_admin) {
    // User is not an admin, but trying to access an admin-only route
    return <Navigate to="/" />; // Redirect to a general page, adjust as needed
  }
  return <Outlet />;
};

export default Protected;