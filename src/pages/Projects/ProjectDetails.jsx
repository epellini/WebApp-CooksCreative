import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import List from '@mui/joy/List';
import ListItemButton from '@mui/joy/ListItemButton';
import Grid from '@mui/joy/Grid';
import Stack from '@mui/joy/Stack';
import Button from '@mui/joy/Button';
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";

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

          return { ...project, client: clientData }; // create a client variable that includes all of the client data
        })
      );
      setProjects(projectsWithClients);
    }
  }

  return (
    <div>
      <h1>Project Details</h1>
      <ul>
        {project.map((project) => (
          <div key={project.project_id}>
            <div>Project ID: {project.project_id}</div>

            <div>Project Name: {project.project_name}</div>

            <div>Client Number: {project.client_id}</div>

            <Button onClick={() => deleteProject(project.project_id)} href="/projects">Delete</Button>

          </div>
        ))}
      </ul>
    </div>
  );
}

export default ProjectsList;
