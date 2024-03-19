import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from '@mui/joy/Button';
import TextField from '@mui/material/TextField';
import { supabaseClient } from "../../supabase-client"; 
import { useEffect } from "react";
const PasswordPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      const { data: session, error } = await supabaseClient.auth.getSession();
  
      if (error) {
        console.error("Error retrieving session:", error.message);
        // Handle error, such as redirecting to login
      }
  
      if (!session) {
        console.log("No active session found");
        // navigate('/login'); // Uncomment to redirect to login if no session is found
      }
    };
  
    checkSession();
  }, [navigate]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabaseClient.auth.getUser();
  
      if (error) {
        console.error("Error retrieving user:", error.message);
        // Handle error, such as redirecting to login
      }
  
      if (!user) {
        console.log("No active user found.");
        // navigate('/login'); // Uncomment to redirect to login if no user is found
      }
    };
  
    fetchUser();
  }, [navigate]);

  const handleSetPassword = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    if (!password || password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    try {
      const { error } = await supabaseClient.auth.updateUser({
        password: password
      });
      if (error) throw error;
      alert("Your password has been updated successfully.");
      navigate('/login'); 
    } catch (error) {
      console.error("Error updating password:", error.message);
      alert("Failed to update the password. Please try again.");
    }
  };






// const PasswordPage = () => {
//   const navigate = useNavigate();

//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');

//   const handleSetPassword = async () => {
//     if (password !== confirmPassword) {
//       alert("Passwords do not match.");
//       return;
//     }
//     if (!password || password.length < 6) {
//       alert("Password must be at least 6 characters long.");
//       return;
//     }

//     console.log(supabaseClient);
//     console.log(supabaseClient.auth);
//     try {
//       // Updating the password in Supabase
//       const { data, error } = await supabaseClient.auth.updateUser({
//         password: password
//         });
//       if (error) throw error;
      

//       alert("Your password has been updated successfully.");
//       navigate('/login'); // Redirect the user to the login page
//     } catch (error) {
//       console.error("Error updating password:", error.message);
//       alert("Failed to update the password. Please try again.");
//     }
//   };

  return (
    <div>
      <h1>Set Your New Password</h1>
      <div>
        <label htmlFor="new-password">New Password</label>
        <input
          id="new-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="confirm-password">Confirm New Password</label>
        <input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <button onClick={handleSetPassword} style={{ marginTop: '20px' }}>
        Set Password
      </button>
    </div>
  );
};

export default PasswordPage;



// const PasswordPage = () => {
//   const navigate = useNavigate();

//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');

//   const handleSetPassword = async () => {
//     if (password !== confirmPassword) {
//       alert("Passwords do not match.");
//       return;
//     }
//     if (!password || password.length < 6) { // Ensuring the password meets your criteria
//       alert("Password must be at least 6 characters long.");
//       return;
//     }

//     try {
//       // Updating the password in Supabase
//       const { data, error } = await supabaseClient.auth.update({ password: password });
//       if (error) throw error;

//       alert("Your password has been updated successfully.");
//       navigate('/login'); // Redirect the user to the login page
//     } catch (error) {
//       console.error("Error updating password:", error.message);
//       alert("Failed to update the password. Please try again.");
//     }
//   };

//   return (
//     <div>
//       <h1>Set Your New Password</h1>
//       <TextField
//         label="New Password"
//         type="password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         fullWidth
//         margin="normal"
//       />
//       <TextField
//         label="Confirm New Password"
//         type="password"
//         value={confirmPassword}
//         onChange={(e) => setConfirmPassword(e.target.value)}
//         fullWidth
//         margin="normal"
//       />
//       <Button onClick={handleSetPassword} variant="contained" style={{ marginTop: 20 }}>
//         Set Password
//       </Button>
//     </div>
//   );
// };

// export default PasswordPage;