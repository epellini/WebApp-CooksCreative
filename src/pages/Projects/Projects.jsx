import React, { useState } from "react";
import { useEffect } from "react";
import List from '@mui/joy/List';
import ListItemButton from '@mui/joy/ListItemButton';
import Grid from '@mui/joy/Grid';
import Stack from '@mui/joy/Stack';
import Button from '@mui/joy/Button';
import { Link } from "react-router-dom";
import { db } from "../../firebase";
import { collection, getDocs} from "firebase/firestore";

const ProjectsList = () => {
  const [projects, setProjects] = useState([]); // This array will hold all the projects
  const projectCollectionRef = collection(db, "projects"); // Reference to the projects collection in Firestore database

  // Get all projects when the page loads
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