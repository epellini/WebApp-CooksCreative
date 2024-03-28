import { Box, Button, Typography, Breadcrumbs, Link, Stack } from "@mui/joy";
import * as React from "react";
import DashboardProjects from "../components/home/DashboardProjects";
import DashboardTasks from "../components/home/DashboardTasks";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { useNavigate } from "react-router-dom";
import { DashboardQuote } from "../components/home/DashboardQuote";
import DashboardStats from "../components/home/DashboardStats";
import DashboardStatsMobile from "../components/home/DashboardStatsMobile";


const Home = () => {
  const navigate = useNavigate();
  return (
    <>
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

          {/* Adjust the layout for Stats and Projects */}
          <Box sx={{ display: { xs: 'none', md: 'none', lg: 'flex' }, mt: 2, gap: 2 }}>
            {/* Projects taking up 60% */}
            <Box sx={{ flex: 6, boxShadow: 3, p: 2, borderRadius: 4,  }}>
              <Stack spacing={2} direction="column" alignItems="center">
              <DashboardProjects />
              <DashboardTasks  />
              </Stack>
            </Box>
            {/* Stats taking up 40% */}
            <Box sx={{ flex: 4, boxShadow: 3, p: 2, borderRadius: 4 }}>
              <DashboardStats />
            </Box>
          </Box>


          {/* MOBILE HERE */}

          <Box sx={{
            display: { xs: 'block', md: 'block', lg: 'none' },
            mt: 2,
            p: 2
          }}>
            <Box sx={{ mt: 2, boxShadow: 3, borderRadius: 4, p: 2 }}>
              <DashboardProjects />
            </Box>
            <Box sx={{ mt: 2, boxShadow: 3, borderRadius: 4, p: 2 }}>
              <DashboardTasks />
            </Box>
            <Box sx={{ mt: 2, boxShadow: 3, borderRadius: 4, p: 2 }}>
              <DashboardStatsMobile />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Home;