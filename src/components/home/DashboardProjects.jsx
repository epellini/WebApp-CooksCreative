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
} from "@mui/joy";
import { useEffect, useState } from "react";
import { supabaseClient } from "../../supabase-client";
import { useNavigate } from "react-router-dom";

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
    <Sheet variant="outlined" color="neutral">
      <Grid
        container
        spacing={1}
        sx={{ maxWidth: "800px", mx: "auto", width: "100%" }}
      >
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <div style={{ gridArea: "title", placeSelf: "center" }}>
            <Typography sx={{ margin: 3 }} level="h3" component="h3">
              New Projects
            </Typography>
          </div>
        </Grid>
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
              justifyContent: "center" 
            }}
          >
            <Card
              key={project.id}
              variant="outlined"
              orientation="horizontal"
              sx={{
                width: 320,
                "&:hover": {
                  boxShadow: "md",
                  borderColor: "neutral.outlinedHoverBorder",
                },
                mb: 2,
                cursor: "pointer",
              }}
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              <AspectRatio ratio="1" sx={{ width: 70 }}>
                <img
                  src={
                    project.project_image_url ||
                    "https://via.placeholder.com/70"
                  }
                  alt={project.category.name}
                  loading="lazy"
                />
              </AspectRatio>
              <CardContent>
                <Typography
                  level="title-lg"
                  id={`card-description-${project.id}`}
                  sx={{ textAlign: "left" }}
                >
                  {project.project_name}
                </Typography>
                <Typography
                  level="body-sm"
                  aria-describedby={`card-description-${project.id}`}
                  mb={1}
                  sx={{ textAlign: "left" }}
                >
                  {project.clients.first_name} {project.clients.last_name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Sheet>
  );
}
