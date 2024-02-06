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

const ProjectDetails = () => {
  const [project, setProject] = useState([]);

  useEffect(() => {
    getProject();
  }, []);

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

            <div>Client Number: {4}</div>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default ProjectDetails;
