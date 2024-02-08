import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import List from "@mui/joy/List";
import ListItemButton from "@mui/joy/ListItemButton";
import Grid from "@mui/joy/Grid";
import Stack from "@mui/joy/Stack";
import Button from "@mui/joy/Button";
import { Link } from "react-router-dom";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import ProjectTable from "../../components/project/ProjectTable";
import ProjectList from "../../components/project/ProjectList";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import { useNavigate } from "react-router-dom";
import { supabaseClient } from "../../supabase-client"; // Import the supabase client

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [client_id, setClient_id] = useState("");
  const [project_description, setProject_description] = useState("");
  const [start_date, setStart_date] = useState("");
  const [end_date, setEnd_date] = useState("");
  const navigate = useNavigate();
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    getProjects();
  }, []); // Fetch projects when the component mounts

  async function getProjects() {
    const { data, error } = await supabaseClient.from("projects").select("*"); // Get all projects
    
    if (error) {
      console.error("Error fetching projects:", error); // Log an error if there is one
    } else {
      // Get all clients, with the clients return all of their data where their information matches the client id on the project
      const projectsWithClients = await Promise.all(
        data.map(async (project) => {
          const { data: clientData, error: clientError } = await supabaseClient
            .from("clients")
            .select("*")
            .eq("client_id", project.client_id)
            .single();
          if (clientError) {
            console.error("Error getting client:", clientError); //if there is an issue getting the client information
            return project;
          }

          const { data: statusData, error: statusError } = await supabaseClient
            .from("status")
            .select("*")
            .eq("status_id", project.status_id)
            .single();
          if (statusError) {
            console.error("Error getting status:", statusError);
            return project;
          }

          return { ...project, client: clientData, status: statusData }; // create a client variable that includes all of the client data
        })
      );
      setProjects(projectsWithClients);
    }
  }

  async function addProject(e) {
    e.preventDefault();
    if (projectName.trim() !== "") {
      const { data, error } = await supabase.from("projects").insert([
        {
          project_name: projectName,
          client_id: client_id,
          project_description: project_description,
          start_date: start_date,
          end_date: end_date,
          complete: complete,
        },
      ]);
      if (error) {
        console.error("Error adding project:", error);
      } else {
        if (data) {
          console.log("we have data");
          // Update the project list in the state without reloading the page
          setProjects([...projects, data[0]]);
          //can choose to do something with the data here if we need to in the future
          // Clear the input fields
          setProjectName("");
          setClient_id("");
          setProject_description("");
          setStart_date("");
          setEnd_date("");
          setComplete(false);
        } else {
          console.log("Project added successfully");
          // Clear the input fields
          setProjectName("");
          setClient_id("");
          setProject_description("");
          setStart_date("");
          setEnd_date("");
          setComplete(false);
          getProjects(); // Reload the project list
        }
      }
    }
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
              Projects
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
          Projects
        </Typography>
        <Button 
        onClick={() => navigate('/projects/new')}
          color="primary"
          startDecorator={<DownloadRoundedIcon />}
          size="sm"
        >
          New Project
        </Button>
      </Box>
      <ProjectTable projects={projects}/>
      <ProjectList projects={projects}/>
    </Box>
    </Box>
    </CssVarsProvider>
  );
};

export default ProjectsList;
