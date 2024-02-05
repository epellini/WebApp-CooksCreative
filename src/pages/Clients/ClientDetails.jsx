import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Grid from "@mui/joy/Grid";
import Stack from "@mui/joy/Stack";
import Button from "@mui/joy/Button";
import {db} from "../../firebase";
import {doc, getDoc} from "firebase/firestore";

const ClientDetails = () => {
  // Extract the client ID from the URL parameters
  const { id } = useParams();

  // State to store the client's details
  const [client, setClient] = useState(null);

  // Fetch the client's details from Firestore when the component mounts or the ID changes
  
  useEffect(() => {
    const getClient = async () => {
      const docRef = doc(db, 'clients', id); // Create a reference to the specific client document in Firestore
      const docSnap = await getDoc(docRef) // Fetch the document data

      // Check if the document exists
      if(docSnap.exists()){
        // If the document exists, update the state with the client's details
        setClient({id: docSnap.id, ...docSnap.data()});
      } else{
        // Log an error if the document does not exist
        console.log("No such document");
      }
    };
    getClient();
  }, [id])

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
          <div>ID: {client.id}</div>
          <div>Name: {client.firstName} {client.lastName}</div>
          <div>Address: {client.address}</div>
          <div>Email: {client.email}</div>
          <div>Phone Number: {client.phoneNumber}</div>
          {/* Implement Delete function  here if needed*/}
          {/* <Button onClick={() => deleteClient(client.id)}>Delete</Button> */}
        </Stack>
      </Grid>
    </div>
  );
};

export default ClientDetails;
