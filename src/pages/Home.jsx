import * as React from "react";
import Button from "@mui/joy/Button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../pages/Auth/Auth";

const Home = () => {
  const {user} = useAuth();
  const {signout} = useAuth();

  const handleLogout = () => {
    signout();
  }

  return (
    <div>
      <h1>Home</h1>
      <Button onClick={handleLogout} variant="solid">Logout</Button>
    </div>
  );
};

export default Home;