import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabaseClient } from "../../supabase-client";
import { useParams } from "react-router-dom";
import Box from "@mui/joy/Box";
import Chip from "@mui/joy/Chip";
import Card from "@mui/joy/Card";
import CardOverflow from "@mui/joy/CardOverflow";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Snackbar from "@mui/joy/Snackbar";
import AspectRatio from "@mui/joy/AspectRatio";
import Divider from "@mui/joy/Divider";
import Avatar from "@mui/joy/Avatar";
import Tooltip from "@mui/joy/Tooltip";
import Badge from "@mui/joy/Badge";
import Modal from "@mui/joy/Modal"
import { ModalDialog } from "@mui/joy";
import IconButton from '@mui/joy/IconButton';

import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ForwardToInboxRoundedIcon from "@mui/icons-material/ForwardToInboxRounded";
import FolderIcon from "@mui/icons-material/Folder";
import ReplyRoundedIcon from "@mui/icons-material/ReplyRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ProjectTasks from "../../components/project/ProjectTasks";

import Images from "../../components/Images/Images";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

export default function ProjectDetailsPage() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [project, setProject] = useState({
    project_name: "",
    client_id: null,
    project_description: "",
    start_date: "",
    end_date: "",
    status_id: null,
    category_id: null,
  });
  const [client, setClient] = useState({
    client: {
      id: null,
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      notes: "",
      tag: "",
    },
  });
  const [status, setStatus] = useState({
    status: {
      category_id: null,
      name: "",
    },
  });

  const [category, setCategory] = useState({
    category: {
      id: null,
      name: "",
    },
  });

  const navigate = useNavigate();
  const supabase = supabaseClient;
  const { id } = useParams();
  const imagesRef = React.useRef(null);

  const getStatusColor = (statusName) => {
    if (!statusName) return "default"; // Handle undefined or empty string
    switch (statusName.toLowerCase()) {
      case "completed":
        return "warning";
      case "active":
        return "success";
      case "cancelled":
        return "danger";
      default:
        return "default"; // Default case if statusName is not matched
    }
  };

  useEffect(() => {
    const getProject = async () => {
      if (id) {
        const { data: projectData, error: projectError } = await supabase
          .from("projects")
          .select("*")
          .eq("project_id", id)
          .single();
        if (projectError) {
          console.log("Error fetching project details:", projectError.message);
        } else {
          setProject(projectData);
        }

        const { data: clientData, error: clientError } = await supabase
          .from("clients")
          .select("*")
          .eq("client_id", projectData.client_id)
          .single();
        console.log(clientData);
        if (clientError) {
          console.log("Error fetching client details:", clientError.message);
        } else {
          setClient(clientData);
        }

        const { data: statusData, error: statusError } = await supabase
          .from("status")
          .select("*")
          .eq("status_id", projectData.status_id)
          .single();
        if (statusError) {
          console.log("Error fetching status details:", statusError.message);
        } else {
          setStatus(statusData);
        }

        const { data: taskData, error: taskError } = await supabase
          .from("tasks")
          .select("*")
          .order("task_id", { ascending: false });
        if (taskError) {
          console.log("Error fetching task details:", taskError.message);
        } else {
          console.log(taskData);
        }

        const { data: categoryData, error: categoryError } = await supabase
          .from("category")
          .select("*")
          .eq("category_id", projectData.category_id)
          .single();
        if (categoryError) {
          console.log(
            "Error fetching category details:",
            categoryError.message
          );
        } else {
          setCategory(categoryData);
        }
      }
    };
    getProject();
  }, []); // Fetch projects when the component mounts

  async function deleteProject(project_id) {
    const { error } = await supabase
      .from("projects")
      .delete()
      .match({ project_id });
    if (error) {
      console.error("Error deleting project:", error);
    } else {
      console.log("Project deleted successfully");
      // navigate back to the projects page
      navigate("/projects");
    }
  }

  const [open, setOpen] = React.useState([false, false, false]);

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

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
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
          overflowY: "auto",
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
            <Link underline="none" color="neutral" href="/" aria-label="Home">
              <HomeRoundedIcon />
            </Link>
            <Typography color="primary" fontWeight={500} fontSize={12}>
              <Link href="/projects">Projects</Link>
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
        ></Box>

        <Box sx={{ display: "flex" }}>
          <Sheet
            variant="outlined"
            sx={{
              minHeight: 500,
              width: "100%",
              borderRadius: "sm",
              p: 2,
              mb: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  level="h2"
                  textColor="text.primary"
                  mb={0.5}
                  sx={{ paddingRight: 3 }}
                >
                  {project.project_name}
                </Typography>
                <Chip
                  size="lg"
                  variant="soft"
                  color={getStatusColor(status.name)}
                >
                  {status.name}
                </Chip>
                <Box sx={{ ml: 2 }}></Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  height: "32px",
                  flexDirection: "row",
                  gap: 1.5,
                }}
              >
                {/* For small screens */}
                <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                  <IconButton
                    size="sm"
                    color="neutral"
                    variant="soft"
                    onClick={() => navigate(`/projects/edit/${project.project_id}`)}
                  >
                    <EditNoteIcon />
                  </IconButton>
                </Box>

                {/* For larger screens */}
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                  <Button
                    size="sm"
                    variant="soft"
                    color="neutral"
                    startDecorator={<EditNoteIcon />}
                    onClick={() => navigate(`/projects/edit/${project.project_id}`)}
                  >
                    Update Project
                  </Button>
                </Box>

                {/* For small screens */}
                <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                  <IconButton
                    size="sm"
                    color="primary"
                    variant="soft"
                    onClick={() => imagesRef.current.triggerFileInputClick()}
                  >
                    <AddPhotoAlternateIcon />
                  </IconButton>
                </Box>

                {/* For larger screens*/}
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                  <Button
                    size="sm"
                    variant="soft"
                    color="primary"
                    startDecorator={<AddPhotoAlternateIcon />}
                    onClick={() => imagesRef.current.triggerFileInputClick()}
                  >
                    Add Image
                  </Button>
                </Box>

                <Snackbar
                  color="success"
                  open={open[1]}
                  onClose={() => handleSnackbarClose(1)}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  startDecorator={<CheckCircleRoundedIcon />}
                  endDecorator={
                    <Button
                      onClick={() => handleSnackbarClose(1)}
                      size="sm"
                      variant="soft"
                      color="neutral"
                    >
                      Dismiss
                    </Button>
                  }
                >
                  Your project has been edited.
                </Snackbar>

                {/* For small screens */}
                <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                  <IconButton
                    size="sm"
                    color="danger"
                    variant="soft"
                    onClick={() => setIsDeleteModalOpen(true)}
                  >
                    <DeleteRoundedIcon />
                  </IconButton>
                </Box>

                {/* For larger screens: */}
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                  <Button
                    size="sm"
                    variant="soft"
                    color="danger"
                    startDecorator={<DeleteRoundedIcon />}
                    onClick={() => setIsDeleteModalOpen(true)}
                  >
                    Delete
                  </Button>
                </Box>
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
                      Are you sure you want to delete this project?{' '}
                      <br />
                      This action cannot be undone.
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                      <Button variant="outlined" color="neutral" onClick={() => setIsDeleteModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button variant="solid" color="danger" onClick={() => { deleteProject(project.project_id); setIsDeleteModalOpen(false); }}>
                        Delete
                      </Button>
                    </Box>
                  </ModalDialog>
                </Modal>
                <Snackbar
                  color="danger"
                  open={open[2]}
                  onClose={() => handleSnackbarClose(2)}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  startDecorator={<CheckCircleRoundedIcon />}
                  endDecorator={
                    <Button
                      onClick={() => handleSnackbarClose(2)}
                      size="sm"
                      variant="soft"
                      color="neutral"
                    >
                      Dismiss
                    </Button>
                  }
                >
                  Your project has been deleted.
                </Snackbar>
              </Box>
            </Box>
            <Divider sx={{ mt: 2 }} />
            <Box
              sx={{
                py: 2,
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "start",
              }}
            >
              <Box
                sx={{
                  flexBasis: "60%", // Assign 60% of the width to this container
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                }}
              >
                <Typography level="title-md" textColor="text.primary">
                  Client: {client.first_name} {client.last_name}
                  <Typography
                    variant="body2"
                    component="span"
                    display="inline"
                    style={{ fontSize: "smaller" }}
                  >
                    (Client ID: {project.client_id})
                  </Typography>
                </Typography>
                <Box
                  sx={{
                    mt: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <Typography
                      level="title-md"
                      textColor="text.primary"
                      component="span"
                      sx={{ mr: 1, display: "inline-block" }}
                    >
                      Project Start Date:
                    </Typography>
                    <Tooltip size="sm" variant="outlined">
                      <Chip size="sm" variant="soft" color="primary">
                        {project.start_date}
                      </Chip>
                    </Tooltip>
                  </div>
                  <div>
                    <Typography
                      component="span"
                      level="title-md"
                      textColor="text.primary"
                      sx={{ mr: 1, display: "inline-block" }}
                    >
                      Project End Date:
                    </Typography>
                    <Tooltip size="sm" variant="outlined">
                      <Chip size="sm" variant="soft" color="primary">
                        {project.end_date}
                      </Chip>
                    </Tooltip>
                  </div>
                </Box>

                <Typography
                  mt={1}
                  level="title-md"
                  textColor="text.primary"
                  component="span"
                  sx={{ mr: 1, display: "inline-block" }}
                >
                  Project Category: {category.name}
                </Typography>
              </Box>

              <Typography textAlign="left" level="body-sm" mt={2} mb={2}>
                <Typography level="title-md" textColor="text.primary" mb={1}>
                  Project Description:
                </Typography>
                <br></br>
                {project.project_description}
              </Typography>
            </Box>

            <Box
              sx={{
                mt: {
                  xs: 1, // On extra small and small screens
                  sm: 2, // On small screens
                  lg: 6, // On large screens and above
                },
              }}
            />

            <ProjectTasks projectid={id} />

            <Images projectid={id} ref={imagesRef} />
          </Sheet>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
