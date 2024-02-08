import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import List from "@mui/joy/List";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import Button from "@mui/joy/Button";
import ListItem from "@mui/joy/ListItem";
import Typography from "@mui/joy/Typography";
import ListItemButton from "@mui/joy/ListItemButton";
import { supabaseClient } from "../../supabase-client";
import ClientTable from "../../components/client/ClientTable";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";

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
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100dvh" }}>
        <Box
          component="main"
          className="MainContent"
          sx={{
            px: { xs: 2, md: 6 },
            pt: {
              xs: "calc(12px + var(--Header-height))",
              sm: "calc(12px + var(--Header-height))",
              md: 3,
            },
            pb: { xs: 2, sm: 2, md: 3 },
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            height: "100dvh",
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Breadcrumbs
              size="sm"
              aria-label="breadcrumbs"
              separator={<ChevronRightRoundedIcon fontSize="sm" />}
              sx={{ pl: 0 }}
            >
              <Link
                underline="none"
                color="neutral"
                href="#some-link"
                aria-label="Home"
              >
                <HomeRoundedIcon />
              </Link>
              <Link
                underline="hover"
                color="neutral"
                to={"/"}
                fontSize={12}
                fontWeight={500}
              >
                Dashboard
              </Link>

              <Typography color="primary" fontWeight={500} fontSize={12}>
                Clients
              </Typography>
            </Breadcrumbs>
          </Box>
          <Box
            sx={{
              display: "flex",
              mb: 1,
              gap: 1,
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "start", sm: "center" },
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <Typography level="h2" component="h1">
              Clients
            </Typography>
            <Button
              onClick={() => navigate("/clients/new")}
              color="primary"
              startDecorator={<DownloadRoundedIcon />}
              size="sm"
            >
              New Cleint
            </Button>
          </Box>
          <ClientTable cleints={clients} />
        </Box>
      </Box>
    </CssVarsProvider>

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
