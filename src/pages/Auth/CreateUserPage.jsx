import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '@mui/joy/Input';
import FormLabel from '@mui/joy/FormLabel';
import Button from '@mui/joy/Button';
import Box from '@mui/joy/Box';
import { supabaseClient } from '../../supabase-client';

const UserForm = () => {
  // State to hold new user data
  const [user, setUser] = useState({ name: '', email: '', password: ''});
  const navigate = useNavigate();

  // Updates the user state with form field values on change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

// Handles form submission for creating a new user
const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = user;

    try {
      const { user: newUser, error: signUpError } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: { 
            first_name: name,
           },
        }
      });

      if (!signUpError && newUser) {
        console.log('User created successfully:', newUser);
        navigate('/');
      } else {
        throw signUpError;
      }
    } catch (error) {
      console.error('Error in user creation:', error.message || error);
    }
};

  // The form for adding a new user.
  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Box>
        <FormLabel htmlFor="name">Full Name</FormLabel>
        <Input
          id="name"
          name="name"
          value={user.name}
          onChange={handleChange}
          required
        />
      </Box>
      
      <Box>
        <FormLabel htmlFor="email">Email</FormLabel>
        <Input
          id="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          required
        />
      </Box>
      <Box>
        <FormLabel htmlFor="password">Temporary Password</FormLabel>
        <Input
          id="password"
          name="password"
          type="password"
          value={user.password}
          onChange={handleChange}
          required
        />
      </Box>
      <Button type="submit" variant="solid" color="primary" size="lg">Create User</Button>
    </form>
  );
};

export default UserForm;
