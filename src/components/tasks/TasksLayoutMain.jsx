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
  MenuItem,
  Sheet,
  Chip,
} from "@mui/joy";
import { useEffect, useState } from "react";
import { supabaseClient } from "../../supabase-client"; // Import the supabase client
// ICONS:
import Add from "@mui/icons-material/Add";

//task form
import TaskForm from "./TaskForm";

export default function TasksLayoutMain() {
  const [open, setOpen] = React.useState(false);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const options = ["The Godfather", "Pulp Fiction"];

  async function getTasks() {
    const { data, error } = await supabaseClient.from("tasks").select(`
  *,
  projects(*)
`);

    if (error) {
      console.error("Error fetching tasks:", error);
    } else {
      setTasks(data);
      setProjects(data.map((task) => task.projects)); //get the projects for the specified task
    }
  }
  useEffect(() => {
    getTasks();
  }, []);

  const onHandleSubmit = () => {
    setOpen(false);
    //reload the tasks
    getTasks();
  };

  return (
    <React.Fragment>
      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: {
            xs: "none",
            sm: "none",
            md: "initial",
            lg: "initial",
            xl: "initial",
          },
          width: "100%", // if you want to make the table full width <----- HERE
          borderRadius: "sm",
          flexShrink: 1,
          overflow: "auto",
          minHeight: 0,
        }}
      ></Sheet>
      <Box sx={{ flex: 1, width: "100%" }}>
        <Stack
          spacing={4}
          sx={{
            display: "flex",
            maxWidth: "800px",
            mx: "auto",
            px: { xs: 2, md: 6 },
            py: { xs: 2, md: 3 },
          }}
        >
          <Card>
            <Box sx={{ mb: 1 }}>
              <Typography level="title-md">All Tasks</Typography>
              <Typography level="body-sm"></Typography>
            </Box>
            <Divider />

            <Stack
              direction="row"
              spacing={3}
              sx={{ display: { xs: "none", md: "flex" }, my: 1 }}
            >
              {Object.values(tasks).map((task) => (
                <Stack
                  key={task.task_id}
                  direction="row"
                  spacing={2}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    p: 2,
                    borderRadius: "sm",
                    bgcolor: "background.body",
                    boxShadow: "sm",
                  }}
                >
                  <Stack spacing={1} sx={{ flexGrow: 1 }}>
                    {task.projects ? (
                      <Typography level="body-sm">
                        Project Name: {task.projects.project_name}
                      </Typography>
                    ) : (
                      <Typography level="body-sm">Project Name: No Project</Typography>
                    )}
                    <Typography level="body-sm">Task Name: {task.task_name}</Typography>
                    <Typography level="body-md">Task ID: {task.task_id}</Typography>
                    <Typography level="body-sm">Task Status: {task.is_completed ? "Yes" : "No"}</Typography>

                  </Stack>
                  <Stack spacing={2} sx={{ flexGrow: 1 }}>
                    <Stack spacing={1}></Stack>
                  </Stack>
                </Stack>
              ))}
            </Stack>

            <React.Fragment>
              <Button
                variant="outlined"
                color="neutral"
                startDecorator={<Add />}
                onClick={() => setOpen(true)}
              >
                New Task
              </Button>
              <Modal
                className="formWindow"
                open={open}
                onClose={() => setOpen(false)}
              >
                <ModalDialog>
                  <TaskForm
                    open={open}
                    setOpen={setOpen}
                    onHandleSubmit={onHandleSubmit}
                  />
                </ModalDialog>
              </Modal>
            </React.Fragment>
            <CardOverflow
              sx={{ borderTop: "1px solid", borderColor: "divider" }}
            >
              <CardActions sx={{ alignSelf: "flex-end", pt: 2 }}>
                <Button size="sm" variant="outlined" color="neutral">
                  Cancel
                </Button>
                <Button size="sm" variant="solid">
                  Save
                </Button>
              </CardActions>
            </CardOverflow>
          </Card>
        </Stack>
      </Box>
    </React.Fragment>
  );
}
