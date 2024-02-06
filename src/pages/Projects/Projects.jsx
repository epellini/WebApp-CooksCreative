import React, { useState } from "react";
import { useEffect } from "react";
import List from '@mui/joy/List';
import ListItemButton from '@mui/joy/ListItemButton';
import Grid from '@mui/joy/Grid';
import Stack from '@mui/joy/Stack';
import Button from '@mui/joy/Button';
import { Link } from "react-router-dom";
import { Textarea } from "@mui/joy";
import { Input } from "@mui/joy";

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

  //this function will delete a project from the database
  async function deleteProject(id) {
    const { error } = await supabase.from("projects").delete().match({ id });
    if (error) {
      console.error("Error deleting project:", error);
    } else {
      setProjects(projects.filter((project) => project.project_id !== id));
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
  const [newName, setNewName] = useState(""); // This state will hold the new project name
  const [newDescription, setNewDescription] = useState(""); // This state will hold the new project description

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
                Client: {project.client_id}
                <Link to={`/projects/${project.project_id}`}>Details</Link>
                <Link to={`/projects/edit/${project.project_id}`}>Edit</Link>
                <Button onClick={() => deleteProject(project.project_id)}>Delete</Button>
              </ListItemButton>
            ))}
          </List>
        </Stack>
      </Grid>
    </div>
  );
};

export default ProjectsList;