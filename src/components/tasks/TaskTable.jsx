import * as React from "react";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  Input,
  IconButton,
  Stack,
  Typography,
  Tabs,
  TabList,
  Sheet,
  Chip,
  TabPanel,
  Tab,
  tabClasses,
  Table,
} from "@mui/joy";
import Modal from "@mui/joy/Modal";
import { ModalDialog } from "@mui/joy";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useNavigate } from "react-router-dom";
import Checkbox, { checkboxClasses } from "@mui/joy/Checkbox";
import { useEffect, useState } from "react";
import { supabaseClient } from "../../supabase-client"; // Import the supabase client

// ICONS:
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ReplayIcon from "@mui/icons-material/Replay";

import AccordionGroup from "@mui/joy/AccordionGroup";
import Accordion from "@mui/joy/Accordion";
import AccordionDetails, {
  accordionDetailsClasses,
} from "@mui/joy/AccordionDetails";
import AccordionSummary, {
  accordionSummaryClasses,
} from "@mui/joy/AccordionSummary";

//task form
import TaskForm from "./TaskForm";
import { CheckBox } from "@mui/icons-material";

export default function TaskTable({ isModalOpen, toggleModal }) {
  const [open, setOpen] = React.useState(false);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [subTasks, setSubTasks] = useState([]);
  const [subTask, setSubTask] = useState("");
  // const [completedSubTasks, setCompletedSubTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const options = ["The Godfather", "Pulp Fiction"];
  const [index, setIndex] = React.useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  let [days, setDays] = useState(30);

  const navigate = useNavigate();
  const createHandleClose = (index, value) => () => {
    if (typeof index === "number") {
      setSelectedIndex(index);
      setDays(value);
    }
  };

  const [members, setMembers] = React.useState([false, true, false]);
  const toggleMember = (index) => (event) => {
    const newMembers = [...members];
    newMembers[index] = event.target.checked;
    setMembers(newMembers);
  };

  async function getTasks() {
    const { data, error } = await supabaseClient.from("tasks").select(`
      *,
      projects(*),
      priority:task_priority (name),
      users(*),
      subtasks(*)
    `);

    // if no tasks the display text saying no tasks

    if (error) {
      console.error("Error fetching tasks:", error);
    } else {
      const tasksWithPriorityName = data.map((task) => ({
        ...task,
        priority_name: task.priority ? task.priority.name : "Unknown",
        subtasks: task.subtasks ? task.subtasks : [],
      }));
      setTasks(tasksWithPriorityName);
      setUsers(tasksWithPriorityName.map((task) => task.users));
      setProjects(tasksWithPriorityName.map((task) => task.projects));
      setSubTasks(tasksWithPriorityName.map((task) => task.subtasks));
    }
  }
  useEffect(() => {
    getTasks();
  }, []);

  async function archiveTask(task_id) {
    const { data, error } = await supabaseClient
      .from("tasks")
      .update({
        is_archived: true,
        date_archived: new Date().toISOString(),
      })
      .match({ task_id: task_id });
    if (error) {
      console.error("Error updating Task status:", error);
    } else {
      console.log("Task archived successfully", data);
    }
    getTasks();
  }

  async function restoreDeletedTask(task_id) {
    const { data, error } = await supabaseClient
      .from("tasks")
      .update({
        is_archived: false,
        date_archived: null,
      })
      .match({ task_id: task_id });
    if (error) {
      console.error("Error updating Task status:", error);
    }
    console.log("Task restored successfully", data);
    getTasks();
  }

  async function restoreCompletedTask(task_id) {
    const { data, error } = await supabaseClient
      .from("tasks")
      .update({
        is_archived: false,
        date_archived: null,
        is_completed: false,
        date_completed: null,
      })
      .match({ task_id: task_id });
    if (error) {
      console.error("Error updating Task status:", error);
    }
    console.log("Task restored successfully", data);
    getTasks();
  }

  async function deleteTask(task_id) {
    const { data, error } = await supabaseClient
      .from("tasks")
      .delete()
      .match({ task_id: task_id });
    if (error) {
      console.error("Error deleting Task:", error);
    } else {
      getTasks();
    }
  }

  async function deleteAllTasks() {
    const { data, error } = await supabaseClient
      .from("tasks")
      .delete()
      .match({ is_archived: true });
    if (error) {
      console.error("Error deleting Task:", error);
    } else {
      console.log("All Tasks deleted successfully", data);
      getTasks();
    }
  }

  const handleSnackbarOpen = (index) => {
    const updatedOpen = [...open];
    updatedOpen[index] = true;
    setOpen(updatedOpen);
  };

  const handleSnackbarClose = (index) => {
    const updatedOpen = [...open];
    updatedOpen[index] = false;
    setOpen(updatedOpen);
  };

  const completedTasks = tasks.filter((task) => {
    const dayLength = days * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    const thirtyDaysAgoTimeStamp = Date.now() - dayLength;

    // Check if the task is completed and its creation date is within the last 30 days
    if (
      task.is_completed &&
      !task.is_archived &&
      new Date(task.date_created).getTime() >= thirtyDaysAgoTimeStamp
    ) {
      return true; // Keep the task in the filtered array
    }
    return false; // Exclude the task from the filtered array
  });

  const activeTasks = tasks.filter((task) => {
    if (task.is_completed == false && task.is_archived == false) {
      return task;
    }
  });

  const archivedTasks = tasks.filter((task) => {
    if (task.is_archived == true) {
      return task;
    }
  });

  const onHandleSubmit = () => {
    toggleModal(); // Close the modal after submission
    getTasks(); // Reload tasks
  };

  const getPriorityColor = (priorityName) => {
    switch (
      priorityName?.toLowerCase() // Safe navigation in case of undefined
    ) {
      case "high":
        return "danger";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  async function handleSubtaskToggle(taskId, subtaskId, isCompleted) {
    const { data, error } = await supabaseClient
      .from("subtasks")
      .update({ is_completed: isCompleted })
      .match({ subtask_id: subtaskId });

    if (error) {
      console.error("Error updating subtask:", error);
    } else {
      console.log("Subtask updated successfully", data);
      // Refresh your tasks list to reflect the changes
      getTasks();
    }
  }

  // Inside the addSubTask function, reset the subTask state to an empty string after adding a subtask
  async function addSubTask(subtaskName, taskId, isCompleted) {
    try {
      const { data, error } = await supabaseClient.from("subtasks").insert([
        {
          subtask_name: subtaskName,
          task_id: taskId,
          is_completed: isCompleted,
        },
      ]);

      if (error) {
        console.error("Error adding subtask:", error);
      } else {
        console.log("Subtask inserted successfully", data);
        // Reset subTask state to an empty string to clear the input field
        setSubTask("");
        // Refresh your tasks list to reflect the changes
        getTasks();
      }
    } catch (error) {
      console.error("Error adding subtask:", error.message);
    }
  }

  return (
    <React.Fragment>
      <Modal
        aria-labelledby="delete-confirmation-dialog-title"
        aria-describedby="delete-confirmation-dialog-description"
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)} // Close the modal when clicking away or pressing escape
      >
        <ModalDialog
          id="delete-confirmation-dialog"
          aria-labelledby="delete-confirmation-dialog-title"
          aria-describedby="delete-confirmation-dialog-description"
          role="dialog"
          sx={{ p: 2 }}
        >
          <Typography level="h2" id="delete-confirmation-dialog-title" mb={2}>
            Confirm Deletion
          </Typography>
          <Typography id="delete-confirmation-dialog-description" mb={3}>
            Are you sure you want to permanently delete all recently deleted
            tasks? <br />
            This action cannot be undone.
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="outlined"
              color="neutral"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              color="danger"
              onClick={() => {
                deleteAllTasks();
                setIsDeleteModalOpen(false);
              }}
            >
              Delete
            </Button>
          </Box>
        </ModalDialog>
      </Modal>

      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: {
            xs: "none",
            sm: "block",
            md: "block",
            lg: "block",
            xl: "block",
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
        <Tabs
          aria-label="Pipeline"
          value={index}
          onChange={(event, value) => setIndex(value)}
        >
          <TabList>
            <Tab indicatorInset>
              Active Tasks{" "}
              <Chip
                size="sm"
                variant="soft"
                color={index === 0 ? "primary" : "neutral"}
              >
                {activeTasks.length}
              </Chip>
            </Tab>

            <Tab indicatorInset>
              Completed Tasks{" "}
              <Chip
                size="sm"
                variant="soft"
                color={index === 1 ? "primary" : "neutral"}
              >
                {completedTasks.length}
              </Chip>
            </Tab>

            <Tab indicatorInset>
              Recently Deleted Tasks{" "}
              <Chip
                size="sm"
                variant="soft"
                color={index === 2 ? "primary" : "neutral"}
              >
                {archivedTasks.length}
              </Chip>
            </Tab>
          </TabList>

          <TabPanel value={0}>
            <Table
              stickyHeader
              hoverRow
              sx={{
                "--TableCell-headBackground":
                  "var(--joy-palette-background-level1)",
                "--Table-headerUnderlineThickness": "1px",
                "--TableRow-hoverBackground":
                  "var(--joy-palette-background-level1)",
                "--TableCell-paddingY": "4px",
                "--TableCell-paddingX": "8px",
                borderRadius: "5px",
              }}
            >
              {/* TABLE HEAD BEGINS HERE */}
              <thead>
                <tr>
                  <th style={{ width: 120, padding: "12px 12px" }}>
                    Task Name
                  </th>
                  <th
                    style={{
                      width: 25,
                      padding: "12px 6px",
                      textAlign: "center",
                    }}
                  >
                    Priority
                  </th>
                  <th
                    style={{
                      width: 25,
                      padding: "12px 6px",
                      textAlign: "center",
                    }}
                  >
                    Created
                  </th>
                  <th style={{ width: 25, padding: "12px 6px" }}></th>
                </tr>
              </thead>

              <tbody>
                {activeTasks.length > 0 ? (
                  Object.values(activeTasks).map((task) => (
                    <tr key={task.task_id}>
                      <td
                        // onClick={() => console.log("Task Clicked")}
                        style={{ cursor: "pointer", textAlign: "left" }}
                      >
                        <Typography level="body-xs">
                          {
                            task.subtasks.filter(
                              (subtask) => subtask.is_completed
                            ).length
                          }{" "}
                          / {task.subtasks.length} Subtasks
                        </Typography>
                        <AccordionGroup
                          transition="0.4s"
                          sx={{
                            width: "100%",
                            borderRadius: "lg",
                            [`& .${accordionSummaryClasses.button}:hover`]: {
                              bgcolor: "transparent",
                            },
                            [`& .${accordionDetailsClasses.content}`]: {
                              boxShadow: (theme) =>
                                `inset 0 1px ${theme.vars.palette.divider}`,
                              [`&.${accordionDetailsClasses.expanded}`]: {
                                paddingBlock: "0.75rem",
                              },
                            },
                          }}
                        >
                          <Accordion>
                            <AccordionSummary>
                              {/* Use a Box to stack the task name and project name vertically */}
                              <Box sx={{ textAlign: "left" }}>
                                <Typography
                                  variant="subtitle1"
                                  component="div"
                                  color="text.primary"
                                >
                                  {task.task_name}
                                </Typography>
                                {task.projects ? (
                                  <Typography variant="body2" component="div">
                                    {task.projects.project_name}
                                  </Typography>
                                ) : (
                                  <Typography
                                    variant="body2"
                                    component="div"
                                    color="text.primary"
                                  >
                                    No Project
                                  </Typography>
                                )}
                              </Box>
                            </AccordionSummary>
                            <AccordionDetails
                              variant="soft"
                              sx={{ padding: 0 }}
                            >
                              <Box sx={{ listStyleType: "none", padding: 0 }}>
                                {task.subtasks && task.subtasks.length > 0 ? (
                                  task.subtasks.map((subtask) => (
                                    <Box
                                      key={subtask.subtask_id}
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        textDecoration: subtask.is_completed
                                          ? "line-through"
                                          : "none",
                                      }}
                                    >
                                      <Checkbox
                                        color="success"
                                        sx={{ padding: 0.5 }}
                                        checked={subtask.is_completed}
                                        onChange={() =>
                                          handleSubtaskToggle(
                                            task.task_id,
                                            subtask.subtask_id,
                                            !subtask.is_completed
                                          )
                                        }
                                      />
                                      <Typography
                                        sx={{
                                          flexGrow: 1,
                                          textDecoration: subtask.is_completed
                                            ? "line-through"
                                            : "none",
                                        }}
                                      >
                                        {subtask.subtask_name}
                                      </Typography>
                                    </Box>
                                  ))
                                ) : (
                                  <Typography>No Subtasks</Typography>
                                )}
                              </Box>

                              {/* Input field for adding new subtask */}
                              <FormControl fullWidth sx={{ mt: 1 }}>
                                <Input
                                  id={`subtask_name_${task.task_id}`} // Unique identifier using task_id
                                  placeholder="Add new subtask"
                                  value={subTask[task.task_id] || ""} // Retrieve value based on task_id
                                  onChange={(e) =>
                                    setSubTask((prevState) => ({
                                      ...prevState,
                                      [task.task_id]: e.target.value,
                                    }))
                                  } // Update the corresponding task_id key in the state object
                                />
                              </FormControl>

                              {/* Button for adding new subtask */}
                              <Button
                                variant="outlined"
                                onClick={() => {
                                  const subtaskName =
                                    subTask[task.task_id].trim(); // Trim whitespace from input value
                                  // Check if the trimmed input value is not empty
                                  if (subtaskName !== "") {
                                    addSubTask(
                                      subtaskName,
                                      task.task_id,
                                      false
                                    ); // Call addSubTask only if input value is not empty
                                    setSubTask((prevState) => ({
                                      ...prevState,
                                      [task.task_id]: "", // Reset the corresponding task_id key to an empty string
                                    }));
                                  }
                                }}
                                sx={{ mt: 1 }}
                              >
                                Add Subtask
                              </Button>
                            </AccordionDetails>
                          </Accordion>
                        </AccordionGroup>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <Chip
                          onClick={() =>
                            console.log(`Task Clicked: ${task.task_id}`)
                          }
                          style={{ cursor: "pointer" }}
                          variant="soft"
                          size="sm"
                          color={getPriorityColor(task.priority_name)}
                        >
                          {task.priority_name}
                        </Chip>
                      </td>

                      <td style={{ textAlign: "center" }}>
                        {task.date_created
                          ? new Date(task.date_created)
                              .toISOString()
                              .split("T")[0]
                          : "N/A"}
                      </td>

                      <td style={{ textAlign: "center" }}>
                        <Stack
                          spacing={1}
                          direction="row"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <IconButton
                            size="sm"
                            variant="soft"
                            color="success"
                            onClick={() =>
                              navigate(`/tasks/edit/${task.task_id}`)
                            }
                          >
                            <CheckBox />
                          </IconButton>
                          <IconButton
                            size="sm"
                            variant="soft"
                            color="danger"
                            onClick={() => archiveTask(task.task_id)}
                          >
                            <DeleteRoundedIcon />
                          </IconButton>
                        </Stack>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      <Typography variant="h1" component="h1">
                        No Active Tasks
                      </Typography>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </TabPanel>

          <TabPanel value={1}>
            <Table
              stickyHeader
              hoverRow
              sx={{
                "--TableCell-headBackground":
                  "var(--joy-palette-background-level1)",
                "--Table-headerUnderlineThickness": "1px",
                "--TableRow-hoverBackground":
                  "var(--joy-palette-background-level1)",
                "--TableCell-paddingY": "4px",
                "--TableCell-paddingX": "8px",
                borderRadius: "5px",
              }}
            >
              {/* TABLE HEAD BEGINS HERE */}
              <thead>
                <tr>
                  <th style={{ width: 120, padding: "12px 6px" }}>Name</th>
                  <th
                    style={{
                      width: 25,
                      padding: "12px 6px",
                      textAlign: "center",
                    }}
                  >
                    Assigned
                  </th>
                  <th
                    style={{
                      width: 25,
                      padding: "12px 6px",
                      textAlign: "center",
                    }}
                  >
                    Completed
                  </th>
                  <th
                    style={{
                      width: 25,
                      padding: "12px 6px",
                      textAlign: "center",
                    }}
                  ></th>
                </tr>
              </thead>

              <tbody>
                {completedTasks.length > 0 ? (
                  Object.values(completedTasks).map((task, days) => (
                    <tr key={task.task_id}>
                      <td
                        onClick={() => console.log("Task Clicked")}
                        style={{ cursor: "pointer", textAlign: "left" }}
                      >
                        <Typography level="body-xs">
                          {
                            task.subtasks.filter(
                              (subtask) => subtask.is_completed
                            ).length
                          }{" "}
                          / {task.subtasks.length} Subtasks completed
                        </Typography>
                        <AccordionGroup
                          transition="0.4s"
                          sx={{
                            width: "100%",
                            borderRadius: "lg",
                            [`& .${accordionSummaryClasses.button}:hover`]: {
                              bgcolor: "transparent",
                            },
                            [`& .${accordionDetailsClasses.content}`]: {
                              boxShadow: (theme) =>
                                `inset 0 1px ${theme.vars.palette.divider}`,
                              [`&.${accordionDetailsClasses.expanded}`]: {
                                paddingBlock: "0.75rem",
                              },
                            },
                          }}
                        >
                          <Accordion>
                            <AccordionSummary>
                              {/* Use a Box to stack the task name and project name vertically */}
                              <Box sx={{ textAlign: "left" }}>
                                <Typography
                                  variant="subtitle1"
                                  component="div"
                                  color="text.primary"
                                >
                                  {task.task_name}
                                </Typography>
                                {task.projects ? (
                                  <Typography variant="body2" component="div">
                                    {task.projects.project_name}
                                  </Typography>
                                ) : (
                                  <Typography
                                    variant="body2"
                                    component="div"
                                    color="text.primary"
                                  >
                                    No Project
                                  </Typography>
                                )}
                              </Box>
                            </AccordionSummary>
                            <Typography
                              sx={{ mt: 0.5, mb: 0.6 }}
                              level="body-xs"
                            >
                              Completed By:
                              {task.is_completed
                                ? " " + task.users?.first_name ?? "N/A"
                                : " " + "N/A"}
                            </Typography>
                            <AccordionDetails
                              variant="soft"
                              sx={{ padding: 0 }}
                            >
                              <Box sx={{ listStyleType: "none", padding: 0 }}>
                                {task.subtasks && task.subtasks.length > 0 ? (
                                  task.subtasks.map((subtask) => (
                                    <Box
                                      key={subtask.subtask_id}
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        textDecoration: subtask.is_completed
                                          ? "line-through"
                                          : "none",
                                      }}
                                    >
                                      <Checkbox
                                        color="success"
                                        sx={{ padding: 0.5 }}
                                        checked={subtask.is_completed}
                                      />
                                      <Typography
                                        sx={{
                                          flexGrow: 1,
                                          textDecoration: subtask.is_completed
                                            ? "line-through"
                                            : "none",
                                        }}
                                      >
                                        {subtask.subtask_name}
                                      </Typography>
                                    </Box>
                                  ))
                                ) : (
                                  <Typography>No Subtasks</Typography>
                                )}
                              </Box>
                              <Typography level="body-sm">
                                Notes: {task.completion_notes}
                              </Typography>
                            </AccordionDetails>
                          </Accordion>
                        </AccordionGroup>
                      </td>

                      <td style={{ textAlign: "center" }}>
                        {task.date_created
                          ? new Date(task.date_created)
                              .toISOString()
                              .split("T")[0]
                          : "N/A"}
                      </td>

                      <td style={{ textAlign: "center" }}>
                        {task.date_completed
                          ? new Date(task.date_completed)
                              .toISOString()
                              .split("T")[0]
                          : "N/A"}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <Stack
                          spacing={1}
                          direction="row"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <IconButton
                            size="sm"
                            variant="soft"
                            color="danger"
                            onClick={() => archiveTask(task.task_id)}
                          >
                            <DeleteRoundedIcon />
                          </IconButton>
                          <IconButton
                            size="sm"
                            variant="soft"
                            s
                            color="primary"
                            onClick={() => restoreCompletedTask(task.task_id)}
                          >
                            <ReplayIcon />
                          </IconButton>
                        </Stack>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      <Typography variant="h1" component="h1">
                        No Completed Tasks
                      </Typography>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </TabPanel>

          <TabPanel value={2}>
            <Table
              stickyHeader
              hoverRow
              sx={{
                "--TableCell-headBackground":
                  "var(--joy-palette-background-level1)",
                "--Table-headerUnderlineThickness": "1px",
                "--TableRow-hoverBackground":
                  "var(--joy-palette-background-level1)",
                "--TableCell-paddingY": "4px",
                "--TableCell-paddingX": "8px",
                borderRadius: "5px",
              }}
            >
              {/* TABLE HEAD BEGINS HERE */}
              <thead>
                <tr>
                  <th style={{ width: 70, padding: "12px 6px" }}>Name</th>
                  <th
                    style={{
                      width: 25,
                      padding: "12px 6px",
                      textAlign: "center",
                    }}
                  >
                    Assigned
                  </th>
                  <th
                    style={{
                      width: 25,
                      padding: "12px 6px",
                      textAlign: "center",
                    }}
                  >
                    Completed
                  </th>
                  <th
                    style={{
                      width: 25,
                      padding: "12px 6px",
                      textAlign: "center",
                    }}
                  >
                    <Button
                      size="sm"
                      variant="soft"
                      color="danger"
                      onClick={() => setIsDeleteModalOpen(true)}
                      endDecorator={<DeleteRoundedIcon />}
                    >
                      Delete All
                    </Button>
                  </th>
                </tr>
              </thead>

              <tbody>
                {archivedTasks.length > 0 ? (
                  Object.values(archivedTasks).map((task, days) => (
                    <tr key={task.task_id}>
                      <td style={{ textAlign: "left" }}>
                        {/* Use a Box to stack the task name and project name vertically */}
                        <Box sx={{ textAlign: "left" }}>
                          <Typography
                            variant="subtitle1"
                            component="div"
                            color="text.primary"
                          >
                            {task.task_name}
                          </Typography>
                          {task.projects ? (
                            <Typography variant="body2" component="div">
                              {task.projects.project_name}
                            </Typography>
                          ) : (
                            <Typography
                              variant="body2"
                              component="div"
                              color="text.primary"
                            >
                              No Project
                            </Typography>
                          )}
                        </Box>
                        <Typography sx={{ mt: 0.5, mb: 0.6 }} level="body-xs">
                          Completed By:
                          {task.is_completed
                            ? " " + task.users?.first_name ?? "N/A"
                            : " " + "N/A"}
                        </Typography>
                        <AccordionDetails variant="soft" sx={{ padding: 0 }}>
                          <Box sx={{ listStyleType: "none", padding: 0 }}>
                            {task.subtasks && task.subtasks.length > 0 ? (
                              task.subtasks.map((subtask) => (
                                <Box
                                  key={subtask.subtask_id}
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    textDecoration: subtask.is_completed
                                      ? "line-through"
                                      : "none",
                                  }}
                                >
                                  <Checkbox
                                    color="success"
                                    sx={{ padding: 0.5 }}
                                    checked={subtask.is_completed}
                                  />
                                  <Typography
                                    sx={{
                                      flexGrow: 1,
                                      textDecoration: subtask.is_completed
                                        ? "line-through"
                                        : "none",
                                    }}
                                  >
                                    {subtask.subtask_name}
                                  </Typography>
                                </Box>
                              ))
                            ) : (
                              <Typography>No Subtasks</Typography>
                            )}
                          </Box>
                          <Typography level="body-sm">
                            Notes: {task.completion_notes}
                          </Typography>
                        </AccordionDetails>
                      </td>

                      <td style={{ textAlign: "center" }}>
                        {task.date_created
                          ? new Date(task.date_created)
                              .toISOString()
                              .split("T")[0]
                          : "N/A"}
                      </td>

                      <td style={{ textAlign: "center" }}>
                        {task.date_completed
                          ? new Date(task.date_completed)
                              .toISOString()
                              .split("T")[0]
                          : "N/A"}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <Stack
                          spacing={1}
                          direction="row"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <IconButton
                            size="sm"
                            variant="soft"
                            color="danger"
                            onClick={() => deleteTask(task.task_id)}
                          >
                            <DeleteRoundedIcon />
                          </IconButton>
                          <IconButton
                            size="sm"
                            variant="soft"
                            color="primary"
                            onClick={() => restoreDeletedTask(task.task_id)}
                          >
                            <ReplayIcon />
                          </IconButton>
                        </Stack>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      <Typography variant="h1" component="h1">
                        No Recently Deleted Tasks
                      </Typography>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </TabPanel>
        </Tabs>
      </Sheet>

      {/* Mobile View Table goes here? */}

      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: {
            sm: "none",
            md: "none",
            xl: "none",
            lg: "auto",
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
        <Tabs
          aria-label="Pipeline"
          value={index}
          onChange={(event, value) => setIndex(value)}
        >
          <TabList>
            <Tab indicatorInset>
              <Typography level="body-sm">Active</Typography>
              <Chip
                size="sm"
                variant="soft"
                color={index === 0 ? "primary" : "neutral"}
              >
                {activeTasks.length}
              </Chip>
            </Tab>

            <Tab indicatorInset>
              <Typography level="body-sm">Completed</Typography>
              <Chip
                size="sm"
                variant="soft"
                color={index === 1 ? "primary" : "neutral"}
              >
                {completedTasks.length}
              </Chip>
            </Tab>

            <Tab indicatorInset>
              <Typography level="body-sm">Recently Deleted</Typography>
              <Chip
                size="sm"
                variant="soft"
                color={index === 2 ? "primary" : "neutral"}
              >
                {archivedTasks.length}
              </Chip>
            </Tab>
          </TabList>

          <TabPanel value={0}>
            <Table
              stickyHeader
              hoverRow
              sx={{
                "--TableCell-headBackground":
                  "var(--joy-palette-background-level1)",
                "--Table-headerUnderlineThickness": "1px",
                "--TableRow-hoverBackground":
                  "var(--joy-palette-background-level1)",
                "--TableCell-paddingY": "4px",
                "--TableCell-paddingX": "8px",
                borderRadius: "5px",
              }}
            >
              {/* TABLE HEAD BEGINS HERE */}
              <thead>
                <tr>
                  <th style={{ width: 120, padding: "12px 12px" }}>
                    Task Name
                  </th>
                  <th style={{ width: 25, padding: "12px 6px" }}></th>
                </tr>
              </thead>

              <tbody>
                {activeTasks.length > 0 ? (
                  Object.values(activeTasks).map((task) => (
                    <tr key={task.task_id}>
                      <td
                        // onClick={() => console.log("Task Clicked")}
                        style={{ cursor: "pointer", textAlign: "left" }}
                      >
                        <Typography level="body-xs">
                          {
                            task.subtasks.filter(
                              (subtask) => subtask.is_completed
                            ).length
                          }{" "}
                          / {task.subtasks.length} Subtasks
                        </Typography>
                        <AccordionGroup
                          transition="0.4s"
                          sx={{
                            width: "100%",
                            borderRadius: "lg",
                            [`& .${accordionSummaryClasses.button}:hover`]: {
                              bgcolor: "transparent",
                            },
                            [`& .${accordionDetailsClasses.content}`]: {
                              boxShadow: (theme) =>
                                `inset 0 1px ${theme.vars.palette.divider}`,
                              [`&.${accordionDetailsClasses.expanded}`]: {
                                paddingBlock: "0.75rem",
                              },
                            },
                          }}
                        >
                          <Accordion>
                            <AccordionSummary>
                              <Box sx={{ textAlign: "left" }}>
                                {" "}
                                <Typography
                                  level="body-sm"
                                  variant="subtitle1"
                                  component="div"
                                  sx={{ color: "text.primary" }}
                                >
                                  {task.task_name}
                                </Typography>
                                {task.projects ? (
                                  <Typography
                                    level="body-xs"
                                    component="div"
                                    sx={{ color: "text.secondary", mt: 0.5 }}
                                  >
                                    {task.projects.project_name}
                                  </Typography>
                                ) : (
                                  <Typography
                                    level="body-xs"
                                    variant="body2"
                                    component="div"
                                    sx={{ color: "text.secondary", mt: 0.5 }}
                                  >
                                    No Project
                                  </Typography>
                                )}
                              </Box>
                            </AccordionSummary>

                            <AccordionDetails
                              variant="soft"
                              sx={{ padding: 0 }}
                            >
                              <Box sx={{ listStyleType: "none", padding: 0 }}>
                                {task.subtasks && task.subtasks.length > 0 ? (
                                  task.subtasks.map((subtask) => (
                                    <Box
                                      key={subtask.subtask_id}
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        textDecoration: subtask.is_completed
                                          ? "line-through"
                                          : "none",
                                      }}
                                    >
                                      <Checkbox
                                        color="success"
                                        size="sm"
                                        sx={{ padding: 0.5 }}
                                        checked={subtask.is_completed}
                                        onChange={() =>
                                          handleSubtaskToggle(
                                            task.task_id,
                                            subtask.subtask_id,
                                            !subtask.is_completed
                                          )
                                        }
                                      />
                                      <Typography
                                        level="body-xs"
                                        sx={{
                                          flexGrow: 1,
                                          textDecoration: subtask.is_completed
                                            ? "line-through"
                                            : "none",
                                        }}
                                      >
                                        {subtask.subtask_name}
                                      </Typography>
                                    </Box>
                                  ))
                                ) : (
                                  <Typography level="body-xs">
                                    No Subtasks
                                  </Typography>
                                )}
                              </Box>

                              {/* Input field for adding new subtask */}
                              <FormControl fullWidth sx={{ mt: 1 }}>
                                <Input
                                  size="sm"
                                  id={`subtask_name_${task.task_id}`} // Unique identifier using task_id
                                  placeholder="Add new subtask"
                                  value={subTask[task.task_id] || ""} // Retrieve value based on task_id
                                  onChange={(e) =>
                                    setSubTask((prevState) => ({
                                      ...prevState,
                                      [task.task_id]: e.target.value,
                                    }))
                                  } // Update the corresponding task_id key in the state object
                                />
                              </FormControl>

                              {/* Button for adding new subtask */}
                              <Button
                                variant="outlined"
                                onClick={() => {
                                  const subtaskName =
                                    subTask[task.task_id].trim(); // Trim whitespace from input value
                                  // Check if the trimmed input value is not empty
                                  if (subtaskName !== "") {
                                    addSubTask(
                                      subtaskName,
                                      task.task_id,
                                      false
                                    ); // Call addSubTask only if input value is not empty
                                    setSubTask((prevState) => ({
                                      ...prevState,
                                      [task.task_id]: "", // Reset the corresponding task_id key to an empty string
                                    }));
                                  }
                                }}
                                sx={{ mt: 1 }}
                              >
                                Add Subtask
                              </Button>
                            </AccordionDetails>
                          </Accordion>
                        </AccordionGroup>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <Stack spacing={1}>
                          <IconButton
                            size="sm"
                            variant="soft"
                            color="success"
                            onClick={() =>
                              navigate(`/tasks/edit/${task.task_id}`)
                            }
                          >
                            <CheckBoxIcon />
                          </IconButton>
                          <IconButton
                            size="sm"
                            variant="soft"
                            color="danger"
                            onClick={() => archiveTask(task.task_id)}
                          >
                            <DeleteRoundedIcon />
                          </IconButton>
                        </Stack>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="1" style={{ textAlign: "center" }}>
                      <Typography variant="h1" component="h1">
                        No Active Tasks
                      </Typography>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </TabPanel>

          <TabPanel value={1}>
            <Table
              stickyHeader
              hoverRow
              sx={{
                "--TableCell-headBackground":
                  "var(--joy-palette-background-level1)",
                "--Table-headerUnderlineThickness": "1px",
                "--TableRow-hoverBackground":
                  "var(--joy-palette-background-level1)",
                "--TableCell-paddingY": "4px",
                "--TableCell-paddingX": "8px",
                borderRadius: "5px",
              }}
            >
              {/* TABLE HEAD BEGINS HERE */}
              <thead>
                <tr>
                  <th style={{ width: 60, padding: "12px 6px" }}>Task</th>
                  <th style={{ width: 10, padding: "12px 6px" }}></th>
                </tr>
              </thead>

              <tbody>
                {completedTasks.length > 0 ? (
                  Object.values(completedTasks).map((task) => (
                    <tr key={task.task_id}>
                      <td
                        onClick={() => console.log("Task Clicked")}
                        style={{ cursor: "pointer", textAlign: "left" }}
                      >
                        <AccordionGroup
                          transition="0.2s"
                          sx={{
                            maxWidth: 400,
                            borderRadius: "lg",
                            [`& .${accordionSummaryClasses.button}:hover`]: {
                              bgcolor: "transparent",
                            },
                            [`& .${accordionDetailsClasses.content}`]: {
                              boxShadow: (theme) =>
                                `inset 0 1px ${theme.vars.palette.divider}`,
                              [`&.${accordionDetailsClasses.expanded}`]: {
                                paddingBlock: "0.75rem",
                              },
                            },
                          }}
                        >
                          <Accordion>
                            <AccordionSummary>
                              <Box sx={{ textAlign: "left" }}>
                                <Typography
                                  level="body-sm"
                                  variant="subtitle1"
                                  component="div"
                                  sx={{ color: "text.primary" }}
                                >
                                  {task.task_name}
                                </Typography>
                                {task.projects ? (
                                  <Typography
                                    level="body-xs"
                                    component="div"
                                    sx={{ color: "text.secondary", mt: 0.5 }}
                                  >
                                    {task.projects.project_name}
                                  </Typography>
                                ) : (
                                  <Typography
                                    level="body-xs"
                                    variant="body2"
                                    component="div"
                                    sx={{ color: "text.secondary", mt: 0.5 }}
                                  >
                                    No Project
                                  </Typography>
                                )}
                              </Box>
                            </AccordionSummary>
                            <Typography
                              sx={{ mt: 0.5, mb: 0.6 }}
                              level="body-xs"
                            >
                              Completed By:{" "}
                              {task.is_completed
                                ? " " + (task.users?.first_name ?? "N/A")
                                : "N/A"}
                            </Typography>
                            <AccordionDetails
                              variant="soft"
                              sx={{ padding: 0 }}
                            >
                              <Box sx={{ listStyleType: "none", padding: 0 }}>
                                {task.subtasks && task.subtasks.length > 0 ? (
                                  task.subtasks.map((subtask) => (
                                    <Box
                                      key={subtask.subtask_id}
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        textDecoration: subtask.is_completed
                                          ? "line-through"
                                          : "none",
                                      }}
                                    >
                                      <Checkbox
                                        color="success"
                                        size="sm"
                                        sx={{ padding: 0.5 }}
                                        checked={subtask.is_completed}
                                      />
                                      <Typography
                                        level="body-xs"
                                        sx={{
                                          flexGrow: 1,
                                          textDecoration: subtask.is_completed
                                            ? "line-through"
                                            : "none",
                                        }}
                                      >
                                        {subtask.subtask_name}
                                      </Typography>
                                    </Box>
                                  ))
                                ) : (
                                  <Typography level="body-xs">
                                    No Subtasks
                                  </Typography>
                                )}
                              </Box>
                              <Typography level="body-xs">
                                Notes: {task.completion_notes}
                              </Typography>
                            </AccordionDetails>
                          </Accordion>
                        </AccordionGroup>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <Stack
                          spacing={1}
                          direction="row"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <IconButton
                            size="sm"
                            variant="soft"
                            color="danger"
                            onClick={() => archiveTask(task.task_id)}
                          >
                            <DeleteRoundedIcon />
                          </IconButton>

                          <IconButton
                            size="sm"
                            variant="soft"
                            s
                            color="primary"
                            onClick={() => restoreCompletedTask(task.task_id)}
                          >
                            <ReplayIcon />
                          </IconButton>
                        </Stack>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" style={{ textAlign: "center" }}>
                      <Typography variant="h1" component="h1">
                        No Completed Tasks
                      </Typography>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </TabPanel>

          <TabPanel value={2}>
            <Table
              stickyHeader
              hoverRow
              sx={{
                "--TableCell-headBackground":
                  "var(--joy-palette-background-level1)",
                "--Table-headerUnderlineThickness": "1px",
                "--TableRow-hoverBackground":
                  "var(--joy-palette-background-level1)",
                "--TableCell-paddingY": "4px",
                "--TableCell-paddingX": "8px",
                borderRadius: "5px",
              }}
            >
              {/* TABLE HEAD BEGINS HERE */}
              <thead>
                <tr>
                  <th style={{ width: 70, padding: "12px 6px" }}>Name</th>
                  <th
                    style={{
                      width: 20,
                      padding: "12px 6px",
                      textAlign: "center",
                    }}
                  >
                    <Button
                      textAlign="center"
                      size="xs"
                      variant="soft"
                      color="danger"
                      onClick={() => setIsDeleteModalOpen(true)}
                    >
                      <Typography level="body-xs">DLT All</Typography>
                    </Button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {archivedTasks.length > 0 ? (
                  Object.values(archivedTasks).map((task, days) => (
                    <tr key={task.task_id}>
                      <td style={{ textAlign: "left" }}>
                        {/* Use a Box to stack the task name and project name vertically */}
                        <Box sx={{ textAlign: "left" }}>
                          <Typography
                            component="div"
                            color="text.primary"
                            level="body-sm"
                            sx={{ color: "text.primary" }}
                          >
                            {task.task_name}
                          </Typography>
                          {task.projects ? (
                            <Typography variant="body2" component="div">
                              {task.projects.project_name}
                            </Typography>
                          ) : (
                            <Typography
                              variant="body2"
                              component="div"
                              color="text.primary"
                            >
                              No Project
                            </Typography>
                          )}
                        </Box>
                        <Typography sx={{ mt: 0.5, mb: 0.6 }} level="body-xs">
                          Completed By:
                          {task.is_completed
                            ? " " + task.users?.first_name ?? "N/A"
                            : " " + "N/A"}
                        </Typography>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <Stack
                          spacing={1}
                          direction="row"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <IconButton
                            size="sm"
                            variant="soft"
                            color="danger"
                            onClick={() => deleteTask(task.task_id)}
                          >
                            <DeleteRoundedIcon />
                          </IconButton>
                          <IconButton
                            size="sm"
                            variant="soft"
                            color="primary"
                            onClick={() => restoreDeletedTask(task.task_id)}
                          >
                            <ReplayIcon />
                          </IconButton>
                        </Stack>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" style={{ textAlign: "center" }}>
                      <Typography variant="h1" component="h1">
                        No Recently Deleted Tasks
                      </Typography>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </TabPanel>
        </Tabs>
      </Sheet>
    </React.Fragment>
  );
}
