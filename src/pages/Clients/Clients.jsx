import React, {useEffect, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import List from '@mui/joy/List';
import Box from '@mui/joy/Box'
import Stack from '@mui/joy/Stack';
import Button from '@mui/joy/Button';
import ListItem from '@mui/joy/ListItem'; 
import Typography from '@mui/joy/Typography';
import ListItemButton from '@mui/joy/ListItemButton';
import { supabaseClient } from "../../supabase-client";
import ClientTable from "../../components/client/ClientTable";
const ClientsList = () => {
  const [clients, setClients] = useState([]);
  const supabase = supabaseClient; // Use your Supabase client
  const navigate = useNavigate();


  // useEffect(() => {
  //   const fetchClients = async () => {
  //     const { data, error } = await supabase
  //       .from('clients')
  //       .select('*');

  //     if (error) {
  //       console.log('Error fetching clients:', error.message);
  //     } else {
  //       setClients(data);
  //     }
  //   };

  //   fetchClients();
  // }, [supabase]);


  // // Function to delete a client by client_id
  // const deleteClient = async (client_id) => {
  //   const { error } = await supabase
  //     .from('clients')
  //     .delete()
  //     .eq('client_id', client_id);

  //   if (error) {
  //     alert(`Error deleting client: ${error.message}`);
  //   } else {
  //     // Refresh the clients list after deletion
  //     const updatedClients = clients.filter(client => client.client_id !== client_id);
  //     setClients(updatedClients);
  //     alert('Client successfully deleted');
  //   }
  //};
  return (
    <ClientTable />
    // <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
    //   <Button onClick={() => navigate('/clients/new')}>Add New Client</Button>
    //   <List sx={{ width: '100%' }}>
    //     {clients.map((client) => (
    //       <ListItem key={client.client_id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    //         <Box sx={{ display: 'flex', flexDirection: 'column' }}>
    //           <Typography>ID: {client.client_id}</Typography>
    //           <Typography>Name: {client.first_name} {client.last_name}</Typography>
    //         </Box>
    //         <Stack direction="row" spacing={2}>
    //           <Link to={`/clients/${client.client_id}`}>Details</Link>
    //           <Link to={`/clients/edit/${client.client_id}`}>Edit</Link>
    //           <Button onClick={() => deleteClient(client.client_id)}>Delete</Button>
    //         </Stack>
    //       </ListItem>
    //     ))}
    //   </List>
    // </Box>
    
  );
  
};

export default ClientsList;