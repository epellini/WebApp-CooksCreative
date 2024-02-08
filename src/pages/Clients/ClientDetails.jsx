import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Grid from "@mui/joy/Grid";
import Stack from "@mui/joy/Stack";
import Typography from '@mui/joy/Typography';
import Button from "@mui/joy/Button";
import {supabaseClient}  from "../../supabase-client";
const ClientDetails = () => {
  // Extract the client ID from the URL parameters
  const { id } = useParams();

  // State to store the client's details
  const [client, setClient] = useState(null);
  const [projects, setProjects] = useState([]); // State to store projects associated with the client

  const supabase = supabaseClient;
  // Fetch the client's details from Firestore when the component mounts or the ID changes
  useEffect(() => {
    const getClient = async () => {
      if (id) {
        // Fetch client details
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select("*")
          .eq('client_id', id)
          .single();

        if (clientError) {
          console.log("Error fetching client details:", clientError.message);
        } else {
          setClient(clientData);
        }

        // Fetch projects associated with the client
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select("*")
          .eq('client_id', id); 

        if (projectsError) {
          console.log("Error fetching projects:", projectsError.message);
        } else {
          setProjects(projectsData);
        }
      }
    };

    getClient();
  }, [id]);

  if (!client) {
    return <div>Loading client details...</div>;
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
          {projects.map((project) => (
            <Typography key={project.project_id}>Project Name: {project.project_name}</Typography>
          ))}
          {/* Implement Delete function  here if needed*/}
          {/* <Button onClick={() => deleteClient(client.client_id)}>Delete</Button> */}
        </Stack>
      </Grid>
    </div>
  );
};

export default ClientDetails;
