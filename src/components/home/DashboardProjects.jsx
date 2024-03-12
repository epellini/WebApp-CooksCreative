import * as React from "react";
import {
  Autocomplete,
  Box,
  Button,
  AspectRatio,
  Divider,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  IconButton,
  Textarea,
  Stack,
  Select,
  Option,
  Typography,
  Tabs,
  TabList,
  List,
  ListItem,
  Breadcrumbs,
  Link,
  Card,
  CardActions,
  CardOverflow,
  Modal,
  ModalDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Sheet,
  Chip,
  TabPanel,
  Tab,
  tabClasses,
  ListDivider,
  Table
} from "@mui/joy";
import { useEffect, useState } from "react";
import { supabaseClient } from "../../supabase-client"; // Import the supabase client


//task form

export default function DashboardProjects() {
  const [projects, setProjects] = useState([]); // State to hold the projects
  const [clients, setClients] = useState([]); // State to hold the clients
  const [status, setStatus] = useState([]); // State to hold the status
  const [category, setCategory] = useState([]); // State to hold the category

  async function GetProjects() {
    const { data, error } = await supabaseClient.from("projects").select(`
    *,
    clients(*),
    status(*),
    category(*)
  `); // Get all the projects from the database
    if (error) {
      console.error(error);
      return;
    } else {
      setProjects(data); // Set the projects to the state
      setClients(data.map((project) => project.clients));
      setStatus(data.map((project) => project.status));
      setCategory(data.map((project) => project.category));
    }
  }

  useEffect(() => {
    GetProjects();
  }, []);

  return (
    <React.Fragment>
      <Sheet
        className="dashboard-projects"
        variant="outlined"
        sx={{
          display: {
            maxWidth: "1600px",
            mx: "auto",
            borderRadius: "sm",
            px: { xs: 2, md: 6 },
            py: { xs: 2, md: 3 },
          },
          width: "100%", // if you want to make the table full width <----- HERE
          borderRadius: "sm",
          flexShrink: 1,
          overflow: "auto",
          minHeight: 0,
        }}
      >
        <h1>Projects</h1>
        <Table sx={{'& tr > *:not(:first-child)': { textAlign: 'left' } }}>
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Client Name</th>
              <th>Status</th>
              <th>Category</th>
              <th>Start Date</th>
            </tr>
          </thead>

          <tbody>
            {projects.sort((a,b) => new Date(b.start_date) - new Date(a.start_date)).slice(0, 5).map((project) => (
              <tr>
                <td>{project.project_name}</td>
                <td>{project.clients.first_name}</td>
                <td>{project.status.name}</td>
                <td>{project.category.name}</td>
                <td>{project.start_date}</td>
              </tr>
            ))}
          </tbody>

        </Table>
      </Sheet>
    </React.Fragment>
  );
}
