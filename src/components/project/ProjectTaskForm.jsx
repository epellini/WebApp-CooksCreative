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
import TextField from "@mui/joy/TextField"

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



const ProjectTaskForm = ({projectid}) => {
  const [task, setTask] = useState({
    task_name: "",
    project_id: projectid,
    completion_notes: "",
    is_completed: false,
    completed_by: "",
  });
  const [loading, setLoading] = useState(true);
  const { taskid } = useParams();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();
  const supabase = supabaseClient;
  const [project, setProject] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const { data: tasksData, error: tasksError } = await supabase
          .from("tasks")
          .select("*")
          .order("task_id", {ascending: true});

        const { data: projectsData, error: projectsError } = await supabase
          .from("projects")
          .select("*")
          .eq("project_id", projectid || "")
          .single();

          const { data: usersData, error: usersError } = await supabase
            .from("users")
            .select("*")
            .order("user_id", { ascending: true });


        if (tasksError) {
          console.error("Error fetching tasks:", tasksError);
        } else {
          setTasks(tasksData || []);
        }

        if (projectsError) {
          console.error("Error fetching project:", projectsError);
        } else {
          setProject(projectsData || {});
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
  }, [projectid]);
  const handleChange = (e, value, name) => {
    if (!e) {
      return;
    }


    // Check if value is null or undefined before updating the state
    if (value !== null && value !== undefined) {
      // Handle select change
      setTask((prevState) => ({
        ...prevState,
        [name]: value,
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
          console.log("Task added successfully");
          {window.location.reload()}
          

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
                </Stack>
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
            </div>

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
}




export default ProjectTaskForm;
