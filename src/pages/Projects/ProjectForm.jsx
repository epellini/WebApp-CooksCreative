import React, { useState, useEffect } from "react";
import Button from '@mui/joy/Button';
import Box from '@mui/joy/Box'
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import { useNavigate, useParams } from 'react-router-dom';
import { supabaseClient } from '../../supabase-client';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;



const ProjectForm = () => {
  // State to hold client form data, initialized with empty strings for form fields
  const [project, setProject] = useState({ project_name: '', client_id: '', project_description:'', start_date: '', end_date: '', complete: false, type: '' });
  const { projectid } = useParams(); // Used for edit mode

// Hook to programmatically navigate users
const navigate = useNavigate();

const supabase = supabaseClient;

useEffect(() => {
  if (projectid) {
    const fetchProject = async () => {
      let { data, error } = await supabase
        .from('projects')
        .select("*")
        .eq('project_id', projectid) 
        .single();

      if (error) {
        console.error('Error fetching project:', error);
      } else {
        setProject({
          project_name: data.project_name,
          client_id: data.client_id,
          project_description: data.project_description,
          start_date: data.start_date,
          end_date: data.end_date,
          complete: data.complete,
          type: data.type 
        });
      }
    };

    fetchProject();
  }
}, []);

// Updates the client state with form field values on change, my version includes a true/false for the checkbox
const handleChange = (e) => {
  const { name, value, type, checked } = e.target;
  const inputValue = type === 'checkbox' ? checked : value;
  setProject((prevState) => ({
    ...prevState,
    [name]: inputValue,
  }));
}

const handleSubmit = async (e) => {
  e.preventDefault();
  if (project.project_name.trim() !== "") {
    let result = null;

    if (projectid) {
      // Updating an existing project
      result = await supabase
        .from("projects")
        .update(project) // Update the existing project directly
        .eq("project_id", projectid);
    } else {
      // Adding a new project
      const { data, error } = await supabase
        .from("projects")
        .insert([project]); // Pass the project object instead of data
      result = { data, error };
    }

    if (result.error) {
      console.error("Error adding project:", result.error); // Use result.error instead of error
    } else {
      navigate("/projects");
      console.log("Project added successfully");
    }
  }
}
  

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
      <FormLabel htmlFor="complete">Complete</FormLabel>
      <Input
        id="complete"
        name="complete"
        type="checkbox"
        checked={project.complete}
        onChange={handleChange}
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
  <Button type="submit" variant="solid" color="primary" size="lg"> {projectid ? 'Update Project' : 'Add Project'}</Button>
</form>
  );
}

export default ProjectForm;
