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
} from "@mui/joy";
import Checkbox, { checkboxClasses } from "@mui/joy/Checkbox";
import Dropdown from "@mui/joy/Dropdown";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import Menu from "@mui/joy/Menu";
import { useEffect, useState } from "react";
import { supabaseClient } from "../../supabase-client"; // Import the supabase client
// ICONS:
import Add from "@mui/icons-material/Add";

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
        <Divider sx={{ my: 2 }} />
        <h1>Projects</h1>
        <List
          orientation="vertical"
          variant="outlined"
          sx={{
            flexGrow: 0,
            mx: "auto",
            "--ListItemDecorator-size": "48px",
            "--ListItem-paddingY": "1rem",
            borderRadius: "sm",
          }}
        >
            {projects.slice(0, 5).map((project) => (
                <ListItem key={project.id} sx={{ py: 2 }}>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Typography variant="h6">{project.project_name}</Typography>
                        <Stack direction="row" spacing={2}></Stack>
                    </Stack>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Typography variant="body2">{project.clients.first_name}</Typography>
                    </Stack>

                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Typography variant="body2">{project.status.name}</Typography>
                    </Stack>

                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Typography variant="body2">{project.category.name}</Typography>
                    </Stack>

                </ListItem>

            ))}
        </List>

        <Divider sx={{ my: 2 }} />

        <Divider sx={{ my: 2 }} />

        <List></List>
      </Sheet>
    </React.Fragment>
  );
}
