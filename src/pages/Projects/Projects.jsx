import React, { useState } from "react";
import { useEffect } from "react";
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
  const [projectName, setProjectName] = useState("");

  useEffect(() => {
    getProjects();
  }, []);

  async function getProjects() {
    const { data } = await supabase.from("projects").select("*"); // Get all projects
    setProjects(data);
  }

  async function deleteProject(id) {
    const { error } = await supabase.from("projects").delete().match({ id });
    if (error) {
      console.error("Error deleting project:", error);
    } else {
      setProjects(projects.filter((project) => project.id !== id));
    }
  }

  async function addProject() {
    if (projectName.trim() !== "") {
      const { data, error } = await supabase
        .from("projects")
        .insert([{ project_name: projectName }]);
      if (error) {
        console.error("Error adding project:", error);
      } else {
        setProjects([...projects, data[0]]);
        setProjectName("");
      }
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
              <ListItemButton key={project.id}>
                ID: {project.id} <br />
                Name: {project.project_name}
                <Link to={`/projects/${project.id}`}>Details</Link>
                <Link to={`/projects/edit/${project.id}`}>Edit</Link>
                <Button onClick={() => deleteProject(project.id)}>Delete</Button>
              </ListItemButton>
            ))}
          </List>
        </Stack>
      </Grid>

      <form onSubmit={addProject}>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Enter project name"
        />
        <button type="submit">Add Project</button>
      </form>
    </div>
  );
};

export default ProjectsList;