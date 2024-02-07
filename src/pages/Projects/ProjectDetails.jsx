import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import List from '@mui/joy/List';
import ListItemButton from '@mui/joy/ListItemButton';
import Grid from '@mui/joy/Grid';
import Stack from '@mui/joy/Stack';
import Button from '@mui/joy/Button';
import { useNavigate, Link } from "react-router-dom";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ProjectDetails = () => {
  const [project, setProject] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
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

  // Get specific project using id from the url
  async function getProject() {
    const id = window.location.pathname.split("/")[2];
    const { data } = await supabase.from("projects").select("*").eq("project_id", id);
    setProject(data);
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

            <Button  onClick={() => deleteProject(project.project_id)} component={Link} to="/projects" >Delete</Button>

          </div>
        ))}
      </ul>
    </div>
  );
}

export default ProjectDetails;
