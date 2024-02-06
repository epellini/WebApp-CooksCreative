// ProjectsList.js
import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import List from "@mui/joy/List";
import ListItemButton from "@mui/joy/ListItemButton";
import Grid from "@mui/joy/Grid";
import Stack from "@mui/joy/Stack";
import Button from "@mui/joy/Button";
import { Link } from "react-router-dom";
import { GetProjects } from "../../projectdbaccess";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const projectsData = await GetProjects();
        setProjects(projectsData);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    }
    fetchData();
  }, []);

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
              <ListItemButton key={project.project_id}>
                ID: {project.project_id} <br />
                Name: {project.project_name}
              </ListItemButton>
            ))}
          </List>
        </Stack>
      </Grid>
    </div>
  );
};

export default ProjectsList;
