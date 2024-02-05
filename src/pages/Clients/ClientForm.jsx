import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, setDoc, getDoc, collection } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';

import Input from '@mui/joy/Input';
import FormLabel from '@mui/joy/FormLabel';
import Button from '@mui/joy/Button';
import Box from '@mui/joy/Box'

const ClientForm = () => {
    // State to hold client form data, initialized with empty strings for form fields
    const [client, setClient] = useState({ firstName: '', lastName: '', address:'', email: '', phoneNumber: '' });
    const { clientId } = useParams(); // Used for edit mode

    // Hook to programmatically navigate users
    const navigate = useNavigate();
  
    useEffect(() => {

        // If clientId exists, we're in edit mode and need to fetch the client's data
      if (clientId) {
        // Edit mode: Fetch the existing client data
        const fetchClient = async () => {
          const docRef = doc(db, 'clients', clientId); // Reference to the specific client document in Firestore
          const docSnap = await getDoc(docRef); // Fetch the document snapshot

          // If the document exists, populate the form state with the client's data
          if (docSnap.exists()) {
            setClient(docSnap.data());
          } else {
            console.log('No such document!'); // Log an error if no document exists for the given clientId
          }
        };
  
        fetchClient();
      }
    }, [clientId]); // Dependency array to re-run the effect if clientId changes
  

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
        try {
            // Check if we're in edit mode with an existing clientId
            // If not, create a new document reference for a new client
            const docRef = clientId 
                ? doc(db, 'clients', clientId) 
                : doc(collection(db, 'clients'));

            await setDoc(docRef, client); // Write the client data to Firestore, overwriting any existing document
            navigate('/clients'); // Navigate back to the clients list
            console.log(clientId ? 'Client updated successfully' : 'Client added successfully');
        } catch (error) {
            console.error('Error adding/editing client:', error);
        }
    };
  
    // The form for adding or editing client details.
    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Box>
        <FormLabel htmlFor="firstName">First Name</FormLabel>
        <Input
          id="firstName"
          name="firstName"
          value={client.firstName}
          onChange={handleChange}
          required
        />
      </Box>
      <Box>
        <FormLabel htmlFor="lastName">Last Name</FormLabel>
        <Input
          id="lastName"
          name="lastName"
          value={client.lastName}
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
        <FormLabel htmlFor="phoneNumber">Phone Number</FormLabel>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          value={client.phoneNumber}
          onChange={handleChange}
          required
        />
      </Box>
      <Button type="submit" variant="solid" color="primary" size="lg"> {clientId ? 'Update Client' : 'Add Client'}</Button>
    </form>
    );
  };
  
  export default ClientForm;