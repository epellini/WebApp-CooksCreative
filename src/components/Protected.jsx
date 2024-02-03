import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const Protected = () => {
const token = localStorage.getItem('token'); // Get the token from local storage

  return (
    token ? (
      <div style={{ display: 'flex' }}>
        <Header />
        <Sidebar />
        <main style={{ flexGrow: 1 }}>
          <Outlet /> {/* This will render the child routes if the token exists */}
        </main>
      </div>
    ) : (
      <Navigate to="/login" /> // If no token, navigate to the login page
    )
  );
};

export default Protected