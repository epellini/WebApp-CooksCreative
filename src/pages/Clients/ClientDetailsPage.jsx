import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabaseClient } from "../../supabase-client";

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
import Divider from "@mui/joy/Divider";
import { Link } from "react-router-dom";

import ConstructionIcon from '@mui/icons-material/Construction';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import HomeIcon from "@mui/icons-material/Home";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import NoteIcon from "@mui/icons-material/Note";
import LabelIcon from "@mui/icons-material/Label";
import RoomIcon from "@mui/icons-material/Room";

const ClientDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState({});
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  useEffect(() => {
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
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);
  const handleEdit = () => {
    navigate(`/clients/edit/${id}`);
  };

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
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 2 }}>
      <Typography variant="h3" gutterBottom>
        {client.first_name} {client.last_name}'s Details
      </Typography>
      <Card elevation={4} sx={{ p: 2, mb: 2 }}>
        <CardContent>
          <Typography variant="h6">Contact Information</Typography>
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 2 }}
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

            <Divider/>

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
        </CardContent>
        <CardActions sx={{ justifyContent: "space-between" }}>
          <Button
            startDecorator={<EditIcon />}
            variant="outlined"
            onClick={handleEdit}
          >
            Edit
          </Button>
          <Button
            startDecorator={<DeleteIcon />}
            color="danger"
            variant="outlined"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </CardActions>
      </Card>
      <Button
        variant="outlined"
        startDecorator={<HomeIcon />}
        onClick={() => navigate("/clients")}
      >
        Back to Clients
      </Button>
    </Box>
  );
};

export default ClientDetailsPage;
