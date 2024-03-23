import { Box, Button, Typography, Breadcrumbs, Link } from "@mui/joy";
import * as React from "react";
import DashboardProjects from "../components/home/DashboardProjects";
import DashboardTasks from "../components/home/DashboardTasks";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { useNavigate } from "react-router-dom";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";

const Home = () => {
  // const {user} = useAuth();
  // const {signout} = useAuth();

  // const handleLogout = () => {
  //   signout();
  // }

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
            <Button
              onClick={() => navigate("/")}
              color="primary"
              startDecorator={<DownloadRoundedIcon />}
              size="sm"
            >
              Something Button
            </Button>
          </Box>

          <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={1}>
            <Box gridColumn="span 8">
              <DashboardProjects />
            </Box>
            <Box gridColumn="span 8">
              <DashboardTasks />
            </Box>

         
          </Box>
        </Box>
      </Box>
    </CssVarsProvider>
  );
};

export default Home;
