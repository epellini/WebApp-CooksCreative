import React, { useState, useEffect } from "react";
import Button from "@mui/joy/Button";
import Box from "@mui/joy/Box";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import { useNavigate, useParams } from "react-router-dom";
import { supabaseClient } from "../../supabase-client";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const ProjectForm = () => {
  const [project, setProject] = useState({
    project_name: "",
    client_id: "",
    project_description: "",
    start_date: "",
    end_date: "",
    status_id: "",
    type: "",
  });
  const [status, setStatus] = useState({ name: "" });
  const { projectid } = useParams();
  const navigate = useNavigate();
  const supabase = supabaseClient;

  useEffect(() => {
    if (projectid) {
      fetchProject(projectid);
    }
  }, [projectid]);

  const fetchProject = async (projectId) => {
    try {
      const { data: projectData, error } = await supabase
        .from("projects")
        .select("*")
        .eq("project_id", projectId)
        .single();

      if (error) {
        console.error("Error fetching project:", error);
      } else {
        setProject(projectData);
        if (projectData.status_id) {
          fetchStatus(projectData.status_id);
        }
      }
    } catch (error) {
      console.error("Error fetching project:", error);
    }
  };

  const fetchStatus = async (statusId) => {
    try {
      const { data: statusData, error } = await supabase
        .from("status")
        .select("*")
        .eq("status_id", statusId)
        .single();

      if (error) {
        console.error("Error fetching status:", error);
      } else {
        setStatus(statusData);
      }
    } catch (error) {
      console.error("Error fetching status:", error);
    }
  };

  const handleChange = (e, value) => {
    // Check if value is null or undefined before updating the state
    if (value !== null && value !== undefined) {
      setProject((prevState) => ({
        ...prevState,
        status_id: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (project.project_name.trim() !== "") {
      try {
        let result = null;
        if (projectid) {
          result = await supabase
            .from("projects")
            .update(project)
            .eq("project_id", projectid);
        } else {
          const { data, error } = await supabase
            .from("projects")
            .insert([project]);
          result = { data, error };
        }
        if (result.error) {
          console.error("Error adding project:", result.error);
        } else {
          navigate("/projects");
          console.log("Project added successfully");
        }
      } catch (error) {
        console.error("Error adding project:", error);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: "500px",
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <Box>
        <FormLabel htmlFor="project_name">Project Name</FormLabel>
        <Input
          id="project_name"
          name="project_name"
          value={project.project_name}
          onChange={handleChange}
          required
        />
      </Box>
      <Box>
        <FormLabel htmlFor="client_id">Client ID</FormLabel>
        <Input
          id="client_id"
          name="client_id"
          value={project.client_id}
          onChange={handleChange}
          required
        />
      </Box>
      <Box>
        <FormLabel htmlFor="project_description">Project Description</FormLabel>
        <Input
          id="project_description"
          name="project_description"
          value={project.project_description}
          onChange={handleChange}
          required
        />
      </Box>
      <Box>
        <FormLabel htmlFor="start_date">Start Date</FormLabel>
        <Input
          id="start_date"
          name="start_date"
          type="date"
          value={project.start_date}
          onChange={handleChange}
          required
        />
      </Box>
      <Box>
        <FormLabel htmlFor="end_date">End Date</FormLabel>
        <Input
          id="end_date"
          name="end_date"
          type="date"
          value={project.end_date}
          onChange={handleChange}
          required
        />
      </Box>
      <Box>
        <FormLabel htmlFor="type">Type</FormLabel>
        <Input
          id="type"
          name="type"
          value={project.type}
          onChange={handleChange}
          required
        />
      </Box>
      <Box>
        <FormLabel htmlFor="status">Status</FormLabel>
        <Select
          placeholder="Select Status"
          id="status_id"
          name="status_id"
          value={project.status_id || ""}
          onChange={handleChange}
          required
        >
          <Option value="3">Completed</Option>
          <Option value="1">Cancelled</Option>
          <Option value="2">Active</Option>
        </Select>
      </Box>
      <Button type="submit" variant="solid" color="primary" size="lg">
        {projectid ? "Update Project" : "Add Project"}
      </Button>
    </form>
  );
};

export default ProjectForm;
