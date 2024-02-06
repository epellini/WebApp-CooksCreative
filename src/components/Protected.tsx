import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../pages/Auth/Auth';

const Protected = () => {
  const { user } = useAuth();

  if (!user) {
    // If the user is not logged in, redirect to the login page
    return <Navigate to="/login" />;
  } 
  return <Outlet />;
};

export default Protected;