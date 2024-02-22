import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useNavigate, Link } from "react-router-dom";
import { supabaseClient } from "../../supabase-client";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import {
  CssVarsProvider,
  Typography,
  Sheet,
  Button,
  ListItem,
  List,
  Box,
  Card,
  CardContent,
  Grid,
  Breadcrumbs,
  Divider,
  Chip,
  Avatar,
  Tooltip,
  IconButton,
  Snackbar,
  AspectRatio,
  FormLabel,

} from "@mui/joy";
import ProjectDetailComp from "../../components/project/ProjectDetailComp";

const ProjectDetails = () => {
  // const [project, setProject] = useState([]);
  // const navigate = useNavigate();
  // const supabase = supabaseClient;

  // useEffect(() => {
  //   getProject();
  // }, []); // Fetch projects when the component mounts

  // async function deleteProject(project_id) {
  //   const { error } = await supabase.from("projects").delete().match({ project_id });
  //   if (error) {
  //     console.error("Error deleting project:", error);
  //   } else {
  //     console.log("Project deleted successfully");
  //     // navigate back to the projects page
  //     navigate("/projects");
  //   }
  // }

  // // Get specific project using id from the url
  // async function getProject() {
  //   const id = window.location.pathname.split("/")[2];
  //   const { data } = await supabase.from("projects").select("*").eq("project_id", id);
  //   setProject(data);
  // }

  return (
    <>
     <CssVarsProvider disableTransitionOnChange>
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
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Breadcrumbs
            size="sm"
            aria-label="breadcrumbs"
            separator={<ChevronRightRoundedIcon fontSize="sm" />}
            sx={{ pl: 0 }}
          >
            <Link
              underline="none"
              color="neutral"
              href="#some-link"
              aria-label="Home"
            >
              <HomeRoundedIcon />
            </Link>
            <Link
              underline="hover"
              color="neutral"
              to={"/"}
              fontSize={12}
              fontWeight={500}
            >
              Dashboard
            </Link>

            <Typography color="primary" fontWeight={500} fontSize={12}>
              Project Details
            </Typography>
          </Breadcrumbs>
        </Box>
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
          Project Details
        </Typography>

        {/* THOMAS: MAYBE WE ADD NAVIGATION TO THE PROJECTS CLIENT PROFILE PAGE? */}
        <Button 
        onClick={() => navigate('/')} 
        color="primary"
        startDecorator={<AssignmentIndIcon />}
        size="sm"
        >
          See Client Profile
        </Button>
      </Box>

      <ProjectDetailComp />
     
    </Box>
    </Box>
    </CssVarsProvider>
    </>
  );
};

export default ProjectDetails;
