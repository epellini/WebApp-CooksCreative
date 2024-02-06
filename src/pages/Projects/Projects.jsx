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
  const [projectName, setProjectName] = useState("");
  const [client_id, setClient_id] = useState("");
  const [project_description, setProject_description] = useState("");
  const [start_date, setStart_date] = useState("");
  const [end_date, setEnd_date] = useState("");
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    getProjects();
  }, []);

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

          return { ...project, client: clientData }; // create a client variable that includes all of the client data
        })
      );
      setProjects(projectsWithClients);
    }
  }

  // This function will delete a project from the database
  async function deleteProject(project_id) {
    const { error } = await supabase.from("projects").delete().match({ project_id });
    if (error) {
      console.error("Error deleting project:", error);
    } else {
      console.log("Project deleted successfully");
      setProjects(projects.filter((project) => project.project_id !== project_id));
    }
  }

  async function addProject(e) {
    e.preventDefault();
    if (projectName.trim() !== "") {
      const { data, error } = await supabase
        .from("projects")
        .insert([{ 
          project_name: projectName, 
          client_id: client_id,
          project_description: project_description,
          start_date: start_date,
          end_date: end_date,
          complete: complete
        }]);
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
                <Link to={`/projects/${project.project_id}`}>Details</Link> <br />
                <Link to={`/projects/edit/${project.project_id}`}>Edit</Link> <br />
                <Button onClick={() => deleteProject(project.project_id)}>Delete</Button>
              </ListItemButton>
            ))}
          </List>
        </Stack>
      </Grid>
      <form onSubmit={addProject}>
        <input id="projectname" type="text" value={projectName} placeholder="Enter project name"
          onChange={(e) => setProjectName(e.target.value)}
        />
        <br />
        <input id="clientid" type="number" value={client_id} placeholder="Enter client id"
          onChange={(e) => setClient_id(e.target.value)}
        />
        <br />
        <input id="projectdescription" type="text" value={project_description} placeholder="Enter project description"
          onChange={(e) => setProject_description(e.target.value)}
        />
        <br />
        <input type="date" value={start_date} 
          onChange={(e) => setStart_date(e.target.value)}
        />
        <br />
        <input type="date" value={end_date} 
          onChange={(e) => setEnd_date(e.target.value)}
        />
        <br />
        <label>
          <input type="checkbox" checked={complete} 
            onChange={(e) => setComplete(e.target.checked)}
          />
          Complete
        </label>
        <br />
        <button type="submit">Add Project</button>
      </form>
    </div>
  );
};

export default ProjectsList;
