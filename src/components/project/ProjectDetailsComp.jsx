import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabaseClient } from "../../supabase-client";
import { useParams } from "react-router-dom"; 
import Box from "@mui/joy/Box";
import Chip from "@mui/joy/Chip";
import Card from "@mui/joy/Card";
import CardOverflow from "@mui/joy/CardOverflow";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Snackbar from "@mui/joy/Snackbar";
import AspectRatio from "@mui/joy/AspectRatio";
import Divider from "@mui/joy/Divider";
import Avatar from "@mui/joy/Avatar";
import Tooltip from "@mui/joy/Tooltip";

import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ForwardToInboxRoundedIcon from "@mui/icons-material/ForwardToInboxRounded";
import FolderIcon from "@mui/icons-material/Folder";
import ReplyRoundedIcon from "@mui/icons-material/ReplyRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import EditNoteIcon from '@mui/icons-material/EditNote';


export default function ProjectDetailsComp() {
  // const project = {
  //   project_name: "Kitchen Remodeling Project",
  //   client_id: "123",
  //   project_description:
  //     "A kitchen renovation project encompasses a complete overhaul of the existing kitchen space, focusing on enhancing both functionality and aesthetics. This transformation often includes the installation of new countertops, cabinets, flooring, and state-of-the-art appliances, tailored to the homeowner's preferences and needs. The goal is to create a more efficient, modern, and inviting cooking and dining area that adds value to the home and improves the quality of living.",
  //   start_date: "2023-01-01",
  //   end_date: "2023-12-31",
  //   status: "Active",
  //   type: "Development",
  // };

  const [project, setProject] = useState({
    project_name: "",
    client_id: "",
    project_description: "",
    start_date: "",
    end_date: "",
    status_id: "",
    category_id: "",
  });
  const [client, setClient] = useState({
    client: {
      id: "",
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      notes: "",
      tag: "",
    },
  });
  const [status, setStatus] = useState({
    status: {
      category_id: "",
      name: "",
    },
  });

  const [category, setCategory] = useState({
    category: {
      id: "",
      name: "",
    },
  });

  const navigate = useNavigate();
  const supabase = supabaseClient;
  const { id } = useParams();


  useEffect(() => {
    const getProject = async () => {
        if(id){
          const { data: projectData, error: projectError } = await supabase
            .from("projects")
            .select("*")
            .eq("project_id", id)
            .single();
          if (projectError) {
            console.log("Error fetching project details:", projectError.message);
          } else {
            setProject(projectData);
          }

          const { data: clientData, error: clientError } = await supabase
            .from("clients")
            .select("*")
            .eq("client_id", projectData.client_id)
            .single();
            console.log(clientData);
          if (clientError) {
            console.log("Error fetching client details:", clientError.message);
          } else {
            setClient(clientData);
          }

          const { data: statusData, error: statusError } = await supabase
            .from("status")
            .select("*")
            .eq("status_id", projectData.status_id)
            .single();
          if (statusError) {
            console.log("Error fetching status details:", statusError.message);
          }
          else {
            setStatus(statusData);
          }

          const { data: categoryData, error: categoryError } = await supabase
            .from("category")
            .select("*")
            .eq("category_id", projectData.category_id)
            .single();
          if (categoryError) {
            console.log("Error fetching category details:", categoryError.message);
          }
          else {
            setCategory(categoryData);
          }



          

        }
    }
    getProject();
  }, []); // Fetch projects when the component mounts

  async function deleteProject(project_id) {
    const { error } = await supabase.from("projects").delete().match({ project_id });
    if (error) {
      console.error("Error deleting project:", error);
    } else {
      console.log("Project deleted successfully");
      // navigate back to the projects page
      navigate("/projects");
    }
  }

  const [open, setOpen] = React.useState([false, false, false]);

  const handleSnackbarOpen = (index) => {
    const updatedOpen = [...open];
    updatedOpen[index] = true;
    setOpen(updatedOpen);
  };

  const handleSnackbarClose = (index) => {
    const updatedOpen = [...open];
    updatedOpen[index] = false;
    setOpen(updatedOpen);
  };

  return (
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
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography level="h2" textColor="text.primary" mb={0.5}>
            {project.project_name}
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
            variant="plain"
            color="neutral"
            startDecorator={<EditNoteIcon />}
            onClick={() => navigate(`/projects/edit/${project.project_id}`)}
          >
            Edit Project
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
            Your project has been edited.
          </Snackbar>
          <Button
            size="sm"
            variant="plain"
            color="danger"
            startDecorator={<DeleteRoundedIcon />}
            onClick={() => deleteProject(project.project_id)}
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
          flexDirection: "column",
          alignItems: "start",
        }}
      >


        <Typography level="title-md" textColor="text.primary">
          Project Client: {client.first_name} {client.last_name}
          <Typography
            variant="body2"
            component="span"
            display="inline"
            style={{ fontSize: "smaller" }}
          >
            (Client ID: {project.client_id})
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
          <div>
            <Typography
              level="title-md"
              textColor="text.primary"
              component="span"
              sx={{ mr: 1, display: "inline-block" }}
            >
              Project Start Date: 
            </Typography>
            <Tooltip size="sm" variant="outlined">
              <Chip size="sm" variant="soft" color="primary">
                {project.start_date}
              </Chip>
            </Tooltip>
          </div>
          <div>
            <Typography
              component="span"
              level="title-md"
              textColor="text.primary"
              sx={{ mr: 1, display: "inline-block" }}
            >
              Project End Date:
            </Typography>
            <Tooltip size="sm" variant="outlined">
              <Chip size="sm" variant="soft" color="primary">
                {project.end_date}
              </Chip>
            </Tooltip>
          </div>
        </Box>
        <Typography
          mt={1}
          level="title-md"
          textColor="text.primary"
          component="span"
          sx={{ mr: 1, display: "inline-block" }}
        >
          Project Status: {status.name}
        </Typography>
        <Typography
          mt={1}
          level="title-md"
          textColor="text.primary"
          component="span"
          sx={{ mr: 1, display: "inline-block" }}
        >
          Project Category: {category.name}
        </Typography>
      </Box>

      <Divider />
      <Typography textAlign="left" level="body-sm" mt={2} mb={2}>
        <Typography level="title-md" textColor="text.primary" mb={1}>
          Project Description:
        </Typography>
        <br></br>
        {project.project_description}
      </Typography>
      <Divider />
      <Typography textAlign="left" level="title-sm" mt={2} mb={2}>
        Photos
      </Typography>
      <Box
        sx={(theme) => ({
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          "& > div": {
            boxShadow: "none",
            "--Card-padding": "0px",
            "--Card-radius": theme.vars.radius.sm,
          },
        })}
      >
        <Card variant="outlined">
          <AspectRatio ratio="1" sx={{ minWidth: 80 }}>
            <img
              src="https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&h=80"
              srcSet="https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&h=160 2x"
              alt="Yosemite National Park"
            />
          </AspectRatio>
        </Card>
        <Card variant="outlined">
          <AspectRatio ratio="1" sx={{ minWidth: 80 }}>
            <img
              src="https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&h=80"
              srcSet="https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&h=160 2x"
              alt="Yosemite National Park"
            />
          </AspectRatio>
        </Card>
      </Box>
    </Sheet>
  );
}