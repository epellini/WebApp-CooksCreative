import React, {useEffect, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import List from '@mui/joy/List';
import Box from '@mui/joy/Box'
import Grid from '@mui/joy/Grid';
import Stack from '@mui/joy/Stack';
import Button from '@mui/joy/Button';

const ClientsList = () => {

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

          </List>
        </Stack>
      </Grid>
    </Box>
  </Box>

  );


  
};

export default ClientsList;
