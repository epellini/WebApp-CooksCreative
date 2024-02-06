import React, { useState, useEffect } from "react";
import List from '@mui/joy/List';
import ListItemButton from '@mui/joy/ListItemButton';
import Grid from '@mui/joy/Grid';
import Stack from '@mui/joy/Stack';
import Button from '@mui/joy/Button';
import { Link } from "react-router-dom";

const EditProject = () => {
  const [project, setProject] = useState([]);

  useEffect(() => {
    getProject();
  }, []);

  // Get specific project using id from the url
  async function getProject() {
    const id = window.location.pathname.split("/")[3];
    const { data } = await supabase.from("projects").select("*").eq("project_id", id);
    setProject(data);
  }

  // Edit project
  async function editProject(e) {
    e.preventDefault();
    const id = window.location.pathname.split("/")[3];
    const { data, error } = await supabase
      .from("projects")
      .update({ project_name: project })
      .eq("id", id);
    if (error) {
      console.error("Error updating project:", error);
    } else {
      console.log("Project updated successfully");
    }
  }

  return (
    <h1>Edit Project</h1>
  )
}

export default EditProject;
