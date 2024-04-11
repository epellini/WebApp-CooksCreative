import React, { useState, useEffect } from "react";
import { LinearProgress, Typography, Stack, Box } from "@mui/joy"; // Import Joy UI components
import { supabaseClient } from "../../supabase-client"; // Import the supabase client
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart"; // Make sure to import BarChart

import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";

const DashboardStats = () => {
  const materialTheme = materialExtendTheme();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectStatusCounts, setProjectStatusCounts] = useState([]);
  const [projectsByMonth, setProjectsByMonth] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to count projects by their status
  const countProjectsByStatus = (projects, statuses) => {
    const statusCounts = statuses.reduce((acc, status) => {
      acc[status.name] = 0;
      return acc;
    }, {});

    projects.forEach((project) => {
      const statusName = statuses.find(
        (status) => status.status_id === project.status_id
      )?.name;
      if (statusName) {
        statusCounts[statusName]++;
      }
    });

    return Object.entries(statusCounts).map(([label, value], id) => ({
      id,
      value,
      label,
    }));
  };

  // Function to format month names
  const getMonthName = (monthIndex) => {
    return new Date(0, monthIndex, 1).toLocaleString("default", {
      month: "long",
    });
  };

  // Function to group projects by month
  const groupProjectsByMonth = (projects) => {
    const projectCounts = projects.reduce((acc, project) => {
      const month = new Date(project.end_date).getMonth();
      const year = new Date(project.end_date).getFullYear();
      const monthYear = `${getMonthName(month)} ${year}`;
      acc[monthYear] = (acc[monthYear] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(projectCounts).map(([month, count], index) => ({
      id: index,
      month,
      projects: count,
    }));
  };

  // Fetch tasks, projects, and statuses from Supabase
  async function fetchTasksAndProjects() {
    setLoading(true);
    try {
      const { data: tasksData, error: tasksError } = await supabaseClient
        .from("tasks")
        .select("*");
      const { data: projectsData, error: projectsError } = await supabaseClient
        .from("projects")
        .select("*");
      const { data: statusesData, error: statusesError } = await supabaseClient
        .from("status")
        .select("*");

      if (tasksError) throw tasksError;
      if (projectsError) throw projectsError;
      if (statusesError) throw statusesError;

      setTasks(tasksData);
      setProjects(projectsData);
      setProjectStatusCounts(countProjectsByStatus(projectsData, statusesData));
      setProjectsByMonth(groupProjectsByMonth(projectsData));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasksAndProjects();
  }, []);

  if (loading) {
    return <LinearProgress />;
  }

  // Customize value formatting for BarChart
  const valueFormatter = (value) => `${value} Projects`;

  return (
    <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
      <Stack spacing={2} direction="column" alignItems="center">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            p: 2,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "md",
            width: "100%",
            maxWidth: "sm",
          }}
        >
          {projects.length === 0 ? (
            <Typography variant="h6" align="center">
              No projects found
            </Typography>
          ) : (
            <Typography
              component="div"
              sx={{ fontWeight: "bold", fontSize: "1.25rem" }}
            >
              Total Projects:{" "}
              <span style={{ fontSize: "1.5rem" }}>{projects.length}</span>
            </Typography>
          )}
          {tasks.length === 0 ? (
            <Typography variant="h6" align="center">
              No tasks found
            </Typography>
          ) : (
            <Typography
              component="div"
              sx={{ fontWeight: "bold", fontSize: "1.25rem" }}
            >
              Total Tasks:{" "}
              <span style={{ fontSize: "1.5rem" }}>{tasks.length}</span>
            </Typography>
          )}
        </Box>

        {/* PieChart */}
        {projects.length > 0 && (
          <Box
            sx={{
              p: 2,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "md",
              width: "100%",
              maxWidth: "md",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <PieChart
              series={[
                {
                  data: projectStatusCounts,
                  innerRadius: 30,
                  outerRadius: 90,
                  paddingAngle: 5,
                  cornerRadius: 5,
                },
              ]}
              width={400}
              height={200}
            />
          </Box>
        )}

        {/* BarChart */}
        {/* BarChart */}
        {projectsByMonth.length > 0 && (
          <Box
            sx={{
              p: 2,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "md",
              width: "100%",
              maxWidth: "lg",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <BarChart
              dataset={projectsByMonth}
              yAxis={[{ scaleType: "band", dataKey: "month" }]}
              series={[
                {
                  dataKey: "projects",
                  label: "Projects by Month",
                  valueFormatter,
                },
              ]}
              layout="horizontal"
              width={500}
              height={280}
              margin={{ left: 100 }}
            />
          </Box>
        )}
      </Stack>
    </MaterialCssVarsProvider>
  );
};

export default DashboardStats;
