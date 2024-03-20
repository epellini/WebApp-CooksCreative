import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabaseClient } from "../../supabase-client";
import { Link } from "react-router-dom";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardActions from "@mui/joy/CardActions";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Chip from "@mui/joy/Chip";
import Stack from "@mui/joy/Stack";
import IconButton from "@mui/joy/IconButton";
import Grid from "@mui/joy/Grid";
import Sheet from "@mui/joy/Sheet";
import Divider from "@mui/joy/Divider";
import Snackbar from "@mui/joy/Snackbar";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ConstructionIcon from "@mui/icons-material/Construction";
import EditIcon from "@mui/icons-material/Edit";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import HomeIcon from "@mui/icons-material/Home";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import NoteIcon from "@mui/icons-material/Note";
import LabelIcon from "@mui/icons-material/Label";
import RoomIcon from "@mui/icons-material/Room";
import CssBaseline from "@mui/joy/CssBaseline";
import { CssVarsProvider } from "@mui/joy/styles";
const ClientDetailsPage = () => {
  const { id } = useParams(); // Get client ID from URL
  const navigate = useNavigate();
  const [client, setClient] = useState({}); // State to store client details
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [projects, setProjects] = useState([]); // State to store related projects

  useEffect(() => {
    // Function to fetch client and projects data from the database
    const fetchData = async () => {
      try {
        const { data: clientData, error: clientError } = await supabaseClient
          .from("clients")
          .select("*")
          .eq("client_id", id)
          .single();
        if (clientError) throw clientError;
        setClient(clientData);

        const { data: projectsData, error: projectsError } =
          await supabaseClient.from("projects").select("*").eq("client_id", id);
        if (projectsError) throw projectsError;
        setProjects(projectsData);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchData();
  }, [id]);

  // Navigate to edit client page
  const handleEdit = () => {
    navigate(`/clients/edit/${id}`);
  };

  // Function to delete a client
  const handleDelete = async () => {
    try {
      const { error } = await supabaseClient
        .from("clients")
        .delete()
        .match({ client_id: id });
      if (error) throw error;
      navigate("/clients");
    } catch (error) {
      console.error("Error deleting client:", error.message);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>; // Show loading message while data is being fetched
  }

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
          {/* Breadcrumbs for navigation */}
          <Breadcrumbs
            size="sm"
            aria-label="breadcrumbs"
            separator={<ChevronRightRoundedIcon fontSize="small" />}
            sx={{ mb: 2 }} // Add margin bottom for spacing
          >
            <Link
              component={Link}
              to="/"
              underline="none"
              color="neutral"
              aria-label="Home"
            >
              <HomeRoundedIcon />
            </Link>
            <Link
              component={Link}
              to="/clients"
              underline="hover"
              color="neutral"
            >
              Clients
            </Link>
            <Typography color="primary" fontWeight={500}>
              Details
            </Typography>
          </Breadcrumbs>

          <Box sx={{ display: "flex" }}>
            <Sheet
              variant="outlined"
              sx={{
                minHeight: 500,
                width: "100%",
                borderRadius: "sm",
                p: 2,
                mb: 3,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    level="h2"
                    textColor="text.primary"
                    mb={0.5}
                    sx={{ paddingRight: 3 }}
                  >
                    {client.first_name} {client.last_name}'s Details
                  </Typography>

                  <Box sx={{ ml: 2 }}></Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    height: "32px",
                    flexDirection: "row",
                    gap: 1.5,
                  }}
                >
                  <Button
                    size="sm"
                    variant="soft"
                    color="neutral"
                    startDecorator={<EditIcon />}
                    onClick={handleEdit}
                  >
                    Edit Client
                  </Button>

                  <Snackbar
                    color="success"
                    open={open[1]}
                    onClose={() => handleSnackbarClose(1)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    startDecorator={<CheckCircleRoundedIcon />}
                    endDecorator={
                      <Button
                        onClick={() => handleSnackbarClose(1)}
                        size="sm"
                        variant="soft"
                        color="neutral"
                      >
                        Dismiss
                      </Button>
                    }
                  >
                    Your client has been edited.
                  </Snackbar>

                  <Button
                    size="sm"
                    variant="soft"
                    color="danger"
                    startDecorator={<DeleteRoundedIcon />}
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                  <Snackbar
                    color="danger"
                    open={open[2]}
                    onClose={() => handleSnackbarClose(2)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    startDecorator={<CheckCircleRoundedIcon />}
                    endDecorator={
                      <Button
                        onClick={() => handleSnackbarClose(2)}
                        size="sm"
                        variant="soft"
                        color="neutral"
                      >
                        Dismiss
                      </Button>
                    }
                  >
                    Your project has been deleted.
                  </Snackbar>
                </Box>
              </Box>
              <Divider sx={{ mt: 2 }} />
              <Box
                sx={{
                  py: 2,
                  display: "flex",
                  flexDirection: { xs: "column", md: "row", },
                  alignItems: "start",
                }}
              >
                <Box
                  sx={{
                    flexBasis: "60%", // Assign 60% of the width to this container
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                  }}
                >
                  <Typography level="title-md" textColor="text.primary">
                    Client: {client.first_name} {client.last_name}
                    <Typography
                      variant="body2"
                      component="span"
                      display="inline"
                      style={{ fontSize: "smaller" }}
                    >
                      (Client ID: {client.client_id})
                    </Typography>
                  </Typography>

                  <Box
                    sx={{
                      mt: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography
                      mt={1}
                      level="title-md"
                      textColor="text.primary"
                      component="span"
                      sx={{ mr: 1, display: "inline-block" }}
                    >
                      Address:{" "}
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          `${client.street}, ${client.city}, ${client.province} ${client.postal_code}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        sx={{ color: "inherit", textDecoration: "none" }} // Optionally set the color to match the surrounding text
                      >
                        {client.street}, {client.city}, {client.province},{" "}
                        {client.postal_code}
                      </a>
                    </Typography>

                    <Typography
                      mt={1}
                      level="title-md"
                      textColor="text.primary"
                      component="span"
                      sx={{ mr: 1, display: "inline-block" }}
                    >
                      Email:{" "}
                      <a
                        href={`mailto:${client.email}`}
                        style={{ textDecoration: "none" }}
                      >
                        {" "}
                        {client.email}{" "}
                      </a>
                    </Typography>
                    <Typography
                      mt={1}
                      level="title-md"
                      textColor="text.primary"
                      component="span"
                      sx={{ mr: 1, display: "inline-block" }}
                    >
                      Phone: 
                      <a
                          href={`tel:${client.phone_number}`}
                          style={{ textDecoration: "none" }}
                        >{client.phone_number}</a>
                    </Typography>
                    <Typography
                      mt={1}
                      level="title-md"
                      textColor="text.primary"
                      component="span"
                      sx={{ mr: 1, display: "inline-block" }}
                    >
                      Notes: {client.notes}
                    </Typography>
                    <Typography
                      mt={1}
                      level="title-md"
                      textColor="text.primary"
                      component="span"
                      sx={{ mr: 1, display: "inline-block" }}
                    >
                      Tag: {client.tag}
                    </Typography>
                    <Typography
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      Projects:{" "}
                      {projects.map((project, index) => (
                        <Typography
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {project.project_name}
                          {index < projects.length - 1 && ","}
                        </Typography>
                      ))}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Sheet>
          </Box>
        </Box>
      </Box>
    </CssVarsProvider>
  );
};

export default ClientDetailsPage;

{
  /* <Typography variant="h3" gutterBottom>
              {client.first_name} {client.last_name}'s Details
            </Typography> */
}
{
  /* <Card elevation={4} sx={{ p: 2, mb: 2 }}>
              <CardContent>
                <Typography variant="h6">Contact Information</Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    mt: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Chip startDecorator={<RoomIcon />} />
                    <Typography
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      {client.address}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Chip startDecorator={<EmailIcon />} />
                    <Typography
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      {client.email}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Chip startDecorator={<PhoneIcon />} />
                    <Typography
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      {client.phone_number}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Chip startDecorator={<NoteIcon />} />
                    <Typography
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      {client.notes}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Chip startDecorator={<LabelIcon />} />
                    <Typography
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      {client.tag}
                    </Typography>
                  </Box>

                  <Divider />

                  <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                    <Chip startDecorator={<ConstructionIcon />} />
                    {projects.map((project, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Typography
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {project.project_name}
                          {index < projects.length - 1 && ","}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </CardContent> */
}
{
  /* <CardActions sx={{ justifyContent: "space-between" }}>
                <Button
                  startDecorator={<EditIcon />}
                  variant="outlined"
                  onClick={handleEdit}
                >
                  Edit
                </Button>
                <Button
                  startDecorator={<DeleteRoundedIcon />}
                  color="danger"
                  variant="outlined"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </CardActions>
            </Card> */
}
{
  /* <Button
              variant="outlined"
              startDecorator={<HomeIcon />}
              onClick={() => navigate("/clients")}
            >
              Back to Clients
            </Button> */
}
