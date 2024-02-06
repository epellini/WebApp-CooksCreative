import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Grid from "@mui/joy/Grid";
import Stack from "@mui/joy/Stack";
import Button from "@mui/joy/Button";
import {useSupabase}  from "../../supabase";
const ClientDetails = () => {
  // Extract the client ID from the URL parameters
  const { id } = useParams();

  // State to store the client's details
  const [client, setClient] = useState(null);


  const { supabase } = useSupabase();
  // Fetch the client's details from Firestore when the component mounts or the ID changes
  useEffect(() => {
    const getClient = async () => {
      if (id) { // Use 'id' here
        const { data, error } = await supabase
          .from('clients')
          .select("*")
          .eq('client_id', id) // Assuming your column in Supabase is named 'client_id'
          .single(); 
  
        if (error) {
          console.log("Error fetching client details:", error.message);
        } else {
          setClient(data);
        }
      }
    };
  
    getClient();
  }, [id]); // Use 'id' in the dependency array

  

  // Display a loading message if the client's details haven't been fetched yet
  if (!client) {
    return <div>Loading...</div>;
  }

  // Render the client's details once they have been fetched
  return (
    <div>
      <h1>Client Details</h1>
      <Grid container direction="column" justifyContent="center" alignItems="center">
        <Stack spacing={2}>
        <div>ID: {client.client_id}</div>
          <div>Name: {client.first_name} {client.last_name}</div>
          <div>Address: {client.address}</div>
          <div>Email: {client.email}</div>
          <div>Phone Number: {client.phone_number}</div>
          <div>Notes: {client.notes}</div>
          <div>Tag: {client.tag}</div>
          {/* Implement Delete function  here if needed*/}
          {/* <Button onClick={() => deleteClient(client.client_id)}>Delete</Button> */}
        </Stack>
      </Grid>
    </div>
  );
};

export default ClientDetails;
