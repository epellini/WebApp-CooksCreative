import React, { useState } from "react";
import { useEffect } from "react";
import List from '@mui/joy/List';
import ListItemButton from '@mui/joy/ListItemButton';
import Grid from '@mui/joy/Grid';
import Stack from '@mui/joy/Stack';
import Button from '@mui/joy/Button';
import { Link } from "react-router-dom";
import { db } from "../../firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc} from "firebase/firestore";
import { Textarea } from "@mui/joy";
import { Input } from "@mui/joy";

const ProjectsList = () => {
  const [newName, setNewName] = useState(""); // This state will hold the new project name
  const [newDescription, setNewDescription] = useState(""); // This state will hold the new project description
  const [projects, setProjects] = useState([]); // This array will hold all the projects
  const projectCollectionRef = collection(db, "projects"); // Reference to the projects collection in Firestore database

  // TODO: These functions will need to be moved to a separate file to keep the code clean and organized

  // Function to CREATE project
  const createProject = async () => {
    const docRef = await addDoc(projectCollectionRef, { name: newName, description: newDescription });
      // Create a new project object using the data just added and the ID returned by addDoc
    const newProject = { id: docRef.id, name: newName, description: newDescription };
     // Update the projects state to include the new project
    setProjects((prevProjects) => [...prevProjects, newProject]);
    setNewName(" "); // Clear the input field
    setNewDescription(" "); // Clear the input field
   }; 

  // Function to DELETE project
  const deleteProject = async (id) => {
    const projectDoc = doc(db, "projects", id);
    await deleteDoc(projectDoc);
    // Update the projects state to remove the project
    setProjects(projects.filter((project) => project.id !== id));
  };


  // GET ALL projects when the page loads
  useEffect(() => {

    const getProjects = async () => {
      const data = await getDocs(projectCollectionRef); // getDocs is an async function that returns a promise with all the documents in the collection
      setProjects(data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))); // Set the projects array with the data from the documents
    }

   getProjects();
  }, []);

  return (
    <div>
      <h1>Project List</h1>
      <Input placeholder="Name" 
      value={newName}
      onChange={(event) => {
        setNewName(event.target.value);
      } } />
      
      <Textarea placeholder="Description" minRows={2} 
      value={newDescription}
      onChange={(event) => {
        setNewDescription(event.target.value);
      } }/>
      <Button onClick={createProject}>Create Project</Button>
      
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center" 
      >
        <Stack>
          <List>
            {projects.map((project) => {
              return (
                <ListItemButton key={project.id}>
                  ID: {project.id} <br />
                  Name: {project.name} <br />
                  <Link to={`/projects/${project.id}`}>Details</Link>
                  <Link to={`/projects/edit/${project.id}`}>Edit</Link>
                  <Button onClick={() => deleteProject(project.id)}>Delete</Button>
                </ListItemButton>
              );
            } )}
          </List>
        </Stack>
      </Grid>
    </div>
  );
};

export default ProjectsList;