import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { supabaseClient } from "../../supabase-client"; // Import the supabase client
import Link from "@mui/joy/Link";
import Button from "@mui/joy/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "@mui/joy/Typography";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const navigate = useNavigate();

  // const handleSubmit = async (e) => {
  //     e.preventDefault();

  //     try {
  //         const userCredential = await createUserWithEmailAndPassword(auth, email, password); // Create a new user
  //         console.log(userCredential); // Log the user object
  //         const user = userCredential.user;  // Get the user object from the userCredential
  //         localStorage.setItem('token', user.accessToken); // Save the token to local storage
  //         localStorage.setItem('user', JSON.stringify(user)); // Save the user object to local storage
  //         navigate('/'); // Navigate to the home page after successful registration
  //     } catch (error) {
  //         console.log(error);
  //     }
  // }
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { user, error } = await supabaseClient.auth.signUp(
      {
        email: email,
        password: "123456", // Ideally, generate a strong, temporary password or handle password input
        options: {
          data: {
            first_name: "Joe",
            last_name: "Doe",
          }
        } 
      },
      {
        // Data passed to `data` will be available in the `user_metadata` of the auth user object
        
        // Optional: Specify a redirectTo URL if you want a custom landing page after email confirmation
        // redirectTo: "https://yourdomain.com/confirmation"
      }
    );

    if (error) {
      console.error("Error registering user:", error.message);
    } else {
      const { data: userData, error: userDataError } = await supabaseClient
        .from("users")
        .insert([
          {
            //user_id: user.id, // Use the UUID assigned by Supabase
            first_name: "Joe",
            last_name: "Doe",
          },
        ]);

      if (userDataError) {
        console.error(
          "Error saving user details to users table:",
          userDataError.message
        );
      } else {
        console.log("User details saved to users table:", userData);
      }
    }
    console.log("User registered:", user);
    // Add Pop up message
  };

  // if (user) {
  // }

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit">Register User</button>
      </form>
      <p>
        Need to Login? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;
