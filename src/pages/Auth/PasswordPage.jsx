import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from '@mui/joy/Button';
import TextField from '@mui/material/TextField';
import { supabaseClient } from "../../supabase-client"; // Make sure this path matches your project structure

const PasswordPage = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSetPassword = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    if (!password || password.length < 6) { // Ensuring the password meets your criteria
      alert("Password must be at least 6 characters long.");
      return;
    }

    try {
      // Updating the password in Supabase
      const { data, error } = await supabaseClient.auth.update({ password: password });
      if (error) throw error;

      alert("Your password has been updated successfully.");
      navigate('/login'); // Redirect the user to the login page
    } catch (error) {
      console.error("Error updating password:", error.message);
      alert("Failed to update the password. Please try again.");
    }
  };

  return (
    <div>
      <h1>Set Your New Password</h1>
      <TextField
        label="New Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Confirm New Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button onClick={handleSetPassword} variant="contained" style={{ marginTop: 20 }}>
        Set Password
      </Button>
    </div>
  );
};

export default PasswordPage;