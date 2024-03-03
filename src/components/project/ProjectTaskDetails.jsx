import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import Stack from "@mui/joy/Stack";
import Card from "@mui/joy/Card";

import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import { Css } from "@mui/icons-material";
import React, { useState, useEffect } from "react";

import { supabaseClient } from "../../supabase-client";

const supabase = supabaseClient;


const ProjectTaskDetails = ({ projectid }) => {
  const [tasks, setTasks] = useState([]);
  const id = projectid;
  async function getTasks() {
    console.log(id);
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("project_id", id)
      .order("task_id", { ascending: true });

    if (error) {
      console.error("Error fetching tasks:", error);
    } else {
      setTasks(data);
    }
  }

    useEffect(() => {
        getTasks();
        }
    , [projectid]);

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100dvh" }}>
        <Box
          component="main"
          className="MainContent"
          sx={{
            px: { xs: 2, md: 6 },
            pt: {
              xs: "calc(12px + var(--Header-height))",
              sm: "calc(12px + var(--Header-height))",
              md: 3,
            },
            pb: { xs: 2, sm: 2, md: 3 },
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            height: "100dvh",
            gap: 1,
          }}
        >
          <Divider />
          <Box
            sx={{
              display: "flex",
              mb: 1,
              gap: 1,
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "start", sm: "center" },
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <Typography level="h2" component="h1">
              Tasks
            </Typography>
          </Box>
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
                    <Typography level="body-sm">
                      Task Name: {task.task_name}
                    </Typography>
                    <Typography level="body-md">
                      Task ID: {task.task_id}
                    </Typography>
                    <Typography level="body-sm">
                      Task Status: {task.is_completed ? "Yes" : "No"}
                    </Typography>
                  </Stack>
                  <Stack spacing={2} sx={{ flexGrow: 1 }}>
                    <Stack spacing={1}></Stack>
                  </Stack>
                </Stack>
              ))}
            </Stack>
        </Box>
      </Box>
    </CssVarsProvider>
  );
};

export default ProjectTaskDetails;
