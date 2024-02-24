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
import { Skeleton } from "@mui/joy";
import { usePagination } from "../../hooks/usePagination";

import Tab, { tabClasses } from "@mui/joy/Tab";

// ICONS:
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import Add from "@mui/icons-material/Add";

export default function TasksLayoutMain() {
  const [open, setOpen] = React.useState(false);
  const [userTasks, setUserTasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const options = ["The Godfather", "Pulp Fiction"];


  // Organize data into a map where each task has a list of associated users
  const tasksWithUsers = tasks.reduce((acc, task) => {
    const usersForTask = userTasks
      .filter((userTask) => userTask.task_id === task.task_id)
      .map((userTask) => {
        const user = users.find((user) => user.user_id === userTask.user_id);
        return user ? user.first_name : ""; // Assuming you want to display only the first name
      });

      const project = 

    acc[task.task_id] = {
      ...task,
      users: usersForTask,
    };

    return acc;
  }, {});

  useEffect(() => {
    async function getTasks() {
      const { data, error } = await supabaseClient.from("users_tasks").select(`
      *,
      users(*),
      tasks(*)
      `);

      if (error) {
        console.log("Error fetching user tasks:", error);
      } else {
        setUserTasks(data);
        setTasks(data.map((task) => task.tasks));
        setUsers(data.map((user) => user.users));
        console.log("User Tasks:", data);
        console.log("Tasks:", tasks);
        console.log("Users:", users);
      }

      const { data: projectsData, error: projectsError } = await supabaseClient
        .from("projects")
        .select("*");

      if (projectsError) {
        console.log("Error fetching projects:", projectsError);
      }
      setProjects(projectsData.map((project) => project.projects));
      console.log("Projects:", projects);

    }
    getTasks();
  }, []);

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
              <Typography level="body-sm">Showing all tasks bla bla</Typography>
            </Box>
            <Divider />

            <Stack
              direction="row"
              spacing={3}
              sx={{ display: { xs: "none", md: "flex" }, my: 1 }}
            >
              {Object.values(tasksWithUsers).map((task) => (
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
                  <Stack spacing={1}>
                    <Typography level="body-sm">{task.name}</Typography>
                    <Typography level="body-md">{task.task_id}</Typography>
                    {/* Show each user assigned to this task */}
                    {task.users.map((user) => (
                      <Typography key={user} level="body-sm">
                        {user}
                      </Typography>
                    ))}
                  </Stack>
                  <Stack spacing={2} sx={{ flexGrow: 1 }}>
                    <Stack spacing={1}></Stack>
                  </Stack>
                </Stack>
              ))}
            </Stack>
            {/* <Stack
              direction="row"
              spacing={3}
              sx={{ display: { xs: "none", md: "flex" }, my: 1 }}
            > */}
            {/* {userTasks.map((userTask) => (
                <Stack
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
                  <Stack spacing={1}>
                    <Typography level="body-sm">
                      {userTask.tasks.name}
                    </Typography>
                    <Typography level="body-md">
                      {userTask.user_task_id}
                    </Typography>
                    {/* Show each of the staff that are under tasks */}
            {/* {users
                      .filter((user) => {
                        console.log("User ID:", user.user_id);
                        console.log("User Task ID:", userTask.user_task_id);
                        console.log("User:", user);

                        return user.user_id === userTask.user_id;
                      })
                      .map((user) => (
                        <Typography key={user.user_id} level="body-sm">
                          {user.first_name}
                        </Typography>
                      ))}
                  </Stack>

                  <Stack spacing={2} sx={{ flexGrow: 1 }}>
                    <Stack spacing={1}></Stack>
                  </Stack>
                </Stack>
              ))}
                      </Stack> */}

            <React.Fragment>
              <Button
                variant="outlined"
                color="neutral"
                startDecorator={<Add />}
                onClick={() => setOpen(true)}
              >
                New Task
              </Button>
              <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog>
                  <DialogTitle>New Task</DialogTitle>
                  <DialogContent sx={{ textAlign: "left" }}>
                    Fill in the form to create task
                  </DialogContent>
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      setOpen(false);
                    }}
                  >
                    <Stack direction="column" spacing={2}>
                      <FormControl sx={{ flexGrow: 1 }}>
                        <FormLabel>Task:</FormLabel>
                        <Input autoFocus required />
                      </FormControl>

                      <FormControl sx={{ flexGrow: 1 }}>
                        <FormLabel>Assign to:</FormLabel>
                        <Select
                          multiple
                          defaultValue={["dog", "cat"]}
                          renderValue={(selected) => (
                            <Box sx={{ display: "flex", gap: "0.25rem" }}>
                              {selected.map((selectedOption) => (
                                <Chip variant="soft" color="primary">
                                  {selectedOption.label}
                                </Chip>
                              ))}
                            </Box>
                          )}
                          sx={{
                            minWidth: "15rem",
                          }}
                          slotProps={{
                            listbox: {
                              sx: {
                                width: "100%",
                              },
                            },
                          }}
                        >
                          <Option value="dog">Dog</Option>
                          <Option value="cat">Cat</Option>
                          <Option value="fish">Fish</Option>
                          <Option value="bird">Bird</Option>
                        </Select>
                      </FormControl>

                      <FormControl sx={{ flex: 1 }} size="sm">
                        <FormLabel>Project:</FormLabel>
                        <Autocomplete
                          placeholder="Combo box"
                          options={options}
                          sx={{ width: 300 }}
                        />
                      </FormControl>

                      <Button type="submit">Create</Button>
                    </Stack>
                  </form>
                </ModalDialog>
              </Modal>
            </React.Fragment>

            {/* Mobile View */}
            {/* <Stack
            direction="column"
            spacing={2}
            sx={{ display: { xs: "flex", md: "none" }, my: 1 }}
          >
            <Stack direction="row" spacing={2}>
              <Stack direction="column" spacing={1}>
                <AspectRatio
                  ratio="1"
                  maxHeight={108}
                  sx={{ flex: 1, minWidth: 108, borderRadius: "100%" }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
                    srcSet="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286&dpr=2 2x"
                    loading="lazy"
                    alt=""
                  />
                </AspectRatio>
                <IconButton
                  aria-label="upload new picture"
                  size="sm"
                  variant="outlined"
                  color="neutral"
                  sx={{
                    bgcolor: "background.body",
                    position: "absolute",
                    zIndex: 2,
                    borderRadius: "50%",
                    left: 85,
                    top: 180,
                    boxShadow: "sm",
                  }}
                >
                  <EditRoundedIcon />
                </IconButton>
              </Stack>
              <Stack spacing={1} sx={{ flexGrow: 1 }}>
                <FormLabel>Name</FormLabel>
                <FormControl
                  sx={{
                    display: {
                      sm: "flex-column",
                      md: "flex-row",
                    },
                    gap: 2,
                  }}
                >
                  <Input size="sm" placeholder="First name" />
                  <Input size="sm" placeholder="Last name" />
                </FormControl>
              </Stack>
            </Stack>
            <FormControl>
              <FormLabel>Role</FormLabel>
              <Input size="sm" defaultValue="UI Developer" />
            </FormControl>
          </Stack> */}
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
