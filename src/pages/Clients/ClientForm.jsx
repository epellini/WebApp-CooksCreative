import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '@mui/joy/Input';
import FormLabel from '@mui/joy/FormLabel';
import Button from '@mui/joy/Button';
import Box from '@mui/joy/Box'
import { supabaseClient } from '../../supabase-client';

const ClientForm = () => {
    // State to hold client form data, initialized with empty strings for form fields
    const [client, setClient] = useState({ first_name: '', last_name: '', address:'', email: '', phone_number: '', notes: '', tag: '' });
    const { clientId } = useParams(); // Used for edit mode

    // Hook to programmatically navigate users
    const navigate = useNavigate();
  

    const supabase = supabaseClient;
    useEffect(() => {
      if (clientId) {
        const fetchClient = async () => {
          let { data, error } = await supabase
            .from('clients')
            .select("*")
            .eq('client_id', clientId) 
            .single();
    
          if (error) {
            console.error('Error fetching client:', error);
          } else {
            
            setClient({
              first_name: data.first_name,
              last_name: data.last_name,
              address: data.address,
              email: data.email,
              phone_number: data.phone_number,
              notes: data.notes,
              tag: data.tag 
            });
          }
        };
    
        fetchClient();
      }
    }, [clientId, supabase]); // Dependency array to re-run the effect if clientId changes
  

    // Updates the client state with form field values on change
    const handleChange = (e) => {
      const { name, value } = e.target;
      setClient((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };
  
    // Handles form submission for both adding and editing a client
    const handleSubmit = async (e) => {
      e.preventDefault();
      const updates = {
        first_name: client.first_name,
        last_name: client.last_name,
        address: client.address,
        email: client.email,
        phone_number: client.phone_number,
        notes: client.notes,
        tag: client.tag,
        ...(clientId ? { client_id: clientId } : {}) // Including client_id if in edit mode
      };

      let result = null;

      if (clientId) {
        // Updating an existing client
        result = await supabaseClient
            .from('clients')
            .update(updates)
            .eq('client_id', clientId); // Ensure this uses the correct column name as per your table schema
      } else {
        // Inserting a new client
        result = await supabaseClient
            .from('clients')
            .insert([updates]);
      }

      if (result.error) {
        console.error('Error adding/editing client:', result.error);
      } else {
        navigate('/clients'); // Navigate back to the clients list after successful operation
        console.log(clientId ? 'Client updated successfully' : 'Client added successfully');
      }
    };
      // The form for adding or editing client details.
      return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Box>
          <FormLabel htmlFor="first_name">First Name</FormLabel>
          <Input
            id="first_name"
            name="first_name"
            value={client.first_name}
            onChange={handleChange}
            required
          />
        </Box>
        <Box>
          <FormLabel htmlFor="last_name">Last Name</FormLabel>
          <Input
            id="last_name"
            name="last_name"
            value={client.last_name}
            onChange={handleChange}
            required
          />
        </Box>
        <Box>
          <FormLabel htmlFor="address">Address</FormLabel>
          <Input
            id="address"
            name="address"
            value={client.address}
            onChange={handleChange}
            required
          />
        </Box>
        <Box>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            id="email"
            name="email"
            value={client.email}
            onChange={handleChange}
            required
          />
        </Box>
        <Box>
          <FormLabel htmlFor="phone_number">Phone Number</FormLabel>
          <Input
            id="phone_number"
            name="phone_number"
            value={client.phone_number}
            onChange={handleChange}
            required
          />
        </Box>
        <Box>
          <FormLabel htmlFor="notes">Notes</FormLabel>
          <Input
            id="notes"
            name="notes"
            value={client.notes}
            onChange={handleChange}
            required
          />
        </Box>
        <Box>
          <FormLabel htmlFor="tag">Tag</FormLabel>
          <Input
            id="tag"
            name="tag"
            value={client.tag}
            onChange={handleChange}
            required
          />
        </Box>
      <Button type="submit" variant="solid" color="primary" size="lg"> {clientId ? 'Update Client' : 'Add Client'}</Button>
    </form>
    );
  };

export default ClientForm;