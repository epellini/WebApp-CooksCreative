import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabaseClient } from "../../supabase-client";
import { useParams } from "react-router-dom";
import Box from "@mui/joy/Box";
import Chip from "@mui/joy/Chip";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Snackbar from "@mui/joy/Snackbar";
import Divider from "@mui/joy/Divider";
import Tooltip from "@mui/joy/Tooltip";
import Modal from "@mui/joy/Modal"
import { ModalDialog } from "@mui/joy";
import IconButton from '@mui/joy/IconButton';

import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
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
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

const TaskDetailPage = () => {
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
                size="lg" // Default to large size
                variant="soft"
                color={getStatusColor(status.name)}
                sx={{
                  fontSize: {
                    xs: '0.875rem',
                    md: '1rem'
                  },
                  height: {
                    xs: '32px',
                    md: '40px'
                  },
                  '.MuiChip-label': {
                    padding: {
                      xs: '0 10px',
                      md: '0 12px'
                    }
                  }
                }}
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
                  (ID: {project.client_id})
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
                Project Notes:
              </Typography>
              <br></br>
              {project.project_description}
            </Typography>
          </Box>

          <Box
            sx={{
              mt: {
                xs: 1,
                sm: 2,
                lg: 6,
              },
            }}
          />

          <ProjectTasks projectid={id} />

          <Images projectid={id} ref={imagesRef} />
        </Sheet>
      </Box>
    </Box>
  </CssVarsProvider>
  )
}

export default TaskDetailPage