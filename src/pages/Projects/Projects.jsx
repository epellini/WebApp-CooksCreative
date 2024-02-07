import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import List from '@mui/joy/List';
import ListItemButton from '@mui/joy/ListItemButton';
import Grid from '@mui/joy/Grid';
import Stack from '@mui/joy/Stack';
import Button from '@mui/joy/Button';
import { Link } from "react-router-dom";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  
  useEffect(() => {
    getProjects();
  }, []); // Fetch projects when the component mounts

  async function getProjects() {
    const { data, error } = await supabase.from("projects").select("*"); // Get all projects
    if (error) {
      console.error("Error fetching projects:", error); // Log an error if there is one
    } else {
      // Get all clients, with the clients return all of their data where their information matches the client id on the project
      const projectsWithClients = await Promise.all(
        data.map(async (project) => {
          const { data: clientData, error: clientError } = await supabase
            .from("clients") 
            .select("*") 
            .eq("client_id", project.client_id)
            .single();
          if (clientError) {
            console.error("Error getting client:", clientError); //if there is an issue getting the client information
            return project;
          }

          const { data: statusData, error: statusError } = await supabase
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


  return (
    <div>
      <h1>Project List</h1>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Stack>
          <List>
            {projects.map((project) => (
              <ListItemButton key={project.project_id} component={Link} to={`/projects/${project.project_id}`}>
                ID: {project.project_id} <br />
                Name: {project.project_name} <br />
                Client: {project.client_id} <br />
                Description: {project.project_description} <br />
                Start Date: {project.start_date} <br />
                End Date: {project.end_date} <br />
                Complete: {project.complete ? "Yes" : "No"} <br />
                {/* **********Here we implement the client and project data together******* */}
                Client Full Name: {project.client.first_name} {project.client.last_name} <br />
                Client Email: {project.client.email} <br />
                {/* **********Here we implement the status and project data together******* */}
                Status: {project.status.name} <br />
                Status ID: {project.status.status_id} <br />
                
                <Link to={`/projects/edit/${project.project_id}`}>Edit</Link> <br />
              </ListItemButton>
            ))}
          </List>
        </Stack>
      </Grid>
      <Link to={`/projects/new`}>Add New Project</Link> <br />

    </div>
  );
};

export default ProjectsList;
