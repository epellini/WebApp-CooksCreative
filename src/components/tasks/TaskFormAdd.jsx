import React, { useState, useEffect } from "react";

import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import IconButton from "@mui/joy/IconButton";
import Textarea from "@mui/joy/Textarea";
import Stack from "@mui/joy/Stack";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Typography from "@mui/joy/Typography";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import Card from "@mui/joy/Card";
import CardActions from "@mui/joy/CardActions";
import CardOverflow from "@mui/joy/CardOverflow";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

import Autocomplete from "@mui/joy/Autocomplete";

import DropZone from "../DropZone";
import FileUpload from "../FileUpload";

//Thomas added imports
import { useNavigate, useParams } from "react-router-dom";
import { supabaseClient } from "../../supabase-client";

const TaskFormAdd = ({open, setOpen, onHandleSubmit}) => {
  const [task, setTask] = useState({
    task_name: "",
    project_id: null,
    completion_notes: "",
    is_completed: false,
    completed_by: "",
  });
  const [loading, setLoading] = useState(true);
  const { taskid } = useParams();

  const navigate = useNavigate();
  const supabase = supabaseClient;
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);   
const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const { data: taskData, error: tasksError } = await supabase
          .from("tasks")
          .select("*")
          .eq("task_id", taskid || "")
          .single();

        const { data: projectsData, error: projectsError } = await supabase
          .from("projects")
          .select("*")
          .order("project_id", { ascending: true });

          const { data: usersData, error: usersError } = await supabase
            .from("users")
            .select("*")
            .order("user_id", { ascending: true });


        if (tasksError) {
          console.error("Error fetching tasks:", tasksError);
        } else {
          setTasks(taskData || {});
        }

        if (projectsError) {
          console.error("Error fetching projects:", projectsError);
        } else {
          setProjects(projectsData || []);
        }
        if (usersError) {
            console.error("Error fetching users:", usersError);
            }
            else {
            setUsers(usersData || []);
            }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [taskid]);
  const handleChange = (e, value, name) => {
    // Check if e is null or undefined
    console.log("value", value);
    console.log("e", e);
    console.log("name", name);

    if (!e) {
      return;
    }
    // Check if value is null or undefined before updating the state
    if (value !== null && value !== undefined) {
      // Handle select change
      setTask((prevState) => ({
        ...prevState,
        [name]: value, // Use the name parameter to dynamically set the state key
      }));
    } else if (e.target) {
      // Handle input change
      const { name, value } = e.target;
      setTask((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("task", task.task_name);
    if (task.task_name.trim() !== "") {
      try {
        let result = null;
        if (taskid) {
          result = await supabase
            .from("tasks")
            .update(task)
            .eq("task_id", taskid);
        } else {
          const { data, error } = await supabase
            .from("tasks")
            .insert([task]);
          result = { data, error };
        }
        if (result.error) {
          console.error("Error adding task:", result.error);
        } else {
            // navigate("/tasks");
            onHandleSubmit();
          console.log("Task added successfully");
        }
      } catch (error) {
        console.error("Error adding task:", error);
      }

    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ flex: 1, width: "100%" }}>
        <Box
          sx={{
            position: "sticky",
            top: { sm: -100, md: -110 },
            bgcolor: "background.body",
            zIndex: 9995,
          }}
        >
          <Box sx={{ px: { xs: 2, md: 6 } }}>
            <Typography level="h2" component="h1" sx={{ mt: 1, mb: 2 }}>
              {taskid ? "Update Task" : "Add Task"}
            </Typography>
          </Box>
        </Box>
        <Stack
          spacing={4}
          sx={{
            display: "flex",
            maxWidth: "900px",
            mx: "auto",
            px: { xs: 2, md: 6 },
            py: { xs: 2, md: 3 },
          }}
        >
          <Card>
            <Box sx={{ mb: 1 }}>
              <Typography level="title-md">Task Information</Typography>
              <Typography level="body-sm">
                Add a title, description, and other details to your Task.
              </Typography>
            </Box>
            <Divider />
            <Stack
              direction="row"
              spacing={3}
              sx={{ display: { xs: "none", md: "flex" }, my: 1 }}
            >
              <Stack direction="column" spacing={1}></Stack>
              <Stack spacing={2} sx={{ flexGrow: 2 }}>
                <Stack direction="row" spacing={2}>
                  <FormControl sx={{ flexGrow: 1 }}>
                    <FormLabel>Task Name</FormLabel>
                    <Input
                      size="sm"
                      type="text"
                      id="task_name"
                      name="task_name"
                      value={task.task_name}
                      onChange={handleChange} // Pass the event object directly
                      required
                    />
                  </FormControl>
                </Stack>
                <FormControl sx={{ flexGrow: 1 }}>
                    <FormLabel>Project Name</FormLabel>
                    <Autocomplete
                      id="project_id"
                      name="project_id"
                      options={projects}
                      getOptionLabel={(option) =>
                        option.project_name +
                        " " +
                        "(ID: " +
                        option.project_id +
                        ")"
                      }
                      value={
                        projects.find(
                          (project) => project.project_id === task.project_id
                        ) || null
                      }
                      onChange={(e, value) =>
                        handleChange(
                          e,
                          value ? value.project_id : null,
                          "project_id"
                        )
                      }
                      renderInput={(params) => (
                        <Input
                          {...params}
                          size="sm"
                          id="project_id"
                          name="project_id"
                          required
                        />
                      )}
                    />
                  </FormControl>
                  <FormControl sx={{ flexGrow: 1 }}>
                    <FormLabel>Completed</FormLabel>
                    <Select
                        placeholder="Select Status"
                        id="is_completed"
                        name="is_completed" // Add the name attribute
                        value={task.is_completed}
                        onChange={(e, value) =>
                          handleChange(e, value, "is_completed")
                        } // Pass the name along with the value
                        required
                        >
                        <Option value={true}>Yes</Option>
                        <Option value={false}>No</Option>
                    </Select>
                    </FormControl>
                    
                    

                <Stack spacing={1}>
                  {/* <Box>
                    <FormLabel htmlFor="time_stamp">Start Date</FormLabel>
                    <Input
                      id="time_stamp"
                      name="time_stamp"
                      type="date"
                      value={task.time_stamp}
                      onChange={handleChange}
                      required
                    />
                  </Box> */}

                  {/* <FormLabel>Task Notes</FormLabel>
                  <FormControl
                    sx={{
                      display: { sm: "flex-column", md: "flex-row" },
                      gap: 2,
                    }}
                  >
                    <Textarea
                      size="sm"
                      minRows={4}
                      sx={{ flexGrow: 1 }}
                      id="completion_notes"
                      name="completion_notes"
                      value={task.completion_notes}
                      onChange={handleChange}
                      required
                    />
                  </FormControl> */}
                </Stack>

                {/* <Stack direction="row" spacing={2}>
                  <FormControl sx={{ flexGrow: 1 }}>
                    <FormLabel>User</FormLabel>
                    <Select
                      placeholder="Select User"
                      id="status_id"
                      name="status_id" // Add the name attribute
                      value={project.status_id}
                      onChange={(e, value) =>
                        handleChange(e, value, "status_id")
                      } // Pass the name along with the value
                      required
                    >
                      {status.map((statusOption) => (
                        <Option
                          key={statusOption.status_id}
                          value={statusOption.status_id}
                          selected={
                            statusOption.status_id === project.status_id
                          } // Set selected attribute
                        >
                          {statusOption.name}
                        </Option>
                      ))}
                    </Select>
                  </FormControl>
                </Stack> */}
              </Stack>
            </Stack>
            <Stack
              direction="column"
              spacing={2}
              sx={{ display: { xs: "flex", md: "none" }, my: 1 }}
            >
              {/* MOBILE VIEW */}
              <Stack direction="row" spacing={2}>
                <Stack spacing={1} sx={{ flexGrow: 1 }}>
                  <FormControl sx={{ flexGrow: 1 }}>
                    <FormLabel>Task Name</FormLabel>
                    <Input
                      size="sm"
                      type="text"
                      id="task_name"
                      name="task_name"
                      value={task.task_name}
                      onChange={handleChange} // Pass the event object directly
                      required
                    />
                  </FormControl>
                </Stack>
              </Stack>
              <div>
                {/* <Stack direction="row" spacing={2}>
                  <FormControl sx={{ flexGrow: 1 }}>
                    <FormLabel>User</FormLabel>
                    <Select
                      placeholder="Select User"
                      id="status_id"
                      name="status_id" // Add the name attribute
                      value={project.status_id}
                      onChange={(e, value) =>
                        handleChange(e, value, "status_id")
                      } // Pass the name along with the value
                      required
                    >
                      {status.map((statusOption) => (
                        <Option
                          key={statusOption.status_id}
                          value={statusOption.status_id}
                          selected={
                            statusOption.status_id === project.status_id
                          } // Set selected attribute
                        >
                          {statusOption.name}
                        </Option>
                      ))}
                    </Select>
                  </FormControl>
                </Stack> */}
              </div>

              {/* <FormLabel>Task Notes</FormLabel>
              <FormControl
                sx={{
                  display: { sm: "flex-column", md: "flex-row" },
                  gap: 2,
                }}
              >
                <Textarea
                  size="sm"
                  minRows={4}
                  sx={{ flexGrow: 1 }}
                  id="completion_notes"
                  name="completion_notes"
                  value={task.completion_notes}
                  onChange={handleChange}
                  required
                />
              </FormControl> */}
            </Stack>
            <CardOverflow
              sx={{ borderTop: "1px solid", borderColor: "divider" }}
            >
              <CardActions sx={{ alignSelf: "flex-end", pt: 2 }}>
                <Button
                  size="sm"
                  variant="outlined"
                  color="neutral"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button size="sm" variant="solid" type="submit">
                  {taskid ? "Update Task" : "Add Task"}
                </Button>
              </CardActions>
            </CardOverflow>
          </Card>
        </Stack>
      </Box>
    </form>
  );
};

export default TaskFormAdd;
