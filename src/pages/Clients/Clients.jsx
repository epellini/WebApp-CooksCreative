import React, {useEffect, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import List from '@mui/joy/List';
import ListItemButton from '@mui/joy/ListItemButton';
import Box from '@mui/joy/Box'
import Grid from '@mui/joy/Grid';
import Stack from '@mui/joy/Stack';
import Button from '@mui/joy/Button';



import {db} from "../../firebase";
import {collection, doc, getDocs, deleteDoc} from "firebase/firestore";


const ClientsList = () => {
  const [clients, setClients] = useState([]);
  const clientsCollectionRef = collection(db, "clients");

  const navigate = useNavigate();
  

  useEffect(() => {
    const getClients = async () => {
      const querySnapshot = await getDocs(collection(db, 'clients'));
      setClients(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
  
    getClients();
  }, []);

  const deleteClient = async (id) => {
    try {
      await deleteDoc(doc(db, 'clients', id));
      setClients(clients.filter(client => client.id !== id));
      console.log("Document successfully deleted!");
      
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  return (

    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
    {/* Button positioned on the left side of the screen */}
    <Box sx={{ marginRight: 2 }}>
      <Button onClick={() => navigate('/clients/new')}>Add New Client</Button>
    </Box>

    {/* Clients list centered in the remaining space */}
    <Box sx={{ flexGrow: 1 }}>
      <h1>Clients List</h1>
      <Grid container direction="column" justifyContent="center" alignItems="center">
        <Stack>
          <List>
            {clients.map((client) => (
              <ListItemButton key={client.id}>
                ID: {client.id} <br />
                Name: {client.firstName} {client.lastName} <br />
                <Link to={`/clients/${client.id}`}>Details</Link>
                <Link to={`/clients/edit/${client.id}`}>Edit</Link>
                <Button onClick={() => deleteClient(client.id)}>Delete</Button>
              </ListItemButton>
            ))}
          </List>
        </Stack>
      </Grid>
    </Box>
  </Box>

  );


  
};

export default ClientsList;
