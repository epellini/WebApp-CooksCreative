import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../pages/Auth/Auth';

const Protected = ({ isAdminRoute = false }) => {
  const { user, isAdmin } = useAuth();

  if (!user) {
    // User not logged in, redirect to login
    return <Navigate to="/login" />;
  } else if (isAdminRoute && !isAdmin) {
    // Checking isAdmin flag for admin-only routes
    return <Navigate to="/" />; // Redirect non-admin users trying to access admin-only routes
  }
  return <Outlet />;
};

export default Protected;
