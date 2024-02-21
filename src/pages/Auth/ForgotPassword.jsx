import React from "react";
import { useEffect, useState } from "react";
import { Box, Input, Button } from "@mui/joy";
import { supabaseClient } from "../../supabase-client";
import { useLocation } from "react-router-dom";

function PasswordResetRequest({ setEmailSubmitted}) {
  const [email, setEmail] = useState("");
  /**
   * Step 1: Send the user an email to get a password reset token.
   * This email contains a link which sends the user back to your application.
   */
  async function handleSubmit(e) {
    e.preventDefault();
    const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email);

    if (data) {
      console.log("Password reset email sent");
      alert("Password reset email sent");
      setEmailSubmitted(true);
    }
    if (error) {
      console.log("Error sending password reset email", error);
      alert("Error sending password reset email");
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Button type="submit">Send Password Reset Email</Button>
    </Box>
  );
}

function PasswordResetForm() {
  const [newPassword, setNewPassword] = useState("");

  // /**
  //  * Step 2: Once the user is redirected back to your application,
  //  * ask the user to reset their password.
  //  */
  useEffect(() => {
    supabaseClient.auth.onAuthStateChange(async (event, session) => {
      if (event == "PASSWORD_RECOVERY") {
        setShowResetForm(true);
        const { data, error } = await supabaseClient.auth.updateUser({
          password: newPassword,
        });

        if (data) alert("Password updated successfully!");
        if (error) alert("There was an error updating your password.");
      }
    });
  }, [newPassword]);

  function handleChange(e) {
    setNewPassword(e.target.value);
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Input
        label="New Password"
        type="password"
        value={newPassword}
        onChange={handleChange}
        required
      />
      <Button
        onClick={() =>
          supabaseClient.auth.updateUser({ password: newPassword })
        }
      >
        Reset Password
      </Button>
    </Box>
  );
}

export default function ForgotPassword() {
    const [emailSubmitted, setEmailSubmitted] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');
        console.log('token:', token);
        if (token) {
            setEmailSubmitted(true);
        }
    }, [location]);
  return (
    <div>
    <h1>Forgot Password</h1>
    {!emailSubmitted && <PasswordResetRequest setEmailSubmitted={setEmailSubmitted} />}
    {emailSubmitted && <PasswordResetForm />}
  </div>
  );
}
