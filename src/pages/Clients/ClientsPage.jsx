import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import List from "@mui/joy/List";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import Button from "@mui/joy/Button";
import ListItem from "@mui/joy/ListItem";
import Typography from "@mui/joy/Typography";
import ListItemButton from "@mui/joy/ListItemButton";
import { supabaseClient } from "../../supabase-client";
import ClientTable from "../../components/client/ClientTable";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const supabase = supabaseClient; // Use your Supabase client
  const navigate = useNavigate();

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
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
                href="/"
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
                Clients
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
              Clients
            </Typography>
            <Button
              onClick={() => navigate("/clients/new")}
              color="primary"
              startDecorator={<DownloadRoundedIcon />}
              size="sm"
            >
              Add Client
            </Button>
          </Box>
          <ClientTable clients={clients} />
        </Box>
      </Box>
    </CssVarsProvider>
  );
};

export default ClientsPage;