import * as React from "react";
import { Box, Button, FormControl, Input, IconButton, Stack, Typography, Tabs, TabList, Sheet, Chip, TabPanel, Tab, Table } from "@mui/joy";
import Divider from '@mui/material/Divider';

import { useNavigate } from "react-router-dom";
import Checkbox, { checkboxClasses } from "@mui/joy/Checkbox";
import { useEffect, useState } from "react";
import { supabaseClient } from "../../supabase-client"; // Import the supabase client
// ICONS:
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

import AccordionGroup from "@mui/joy/AccordionGroup";
import Accordion from "@mui/joy/Accordion";
import AccordionDetails, {
  accordionDetailsClasses,
} from "@mui/joy/AccordionDetails";
import AccordionSummary, {
  accordionSummaryClasses,
} from "@mui/joy/AccordionSummary";

//task form
import { CheckBox } from "@mui/icons-material";


const DashboardTasks = ({ projectid }) => {
  const [tasks, setTasks] = useState([]);
  const [index, setIndex] = useState(0);
  const [subTask, setSubTask] = useState("");
  const [subTasks, setSubTasks] = useState([]);
  let [days, setDays] = useState(30);

  const navigate = useNavigate();

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

  async function getTasks() {
    const { data, error } = await supabaseClient
      .from("tasks")
      .select(
        `
      *,
      projects(*),
      priority:task_priority (name),
      users(*),
      subtasks(*)
    `
      )
      .order("date_created", { ascending: false })
      .eq("is_completed", false)
      

    if (error) {
      console.error("Error fetching tasks:", error);
    } else {
      const tasksWithPriorityName = data.map((task) => ({
        ...task,
        priority_name: task.priority ? task.priority.name : "Unknown",
        subtasks: task.subtasks ? task.subtasks : [],
      }));
      setTasks(tasksWithPriorityName);
      setSubTasks(data.map((task) => task.subtasks));
    }
  }

  useEffect(() => {
    getTasks();
  }, [projectid]);

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
  const completedTasks = tasks.filter((task) => {
    const dayLength = days * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    const thirtyDaysAgoTimeStamp = Date.now() - dayLength;

    // Check if the task is completed and its creation date is within the last 30 days
    if (
      task.is_completed &&
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

  return (
    <>
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
          {/* </TabList> */}

          <Sheet sx={{ height: 470, overflow: "auto" }}>
            <Table
              borderAxis="x"
              size="md"
              stickyHeader
              hoverRow
              variant="plain"
            >
              {/* TABLE HEAD BEGINS HERE */}
              <thead>
                <tr>
                  <th style={{ width: 200, padding: "12px 12px" }}>
                    Task Name
                  </th>
                  <th
                    style={{
                      width: 200,
                      padding: "12px 6px",
                      textAlign: "center",
                    }}
                  >
                    Priority
                  </th>
                  <th
                    style={{
                      width: 200,
                      padding: "12px 6px",
                      textAlign: "center",
                    }}
                  >
                    Created
                  </th>
                </tr>
              </thead>

              <tbody>
                {activeTasks.length > 0 ? (
                  activeTasks.slice(0,5).map((task) => (
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
                                    <div>

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
                                    <Divider  sx={{
                                      width: "35%",
                                      height: 1,
                                      backgroundColor: "blue",
                                      margin: ".5rem 0",
                                    
                                    }}/>
                                    </div>


                                  ))
                                ) : (
                                  <Typography>No Subtasks</Typography>
                                )}
                              </Box>
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
            </Sheet>
      </Sheet>
      
                       
      {/* Mobile View Table goes here? */}
      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: {
            xs: "block",
            sm: "none",
            md: "none",
            lg: "auto",
            xl: "auto",
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
                  <th style={{ width: "100%", padding: "12px 12px" }}>
                    Task Name
                  </th>
                </tr>
              </thead>

              <tbody>
                {activeTasks.length > 0 ? (
                  activeTasks.slice(0,5).map((task) => (
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


                            </AccordionDetails>
                          </Accordion>
                        </AccordionGroup>
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
      </Sheet>
    </>

    
  );
};

export default DashboardTasks;