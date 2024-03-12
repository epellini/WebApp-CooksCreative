import React, { useState, useEffect } from "react";
import {
  Box,
  Sheet,
  Typography,
  Tabs,
  TabList,
  TabPanel,
  Tab,
  Chip,
  Table,
} from "@mui/joy";
import { Skeleton } from "@mui/joy";
import { supabaseClient } from "../../supabase-client";
import TaskForm from "../tasks/TaskForm";
import ProjectTaskForm from "./ProjectTaskForm";

const ProjectTasks = ({ projectid }) => {
  const [tasks, setTasks] = useState([]);
  const [index, setIndex] = useState(0);

  async function getTasks() {
    const { data, error } = await supabaseClient
      .from("tasks")
      .select("*")
      .eq("project_id", projectid)
      .order("task_id", { ascending: true });

    if (error) {
      console.error("Error fetching tasks:", error);
    } else {
      setTasks(data);
    }
  }

  useEffect(() => {
    getTasks();
  }, [projectid]);

  const completedTasks = tasks.filter((task) => task.is_completed === true);
  const activeTasks = tasks.filter((task) => task.is_completed === false);

  return (
    <React.Fragment>
      <Sheet
        variant="outlined"
        sx={{
          display: {
            maxWidth: "1600px",
            mx: "auto",
            borderRadius: "sm",
            marginTop: "15px",
            px: { xs: 2, md: 6 },
            py: { xs: 2, md: 3 },
          },
          width: "100%",
          borderRadius: "sm",
          flexShrink: 1,
          overflow: "auto",
          minHeight: 0,
        }}
      >
        <Tabs
          aria-label="Task Categories"
          value={index}
          onChange={(event, value) => setIndex(value)}
        >
          <TabList>
            <Tab>
              Active Tasks{" "}
              <Chip
                size="sm"
                variant="soft"
                color={index === 0 ? "primary" : "neutral"}
              >
                {activeTasks.length}
              </Chip>
            </Tab>
            <Tab>
              Completed Tasks{" "}
              <Chip
                size="sm"
                variant="soft"
                color={index === 1 ? "primary" : "neutral"}
              >
                {completedTasks.length}
              </Chip>
            </Tab>
            <Tab>
              Add Task{" "}
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
                border: "1px solid #CDD7E1", // Add border here
                borderRadius: "5px",
              }}
            >
              {/* TABLE HEAD BEGINS HERE */}
              <thead>
                <tr>
                  <th style={{ width: 120, padding: "12px 6px" }}>Task Name</th>
                  <th style={{ width: 60, padding: "12px 6px" }}>Created</th>
                </tr>
              </thead>

              <tbody>
                {activeTasks.map((task) => (
                  <tr key={task.task_id}>
                    <td
                      onClick={() => console.log("Task Clicked")}
                      style={{ textAlign: "left", cursor: "pointer" }}
                    >
                      {`${task.task_name}`}
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {task.date_created
                        ? new Intl.DateTimeFormat("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }).format(new Date(task.date_created))
                        : "N/A"}
                    </td>
                  </tr>
                ))}
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
                border: "1px solid #CDD7E1", // Add border here
                borderRadius: "5px",
              }}
            >
              {/* TABLE HEAD BEGINS HERE */}
              <thead>
                <tr>
                  <th style={{ width: 80, padding: "12px 6px" }}>Task Name</th>
                  <th style={{ width: 60, padding: "12px 6px" }}>Completed By</th>
                  <th style={{ width: 40, padding: "12px 6px" }}>Date Assigned</th>
                  <th style={{ width: 40, padding: "12px 6px" }}>Date Completed</th>
                </tr>
              </thead>

              <tbody>
                {completedTasks.map((task) => (
                  <tr key={task.task_id}>
                    <td
                      onClick={() => console.log("Task Clicked")}
                      style={{ textAlign: "left", cursor: "pointer" }}
                    >
                      {`${task.task_name}`}
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {task.completed_by ? task.completed_by : "N/A"}
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {task.date_created
                        ? new Intl.DateTimeFormat("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }).format(new Date(task.date_created))
                        : "N/A"}
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {task.date_completed
                        ? new Intl.DateTimeFormat("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }).format(new Date(task.date_completed))
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TabPanel>
          <TabPanel value={2}>
              <ProjectTaskForm projectid={projectid} />
           
          </TabPanel>
        </Tabs>
      </Sheet>
    </React.Fragment>
  );
};

export default ProjectTasks;
