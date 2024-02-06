import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import Grid from "@mui/joy/Grid";
import Stack from "@mui/joy/Stack";
import Button from "@mui/joy/Button";

const ProjectDetails = () => {
  const [project, setProject] = useState(null); // Use singular since we're dealing with a single project
  const { id } = useParams(); // Use useParams to get the project ID from the URL

  useEffect(() => {
    const fetchProject = async () => {
      const docRef = doc(db, "projects", id); // Create a reference to the specific project document
      const docSnap = await getDoc(docRef); // Fetch the document
      if (docSnap.exists()) {
        setProject({ ...docSnap.data(), id: docSnap.id }); // If the document exists, set the project state
      } else {
        console.log("No such document!");
      }
    };

    fetchProject();
  }, [id]); // Dependency array includes id to re-fetch if the id changes

  if (!project) {
    return <div>Loading...</div>; // Display a loading message or spinner while fetching
  }

  return (
    <div>
      <h1>Project Details</h1>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Stack spacing={2}> {/* Adjusted for visual structure */}
          <div>ID: {project.id}</div>
          <div>Name: {project.name}</div>
          <div>Description: {project.description}</div>
          {/* Removed the loop and links not relevant to a detail view */}
          <Button onClick={() => {/* Place delete function here */}}>Delete</Button>
        </Stack>
      </Grid>
    </div>
  );
};

export default ProjectDetails;
