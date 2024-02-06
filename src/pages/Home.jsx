import * as React from "react";
import Button from "@mui/joy/Button";
import { useNavigate } from "react-router-dom";

const Home = () => {

  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('Logged out successfully');
    navigate('/login');
  }

  return (
    <div>
      <h1>Home</h1>
      <Button onClick={handleLogout} variant="solid">Logout</Button>
    </div>
  );
};

export default Home;
