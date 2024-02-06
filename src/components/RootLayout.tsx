import React from "react";
import { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useAuth } from '../pages/Auth/Auth';

function RootLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const isAuthenticated = !!user; 
return (
  <div className="layout">
      {isAuthenticated && (
        <div className="sidebar">
          <Sidebar />
        </div>
      )}
      <div className="main-content">
        {isAuthenticated && <Header />}
        {children}
      </div>
    </div>
  );
}

export default RootLayout;