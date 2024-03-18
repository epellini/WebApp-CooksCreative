import React, { useState, useEffect } from "react";

import AspectRatio from "@mui/joy/AspectRatio";
import confetti from "https://esm.run/canvas-confetti@1";
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

const TaskForm = ({ open, setOpen, onHandleSubmit }) => {
  const [subtasks, setSubtasks] = useState([{ id: Date.now(), name: "" }]);

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
  const [priority, setPriority] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const { data: taskData, error: tasksError } = await supabase
          .from("tasks")
          .select("*")
          .eq("task_id", taskid || "")
          .single();

        console.log("taskData", taskData);

        const { data: projectsData, error: projectsError } = await supabase
          .from("projects")
          .select("*")
          .order("project_id", { ascending: true });

        const { data: usersData, error: usersError } = await supabase
          .from("users")
          .select("*")
          .order("user_id", { ascending: true });

        const { data: priorityData, error: priorityError } = await supabase
          .from("priority")
          .select("*")
          .order("priority_id", { ascending: true });

        if (tasksError) {
          console.error("Error fetching tasks:", tasksError);
        } else {
          setTask(taskData || {});
        }

        if (projectsError) {
          console.error("Error fetching projects:", projectsError);
        } else {
          setProjects(projectsData || []);
        }
        if (usersError) {
          console.error("Error fetching users:", usersError);
        } else {
          setUsers(usersData || []);
        }
        if (priorityError) {
          console.error("Error fetching priority:", priorityError);
        } else {
          setPriority(priorityData || []);
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
    console.log("task", task);

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
          task.is_completed = true;
          playConfetti();
          result = await supabase
            .from("tasks")
            .update(task)
            .eq("task_id", taskid);

          navigate("/tasks");
          return;
        } else {
          // Set is_completed value from the state
          const isCompletedValue = task.is_completed; // Get the value from the state
          const newTask = { ...task, is_completed: isCompletedValue }; // Update the task object with the is_completed value
          const { data, error } = await supabase
            .from("tasks")
            .insert([newTask]); // Insert the updated task object
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

  function playConfetti() {
    confetti({
      particleCount: 200,
      spread: 180,
    });
  }

  const handleSubtaskChange = (id, newName) => {
    setSubtasks((currentSubtasks) =>
      currentSubtasks.map((subtask) =>
        subtask.id === id ? { ...subtask, name: newName } : subtask
      )
    );
  };

  const addSubtask = () => {
    setSubtasks((currentSubtasks) => [
      ...currentSubtasks,
      { id: Date.now(), name: "" },
    ]);
  };

  const removeSubtask = (id) => {
    setSubtasks((currentSubtasks) =>
      currentSubtasks.filter((subtask) => subtask.id !== id)
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ flex: 1, width: "100%" }}>
        <Box
          sx={{
            position: "sticky",
            top: { sm: -100, md: -110 },
            zIndex: 9995,
          }}
        >
          <Box sx={{ px: { xs: 2, md: 6 } }}>
            <Typography level="h3" component="h3" sx={{ mt: 2, mb: 0 }}>
              {taskid ? "Complete Task" : "New Task"}
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
            <Stack
              direction="row"
              spacing={3}
              sx={{ display: { xs: "none", md: "flex" }, my: 0 }}
            >
              <Stack direction="column" spacing={1}></Stack>
              <Stack spacing={2} sx={{ flexGrow: 1 }}>
                <Stack direction="row" spacing={1}>
                  <FormControl sx={{ flexGrow: 1 }}>
                    <FormLabel>Task Name</FormLabel>
                    <Input
                      disabled={taskid ? true : false} // Set directly to true or false based on the condition
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
                    disabled={taskid ? true : false}
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

                {!taskid && (
                  <Stack spacing={1}>
                    <FormControl sx={{ flexGrow: 1 }}>
                      <FormLabel>Task Priority</FormLabel>
                      <Autocomplete
                        id="task_priority"
                        name="task_priority"
                        options={priority}
                        getOptionLabel={(option) => option.name + " "}
                        value={
                          priority.find(
                            (priority) =>
                              priority.priority_id === task.task_priority
                          ) || null
                        }
                        onChange={(e, value) =>
                          handleChange(
                            e,
                            value ? value.priority_id : null,
                            "task_priority"
                          )
                        }
                        renderInput={(params) => (
                          <Input
                            {...params}
                            size="sm"
                            id="task_priority"
                            name="task_priority"
                            required
                          />
                        )}
                      />
                    </FormControl>
                  </Stack>
                )}
                {!taskid && (
                  <Stack spacing={1}>
                    <FormControl sx={{ flexGrow: 1 }}>
                      {subtasks.map((subtask, index) => (
                        <Stack
                          key={subtask.id}
                          direction="row"
                          spacing={1}
                          alignItems="center"
                        >
                          <Input
                            size="sm"
                            type="text"
                            placeholder={`Subtask #${index + 1}`}
                            value={subtask.name}
                            onChange={(e) =>
                              handleSubtaskChange(subtask.id, e.target.value)
                            }
                          />
                          <IconButton
                            size="sm"
                            onClick={() => removeSubtask(subtask.id)}
                          >
                            <EditRoundedIcon />
                          </IconButton>
                        </Stack>
                      ))}
                      <Button size="sm" onClick={addSubtask}>
                        Add Subtask
                      </Button>
                    </FormControl>
                  </Stack>
                )}
                {!taskid && (
                  <Stack spacing={1}>
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
                  </Stack>
                )}
                {taskid && (
                  <FormControl sx={{ flexGrow: 1 }}>
                    <FormLabel>Completed By</FormLabel>
                    <Autocomplete
                      id="user_id"
                      name="user_id"
                      options={users}
                      getOptionLabel={(option) => option.first_name + " "}
                      value={
                        users.find((user) => user.user_id === task.user_id) ||
                        null
                      }
                      onChange={(e, value) =>
                        handleChange(
                          e,
                          value ? value.user_id : null, // Pass the user ID directly to handleChange
                          "user_id"
                        )
                      }
                      renderInput={(params) => (
                        <Input
                          {...params}
                          size="sm"
                          id="user_id"
                          name="user_id"
                          required
                        />
                      )}
                    />
                  </FormControl>
                )}

                {taskid && (
                  <Stack spacing={1}>
                    <FormLabel>Completion Notes</FormLabel>
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
                    </FormControl>
                  </Stack>
                )}
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
                      disabled={taskid ? true : false}
                      size="sm"
                      type="text"
                      id="task_name"
                      name="task_name"
                      value={task.task_name}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                </Stack>
              </Stack>
              <div></div>
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
                  {taskid ? "Complete Task" : "New Task"}
                </Button>
              </CardActions>
            </CardOverflow>
          </Card>
        </Stack>
      </Box>
    </form>
  );
};

export default TaskForm;