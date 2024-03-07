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

export default function DashboardTasks() {
  const [tasks, setTasks] = useState([]); // State to hold the projects
  const [projects, setProjects] = useState([]); // State to hold the clients

  async function GetTasks() {
    const { data, error } = await supabaseClient.from("tasks").select(`
    *,
    projects(*)

  `); // Get all the projects from the database
    if (error) {
      console.error(error);
      return;
    } else {
      setTasks(data); // Set the projects to the state
      setProjects(data.map((task) => task.projects));
    }
  }

  const completedTasks = tasks.filter((task) => {
    // Check if the task is completed and its creation date is within the last 30 days
    if (task.is_completed) {
      return true; // Keep the task in the filtered array
    }
    return false; // Exclude the task from the filtered array
  });

  useEffect(() => {
    GetTasks();
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
        <h1>Tasks</h1>
        <Table sx={{'& tr > *:not(:first-child)': { textAlign: 'left' } }}>
          <thead>
            <tr>
              <th>Task Name</th>
              <th>Project Name</th>
              <th>Date Created</th>
            </tr>
          </thead>

          <tbody>
            {tasks.slice(0, 5).map((task) => (
              <tr>
                <td>{task.task_name}</td>
                <td>{task.projects.project_name}</td>
                <td style={{ textAlign: 'left' }}>
                      {task.date_created ?
                        new Intl.DateTimeFormat('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(task.date_created))
                        : "N/A"}
                    </td>
              </tr>
            ))}
          </tbody>

        </Table>
      </Sheet>
    </React.Fragment>
  );
}
