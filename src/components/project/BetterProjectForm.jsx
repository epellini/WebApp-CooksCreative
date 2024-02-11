import React, { useState, useEffect } from "react";

import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import IconButton from "@mui/joy/IconButton";
import Textarea from "@mui/joy/Textarea";
import Stack from "@mui/joy/Stack";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Typography from "@mui/joy/Typography";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import Card from "@mui/joy/Card";
import CardActions from "@mui/joy/CardActions";
import CardOverflow from "@mui/joy/CardOverflow";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

import Autocomplete from "@mui/joy/Autocomplete";

import DropZone from "../DropZone";
import FileUpload from "../FileUpload";

//Thomas added imports
import { useNavigate, useParams } from "react-router-dom";
import { supabaseClient } from "../../supabase-client";

const BetterProjectForm = () => {
  const [project, setProject] = useState({
    project_name: "",
    client_id: "",
    project_description: "",
    start_date: "",
    end_date: "",
    status_id: "",
    category_id: "",
  });
  const [clients, setClients] = useState([]);
  const [status, setStatus] = useState([{}]);
  const [category, setCategory] = useState([{}]);
  const [loading, setLoading] = useState(true);
  const { projectid } = useParams();
  const navigate = useNavigate();
  const supabase = supabaseClient;

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const { data: projectsData, error: projectsError } = await supabase
          .from("projects")
          .select("*")
          .eq("project_id", projectid || "")
          .single();

        const { data: clientsData, error: clientsError } = await supabase
          .from("clients")
          .select("*")
          .order("first_name", { ascending: true });

        const { data: statusData, error: statusesError } = await supabase
          .from("status")
          .select("*")
          .order("status_id", { ascending: true });
        const { data: categoryData, error: categoryError } = await supabase
          .from("category")
          .select("*")
          .order("category_id", { ascending: true });

        if (projectsError) {
          console.error("Error fetching project:", projectsError);
        } else {
          setProject(projectsData || {});
        }

        if (clientsError) {
          console.error("Error fetching clients:", clientsError);
        } else {
          setClients(clientsData || []);
        }
        if (statusesError) {
          console.error("Error fetching statuses:", statusesError);
        } else {
          setStatus(statusData || []);
        }
        if (categoryError) {
          console.error("Error fetching categories:", categoryError);
        } else {
          setCategory(categoryData || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [projectid]);
  const handleChange = (e, value, name) => {
    // Check if e is null or undefined
    console.log("value", value);
    console.log("e", e);
    console.log("name", name);

    if (!e) {
      return;
    }
    // Check if value is null or undefined before updating the state
    if (value !== null && value !== undefined) {
      // Handle select change
      setProject((prevState) => ({
        ...prevState,
        [name]: value, // Use the name parameter to dynamically set the state key
      }));
    } else if (e.target) {
      // Handle input change
      const { name, value } = e.target;
      setProject((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (project.project_name.trim() !== "") {
      try {
        let result = null;
        if (projectid) {
          result = await supabase
            .from("projects")
            .update(project)
            .eq("project_id", projectid);
        } else {
          const { data, error } = await supabase
            .from("projects")
            .insert([project]);
          result = { data, error };
        }
        if (result.error) {
          console.error("Error adding project:", result.error);
        } else {
          navigate("/projects");
          console.log("Project added successfully");
        }
      } catch (error) {
        console.error("Error adding project:", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ flex: 1, width: "100%" }}>
        <Box
          sx={{
            position: "sticky",
            top: { sm: -100, md: -110 },
            bgcolor: "background.body",
            zIndex: 9995,
          }}
        >
          <Box sx={{ px: { xs: 2, md: 6 } }}>
            <Breadcrumbs
              size="sm"
              aria-label="breadcrumbs"
              //separator={<ChevronRightRoundedIcon fontSize="sm" />}
              sx={{ pl: 0 }}
            >
              <Link underline="none" color="neutral" href="/" aria-label="Home">
                <HomeRoundedIcon />
              </Link>
              <Link
                underline="hover"
                color="neutral"
                href="/projects"
                fontSize={12}
                fontWeight={500}
              >
                Projects
              </Link>
              <Typography color="primary" fontWeight={500} fontSize={12}>
                {projectid ? "Update Project" : "Add Project"}
              </Typography>
            </Breadcrumbs>
            <Typography level="h2" component="h1" sx={{ mt: 1, mb: 2 }}>
              {projectid ? "Update Project" : "Add Project"}
            </Typography>
          </Box>
        </Box>
        <Stack
          spacing={4}
          sx={{
            display: "flex",
            maxWidth: "900px",
            mx: "auto",
            px: { xs: 2, md: 6 },
            py: { xs: 2, md: 3 },
          }}
        >
          <Card>
            <Box sx={{ mb: 1 }}>
              <Typography level="title-md">Project Information</Typography>
              <Typography level="body-sm">
                Add a title, description, and other details to your project.
              </Typography>
            </Box>
            <Divider />
            <Stack
              direction="row"
              spacing={3}
              sx={{ display: { xs: "none", md: "flex" }, my: 1 }}
            >
              <Stack direction="column" spacing={1}></Stack>
              <Stack spacing={2} sx={{ flexGrow: 2 }}>
                <Stack direction="row" spacing={2}>
                  <FormControl sx={{ flexGrow: 1 }}>
                    <FormLabel>Project Name</FormLabel>
                    <Input
                      size="sm"
                      type="text"
                      id="project_name"
                      name="project_name"
                      value={project.project_name}
                      onChange={handleChange} // Pass the event object directly
                      required
                    />
                  </FormControl>

                  <FormControl sx={{ flexGrow: 1 }}>
                    <FormLabel>Client Name</FormLabel>
                    <Autocomplete
                      id="client_id"
                      name="client_id"
                      options={clients}
                      getOptionLabel={(option) => option.first_name + " " + option.last_name + " "  + "(ID: " + option.client_id + ")"}
                      value={
                        clients.find(
                          (client) => client.client_id === project.client_id
                        ) || null
                      }
                      onChange={(e, value) =>
                        handleChange(
                          e,
                          value ? value.client_id : null,
                          "client_id"
                        )
                      }
                      renderInput={(params) => (
                        <Input
                          {...params}
                          size="sm"
                          id="client_id"
                          name="client_id"
                          required
                        />
                      )}
                    />
                  </FormControl>
                </Stack>

                <Stack spacing={1}>
                  {/* <FormLabel>Project Name</FormLabel>
                <FormControl
                  sx={{
                    display: { sm: "flex-column", md: "flex-row" },
                    gap: 2,
                  }}
                >
                  <Input size="sm" sx={{ flexGrow: 1 }} />
                </FormControl> */}
                  <Box>
                    <FormLabel htmlFor="start_date">Start Date</FormLabel>
                    <Input
                      id="start_date"
                      name="start_date"
                      type="date"
                      value={project.start_date}
                      onChange={handleChange}
                      required
                    />
                  </Box>
                  <Box>
                    <FormLabel htmlFor="end_date">End Date</FormLabel>
                    <Input
                      id="end_date"
                      name="end_date"
                      type="date"
                      value={project.end_date}
                      onChange={handleChange}
                      required
                    />
                  </Box>

                  <FormLabel>Project Description</FormLabel>
                  <FormControl
                    sx={{
                      display: { sm: "flex-column", md: "flex-row" },
                      gap: 2,
                    }}
                  >
                    <Textarea
                      size="sm"
                      minRows={4}
                      sx={{ flexGrow: 1 }}
                      id="project_description"
                      name="project_description"
                      value={project.project_description}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                </Stack>

                {/* <ListDivider component="hr" /> */}

                {/* <Stack direction="row" spacing={2}>
                <FormControl>
                  <FormLabel>Role</FormLabel>
                  <Input size="sm" defaultValue="UI Developer" />
                </FormControl>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    size="sm"
                    type="email"
                    startDecorator={<EmailRoundedIcon />}
                    placeholder="email"
                    defaultValue="siriwatk@test.com"
                    sx={{ flexGrow: 1 }}
                  />
                </FormControl>
              </Stack> */}

                <Stack direction="row" spacing={2}>
                  <FormControl sx={{ flexGrow: 1 }}>
                    <FormLabel>Status</FormLabel>
                    <Select
                      placeholder="Select Status"
                      id="status_id"
                      name="status_id" // Add the name attribute
                      value={project.status_id}
                      onChange={(e, value) =>
                        handleChange(e, value, "status_id")
                      } // Pass the name along with the value
                      required
                    >
                      {status.map((statusOption) => (
                        <Option
                          key={statusOption.status_id}
                          value={statusOption.status_id}
                          selected={
                            statusOption.status_id === project.status_id
                          } // Set selected attribute
                        >
                          {statusOption.name}
                        </Option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl sx={{ flexGrow: 1 }}>
                    <FormLabel>Project Category</FormLabel>
                    <Select
                      placeholder="Select Category"
                      id="category_id"
                      name="category_id" // Add the name attribute
                      value={project.category_id}
                      onChange={(e, value) =>
                        handleChange(e, value, "category_id")
                      } // Pass the name along with the value
                      required
                    >
                      {category.map((categoryOption) => (
                        <Option
                          key={categoryOption.category_id}
                          value={categoryOption.category_id}
                          selected={
                            categoryOption.category_id === project.category_id
                          } // Set selected attribute
                        >
                          {categoryOption.name}
                        </Option>
                      ))}
                      <Option value="1">Kitchen</Option>
                      <Option value="2">Bathroom</Option>
                      <Option value="3">Living Room</Option>
                    </Select>
                  </FormControl>
                </Stack>

                <div></div>
              </Stack>
            </Stack>
            <Stack
              direction="column"
              spacing={2}
              sx={{ display: { xs: "flex", md: "none" }, my: 1 }}
            >
              <Stack direction="row" spacing={2}>
                <Stack direction="column" spacing={1}>
                  <AspectRatio
                    ratio="1"
                    maxHeight={108}
                    sx={{ flex: 1, minWidth: 108, borderRadius: "100%" }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
                      srcSet="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286&dpr=2 2x"
                      loading="lazy"
                      alt=""
                    />
                  </AspectRatio>
                  <IconButton
                    aria-label="upload new picture"
                    size="sm"
                    variant="outlined"
                    color="neutral"
                    sx={{
                      bgcolor: "background.body",
                      position: "absolute",
                      zIndex: 2,
                      borderRadius: "50%",
                      left: 85,
                      top: 180,
                      boxShadow: "sm",
                    }}
                  >
                    <EditRoundedIcon />
                  </IconButton>
                </Stack>

                <Stack spacing={1} sx={{ flexGrow: 1 }}>
                  <FormLabel>Name</FormLabel>
                  <FormControl
                    sx={{
                      display: {
                        sm: "flex-column",
                        md: "flex-row",
                      },
                      gap: 2,
                    }}
                  ></FormControl>
                </Stack>
              </Stack>

              <FormControl>
                <FormLabel>Role</FormLabel>
                <Input size="sm" defaultValue="UI Developer" />
              </FormControl>
              <FormControl sx={{ flexGrow: 1 }}>
                <FormLabel>Email</FormLabel>
                <Input
                  size="sm"
                  type="email"
                  startDecorator={<EmailRoundedIcon />}
                  placeholder="email"
                  defaultValue="siriwatk@test.com"
                  sx={{ flexGrow: 1 }}
                />
              </FormControl>

              <div>
                <FormControl sx={{ display: { sm: "contents" } }}>
                  <FormLabel>Timezone</FormLabel>
                  <Select
                    size="sm"
                    startDecorator={<AccessTimeFilledRoundedIcon />}
                    defaultValue="1"
                  >
                    <Option value="1">
                      Indochina Time (Bangkok){" "}
                      <Typography textColor="text.tertiary" ml={0.5}>
                        — GMT+07:00
                      </Typography>
                    </Option>
                    <Option value="2">
                      Indochina Time (Ho Chi Minh City){" "}
                      <Typography textColor="text.tertiary" ml={0.5}>
                        — GMT+07:00
                      </Typography>
                    </Option>
                  </Select>
                </FormControl>
              </div>
            </Stack>
            <CardOverflow
              sx={{ borderTop: "1px solid", borderColor: "divider" }}
            >
              <CardActions sx={{ alignSelf: "flex-end", pt: 2 }}>
                <Button
                  size="sm"
                  variant="outlined"
                  color="neutral"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button size="sm" variant="solid" type="submit">
                  {projectid ? "Update Project" : "Add Project"}
                </Button>
              </CardActions>
            </CardOverflow>
          </Card>

          <Card>
            <Box sx={{ mb: 1 }}>
              <Typography level="title-md">Project Images</Typography>
              <Typography level="body-sm">
                Add before and after images here to showcase your project.
              </Typography>
            </Box>
            <Divider />
            <Stack spacing={2} sx={{ my: 1 }}>
              <DropZone />
              <FileUpload
                icon={<InsertDriveFileRoundedIcon />}
                fileName="kitchen-before.png"
                fileSize="200 kB"
                progress={100}
              />
              <FileUpload
                icon={<VideocamRoundedIcon />}
                fileName="kitchen-after.png"
                fileSize="1 MB"
                progress={40}
              />
            </Stack>
            <CardOverflow
              sx={{ borderTop: "1px solid", borderColor: "divider" }}
            >
              <CardActions sx={{ alignSelf: "flex-end", pt: 2 }}>
                <Button size="sm" variant="outlined" color="neutral">
                  Cancel
                </Button>
                <Button size="sm" variant="solid" type="submit">
                  {projectid ? "Update Project" : "Add Project"}
                </Button>
              </CardActions>
            </CardOverflow>
          </Card>
        </Stack>
      </Box>
    </form>
  );
};

export default BetterProjectForm;
