import { Box, Button, Typography, Breadcrumbs, Link } from "@mui/joy";
import * as React from "react";
import DashboardProjects from "../components/home/DashboardProjects";
import DashboardTasks from "../components/home/DashboardTasks";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { useNavigate } from "react-router-dom";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import { DashboardQuote } from "../components/home/DashboardQuote";
import DashboardStats from "../components/home/DashboardStats";
import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from '@mui/material/styles';

const Home = () => {
  const navigate = useNavigate();
  const materialTheme = materialExtendTheme();

  return (
    <>
    <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
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
            height: "100vh",
            overflowY: "auto",
            gap: 1,
          }}
          style={{
            color: 'white',
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
                Dashboard
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
              Dashboard
            </Typography>
          </Box>

              <Box gridColumn="span 8" p={2} mt={2} boxShadow={3} borderRadius={4}>
                <Typography variant="h3" mb={2}>
                  Dashboard Stats
                </Typography>
                <DashboardStats />

                <br>
                </br>

          <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={1}>
            <Box gridColumn="span 8">
              <DashboardProjects />
            </Box>
            <Box gridColumn="span 8">
              <DashboardTasks />
            </Box>
            <Box gridColumn="span 4">
              <Box p={2} boxShadow={3} borderRadius={4}>
                <Typography variant="h3" mb={2}>
                  Home Quote
                </Typography>
                <DashboardQuote />
              </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      </MaterialCssVarsProvider>
      </>
  );
};

export default Home;
