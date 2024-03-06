import React, { useState, useEffect } from "react";
import {
  Sheet,
  Tabs,
  TabList,
  TabPanel,
  Tab,
  Chip,
  Table,
} from "@mui/joy";

const TaskTableAll = ({ tasks, getTasks }) => {
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  let [days, setDays] = useState(30);

  const [members, setMembers] = React.useState([false, true, false]);
  const toggleMember = (index) => (event) => {
    const newMembers = [...members];
    newMembers[index] = event.target.checked;
    setMembers(newMembers);
  };

  const completedTasks = tasks.filter((task) => {
    const dayLength = days * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    const thirtyDaysAgoTimeStamp = Date.now() - dayLength;
  
    console.log('Task Date Created:', new Date(task.date_created).getTime());
    console.log('Thirty Days Ago:', thirtyDaysAgoTimeStamp);
  
    // Check if the task is completed and its creation date is within the last 30 days
    if (task.is_completed && new Date(task.date_created).getTime() >= thirtyDaysAgoTimeStamp) {
      return true; // Keep the task in the filtered array
    }
    return false; // Exclude the task from the filtered array
  });

  const activeTasks = tasks.filter((task) => {
    if (task.is_completed == false) {
      return task;
    }
  })

  const onHandleSubmit = () => {
    setOpen(false);
    //reload the tasks
    getTasks();
  };

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
                {activeTasks.map((task) => (
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
        </Tabs>
      </Sheet>
    </React.Fragment>
  );
};

export default TaskTableAll;