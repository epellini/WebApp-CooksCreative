import React, { useState } from "react";
import { useEffect } from "react";
import List from '@mui/joy/List';
import ListItemButton from '@mui/joy/ListItemButton';
import Grid from '@mui/joy/Grid';
import Stack from '@mui/joy/Stack';
import Button from '@mui/joy/Button';
import { Link } from "react-router-dom";
import { Textarea } from "@mui/joy";
import { Input } from "@mui/joy";

const ProjectsList = () => {
  const [newName, setNewName] = useState(""); // This state will hold the new project name
  const [newDescription, setNewDescription] = useState(""); // This state will hold the new project description

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

          </List>
        </Stack>
      </Grid>
    </div>
  );
};

export default ProjectsList;