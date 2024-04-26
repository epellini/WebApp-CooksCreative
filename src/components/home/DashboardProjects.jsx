import * as React from "react";
import {
  AspectRatio,
  Typography,
  Link,
  Card,
  CardContent,
  Sheet,
  Stack,
  Grid,
  Chip,
  Table,
  Box,
} from "@mui/joy";
import { useEffect, useState } from "react";
import { supabaseClient } from "../../supabase-client";
import { useNavigate } from "react-router-dom";
import CardOverflow from "@mui/joy/CardOverflow";

export default function DashboardProjects() {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [status, setStatus] = useState([]);
  const [category, setCategory] = useState([]);
  const navigate = useNavigate();

  async function GetProjects() {
    const { data, error } = await supabaseClient
      .from("projects")
      .select(
        `
        *,
        clients(*),
        status(*),
        category(*),
        images(image_urls)
      `
      )
      .order("created_date", { ascending: false })
      .eq("status_id", 2);

    if (error) {
      console.error(error);
      return;
    } else {
      const projectsWithImages = data.map((project) => {
        const imageUrl =
          project.images.length > 0
            ? `https://khqunikzqiyqnqgpcaml.supabase.co/storage/v1/object/public/images/${project.images[0].image_urls}`
            : null;

        return {
          ...project,
          project_image_url: imageUrl,
        };
      });

      setProjects(projectsWithImages);
      setClients(data.map((project) => project.clients));
      setStatus(data.map((project) => project.status));
      setCategory(data.map((project) => project.category));
    }
  }

  useEffect(() => {
    GetProjects();
  }, []);

  return (
    <React.Fragment>
      {projects.length > 0 && ( 

      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: {
            xs: "block",
            sm: "block",
            md: "block",
            lg: "block",
            xl: "block",
            maxWidth: "1600px",
            mx: "auto",
            borderRadius: "sm",
            px: { xs: 2, md: 6 },
            py: { xs: 2, md: 3 },
          },
          width: "100%", // if you want to make the table full width <----- HERE
          borderRadius: "sm",
          flexShrink: 1,
          overflow: "auto",
          minHeight: 0,
        }}
      >
        <Grid container spacing={1} sx={{ m: 1 }}>
          {/* Map over the projects to create a card for each one */}
          {projects.slice(0, 6).map((project) => (
            <Grid
              key={project.project_id}
              onClick={() => navigate(`/projects/${project.project_id}`)}
              style={{ cursor: "pointer" }}
              xs={12}
              sm={6}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Card
                orientation="horizontal"
                variant="outlined"
                sx={{
                  width: "100%",
                  "&:hover": {
                    boxShadow: "md",
                    borderColor: "neutral.outlinedHoverBorder",
                  },
                  cursor: "pointer",
                }}
              >
                <CardOverflow>
                  <AspectRatio ratio="1" sx={{ width: 120 }}>
                    <img
                      src={
                        project.project_image_url ||
                        "https://via.placeholder.com/90"
                      }
                      alt={project.category.name}
                      loading="lazy"
                    />
                  </AspectRatio>
                </CardOverflow>
                <CardContent>
                  <Typography fontWeight="md" textColor="success.plainColor">
                    {project.project_name}
                  </Typography>
                  <Typography level="body-sm">
                    {project.category.name}
                  </Typography>
                  <Typography level="body-sm">
                    {project.clients?.first_name} {project.clients?.last_name}
                  </Typography>
                </CardContent>
                <CardOverflow
                  variant="soft"
                  color="primary"
                  sx={{
                    px: 0.2,
                    writingMode: "vertical-rl",
                    justifyContent: "center",
                    fontSize: "xs",
                    fontWeight: "xl",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    borderLeft: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  {project.project_id}
                </CardOverflow>
              </Card>
            </Grid>
          ))} 
        </Grid>
      </Sheet>
  )} :

    </React.Fragment>
  
    
  );
}
