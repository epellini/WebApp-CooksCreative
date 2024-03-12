import * as React from "react";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Chip from "@mui/joy/Chip";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Link from "@mui/joy/Link";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalClose from "@mui/joy/ModalClose";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import Checkbox from "@mui/joy/Checkbox";
import Badge from "@mui/joy/Badge";
import IconButton, { iconButtonClasses } from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import Dropdown from "@mui/joy/Dropdown";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import BlockIcon from "@mui/icons-material/Block";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useNavigate } from "react-router-dom";
import Autocomplete from "@mui/joy/Autocomplete";
import { MoreVertOutlined } from "@mui/icons-material";

import { useEffect, useState } from "react";
import { supabaseClient } from "../../supabase-client"; // Import the supabase client
import { Skeleton } from "@mui/joy";
import { usePagination } from "../../hooks/usePagination";

function RowMenu({ projectId }) {
  const navigate = useNavigate();

  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: "plain", color: "neutral", size: "sm" } }}
      >
        <MoreHorizRoundedIcon />
      </MenuButton>
      <Menu size="sm" sx={{ minWidth: 140 }}>
        <MenuItem onClick={() => navigate(`/projects/edit/${projectId}`)}>
          Edit
        </MenuItem>

        <Divider />
        <MenuItem onClick={() => navigate(`/projects/${projectId}`)}>
          Details
        </MenuItem>
        <Divider />
      </Menu>
    </Dropdown>
  );
}

export default function ProjectTable() {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [selected, setSelected] = useState([]);
  const [statuses, setStatus] = useState([]);
  const [categories, setCategory] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function getProjects() {
      setLoading(true); // Start loading
      const { data, error } = await supabaseClient.from("projects").select(`
          *,
          clients(*),
          status(*),
          category(*)
        `);

      if (error) {
        console.error("Error fetching projects:", error);
      } else {
        setProjects(data);
        setClients(data.map((project) => project.clients));
        setStatus(data.map((project) => project.status));
        setCategory(data.map((project) => project.category));

        const activeStatus = data.map((project) => project.status).find(status => status.name === "Active");
        setSelectedStatus(activeStatus)
 
        setLoading(false);
      }
    }
    getProjects();
  }, []);

  const filteredProjects = projects.filter((project) => {
    const clientMatches =
      !selectedClient ||
      `${project.clients.first_name} ${project.clients.last_name}`.toLowerCase() ===
      `${selectedClient.first_name} ${selectedClient.last_name}`.toLowerCase();

    const statusMatches =
      !selectedStatus ||
      project.status.name.toLowerCase() === selectedStatus.name.toLowerCase();

    const categoryMatches =
      !selectedCategory ||
      project.category.name.toLowerCase() ===
      selectedCategory.name.toLowerCase();

    return (
      clientMatches &&
      (!selectedStatus || statusMatches) &&
      (!selectedCategory || categoryMatches)
    );
  });

  const {
    currentItems: currentProjects,
    currentPage,
    totalPages,
    handlePageChange,
    handlePrevious,
    handleNext,
  } = usePagination(filteredProjects, 15);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      //select all projects
      const newSelected = projects.map((project) => project.project_id.toString());
      setSelected(newSelected);
    } else {
      //clear selection 
      setSelected([]);
    }
  }

  // const getStatusColor = (statusName) => {
  //   switch (statusName.toLowerCase()) {
  //     case "completed":
  //       return "warning";
  //     case "active":
  //       return "success";
  //     case "cancelled":
  //       return "danger";
  //   }
  // };

  return (
    <React.Fragment>
      <Sheet
        className="SearchAndFilters-mobile"
        sx={{
          display: { xs: "none", sm: "none" },
          my: 1,
          gap: 1,
        }}
      >
      </Sheet>
      <Box
        className="SearchAndFilters-tabletUp"
        sx={{
          borderRadius: "sm",
          py: 2,
          display: {
            xs: "none",
            sm: "none",
            md: "flex",
            lg: "flex",
            xl: "flex",
          },
          flexWrap: "wrap",
          gap: 1.5,
          "& > *": {
            minWidth: { xs: "120px", md: "160px" },
          },
        }}
      >
        <FormControl sx={{ flex: 1 }} size="sm">
          <FormLabel>Search By Client Name</FormLabel>
          <Autocomplete
            size="sm"
            placeholder="Search"
            options={clients.filter(
              (client, index, self) =>
                index ===
                self.findIndex(
                  (c) =>
                    c.first_name === client.first_name &&
                    c.last_name === client.last_name
                )
            )}
            getOptionLabel={(option) =>
              `${option.first_name} ${option.last_name}`
            }
            value={selectedClient}
            onChange={(event, newValue) => {
              setSelectedClient(newValue);
              setSelectedProject(
                newValue ? `${newValue.first_name} ${newValue.last_name}` : null
              ); // Update selectedProject
              console.log("Selected client:", newValue);
            }}
            // Pass the renderInput function directly to inputProps
            inputProps={{
              renderInput: (params) => <Input {...params} />,
            }}
          />
        </FormControl>
        <FormControl sx={{ flex: 1 }} size="sm">
          <FormLabel>Search By Category Name</FormLabel>
          <Autocomplete
            size="sm"
            placeholder="Search"
            options={categories.filter(
              (category, index, self) =>
                index === self.findIndex((c) => c.name === category.name)
            )}
            getOptionLabel={(option) => option.name}
            value={selectedCategory}
            onChange={(event, newValue) => {
              setSelectedCategory(newValue);
              setSelectedProject(newValue ? `${newValue.name}` : null); // Update selectedProject
              console.log("Selected category:", newValue);
            }}
            renderInput={(params) => <Input {...params} />}
          />
        </FormControl>
        <FormControl sx={{ flex: 1 }} size="sm">
          <FormLabel>Search By Status</FormLabel>
          <Autocomplete
            size="sm"
            placeholder="Search"
            options={statuses.filter(
              (status, index, self) =>
                index === self.findIndex((s) => s.name === status.name)
            )}
            getOptionLabel={(option) => option.name}
            value={selectedStatus}
            onChange={(event, newValue) => {
              setSelectedStatus(newValue);
              setSelectedProject(newValue ? `${newValue.name}` : null);
              console.log("Selected status:", newValue);
            }}
            renderInput={(params) => <Input {...params} />}
          />
        </FormControl>
      </Box>
      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: {
            xs: "none",
            sm: "none",
            md: "initial",
            lg: "initial",
            xl: "initial",
          },
          width: "100%", // if you want to make the table full width <----- HERE
          borderRadius: "sm",
          flexShrink: 1,
          overflow: "auto",
          minHeight: 0,
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          stickyHeader
          hoverRow
          sx={{
            "--TableCell-headBackground":
              "var(--joy-palette-background-level1)",
            "--Table-headerUnderlineThickness": "1px",
            "--TableRow-hoverBackground":
              "var(--joy-palette-background-level1)",
            "--TableCell-paddingY": "4px",
            "--TableCell-paddingX": "8px",
          }}
        >
          {/* TABLE HEAD BEGINS HERE */}
          <thead>
            <tr>

              <th style={{ width: 120, padding: "12px 6px" }}>
                Project
              </th>
              <th style={{ width: 100, padding: "12px 6px" }}>Client Name</th>
              <th
                style={{ width: 100, padding: "12px 6px", textAlign: "center" }}
              >
                Status
              </th>

              <th
                style={{ width: 140, padding: "12px 6px", textAlign: "left" }}
              >
                Category
              </th>

              <th
                style={{ width: 100, padding: "12px 6px", textAlign: "left" }}
              >
                Start Date
              </th>
              <th
                style={{ width: 100, padding: "12px 6px", textAlign: "left" }}
              >
                End Date
              </th>
          
              
            </tr>
          </thead>

          {/*  */}
          <tbody>
            {loading
              ? Array.from(new Array(5)).map(
                (
                  _,
                  index // Assuming 5 rows of skeletons
                ) => (
                  <tr key={index}>
                    <td style={{ textAlign: "center", width: 48 }}>
                      <Skeleton
                        variant="rectangular"
                        width={24}
                        height={24}
                      />
                    </td>
                    <td>
                      <Skeleton variant="text" width="100%" /> {/* Project */}
                    </td>
                    <td>
                      <Skeleton variant="text" width="100%" />{" "}
                      {/* Client Name */}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <Skeleton
                        variant="rectangular"
                        width="80%"
                        height={20}
                      />{" "}
                      {/* Status */}
                    </td>
                    <td>
                      <Skeleton variant="text" width="70%" />{" "}
                      {/* Start Date */}
                    </td>
                    <td>
                      <Skeleton variant="text" width="70%" /> {/* End Date */}
                    </td>
                    <td>
                      <Skeleton variant="text" width="100%" />{" "}
                      {/* Category */}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <Skeleton variant="circular" width={24} height={24} />{" "}
                      {/* Actions */}
                    </td>
                  </tr>
                )
              )
              : currentProjects.map((project) => {
                return (
                  <tr key={project.project_id}>
                    <td style={{ textAlign: "left" }}>
                      {project ? (
                        <Typography
                          level="body-xs"
                          onClick={() =>
                            navigate(`/projects/${project.project_id}`)
                          }
                          style={{ cursor: "pointer" }}
                        >{`${project.project_name}`}</Typography>
                      ) : (
                        <Typography level="body-xs">N/A</Typography>
                      )}
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {/* Displaying client's first name and last name if available */}
                      {project.clients ? (
                        <Typography
                          level="body-xs"
                          onClick={() =>
                            navigate(`/projects/${project.project_id}`)
                          }
                          style={{ cursor: "pointer" }}
                        >{`${project.clients.first_name} ${project.clients.last_name}`}</Typography>
                      ) : (
                        <Typography level="body-xs">N/A</Typography>
                      )}
                    </td>

                    <td style={{ textAlign: "center" }}>
                      <Chip
                        onClick={() =>
                          navigate(`/projects/${project.project_id}`)
                        }
                        style={{ cursor: "pointer" }}
                        variant="soft"
                        size="sm"
                        startDecorator={
                          project.status.name == "Completed" ? (
                            <CheckRoundedIcon />
                          ) : project.status.name == "Cancelled" ? (
                            <BlockIcon />
                          ) : project.status.name == "Active" ? (
                            <AutorenewRoundedIcon />
                          ) : undefined // No icon for "N/A" or other statuses
                        }
                        color={
                          project.status.name == "Completed"
                            ? "neutral"
                            : project.status.name == "Active"
                              ? "success"
                              : project.status.name == "Cancelled"
                                ? "danger"
                                : "default" // Use default color for "N/A" or other statuses
                        }
                      >
                        {project.status.name}
                      </Chip>
                    </td>

                    <td style={{ textAlign: "left" }}>
                      {project ? (
                        <Typography
                          onClick={() =>
                            navigate(`/projects/${project.project_id}`)
                          }
                          style={{ cursor: "pointer" }}
                          level="body-xs"
                        >{`${project.category.name}`}</Typography>
                      ) : (
                        <Typography level="body-xs">N/A</Typography>
                      )}
                    </td>

                    <td style={{ textAlign: "left" }}>
                      {project ? (
                        <Typography
                          onClick={() =>
                            navigate(`/projects/${project.project_id}`)
                          }
                          style={{ cursor: "pointer" }}
                          level="body-xs"
                        >{`${project.start_date}`}</Typography>
                      ) : (
                        <Typography level="body-xs">N/A</Typography>
                      )}
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {project ? (
                        <Typography
                          onClick={() =>
                            navigate(`/projects/${project.project_id}`)
                          }
                          style={{ cursor: "pointer" }}
                          level="body-xs"
                        >{`${project.end_date}`}</Typography>
                      ) : (
                        <Typography level="body-xs">N/A</Typography>
                      )}
                    </td>
                   
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </Sheet>

      {/* Mobile View Table goes here? */}
      <Sheet
        textAlign="left"
        className="OrderTableContainer-mobile"
        variant="outlined"
        sx={{
          display: {
            xs: "flex",
            sm: "flex",
            md: "none",
            lg: "none",
            xl: "none",
          },
          width: "100%",
          borderRadius: "sm",
          flexShrink: 1,
          overflow: "auto",
          minHeight: 0,
        }}
      >
        <Table
          aria-labelledby="tableTitle-mobile"
          size="small"
          sx={{
            "--TableCell-paddingY": "6px",
            "--TableCell-paddingX": "8px",
          }}
        >
          <thead>
            <tr>
              <th style={{ width: 48, textAlign: "center" }}></th>
              <th>Project</th>
              <th>Client</th>
              <th style={{ textAlign: "center" }} >Status</th>
              <th style={{ width: 48, textAlign: "center" }}></th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from(new Array(5)).map((_, index) => (
                <tr key={index}>
                  <td colSpan={5} style={{ textAlign: "left" }}>
                    <Skeleton variant="text" width="100%" height={30} />
                  </td>
                </tr>
              ))
              : currentProjects.map((project) => (
                <tr key={project.project_id}>
                  <td style={{ textAlign: "left" }}>
                    <Checkbox
                      size="sm"
                      checked={selected.includes(
                        project.project_id.toString()
                      )}
                      onChange={(event) => {
                        if (event.target.checked) {
                          setSelected([
                            ...selected,
                            project.project_id.toString(),
                          ]);
                        } else {
                          setSelected(
                            selected.filter(
                              (id) => id !== project.project_id.toString()
                            )
                          );
                        }
                      }}
                    />
                  </td>
                  <td
                    onClick={() =>
                      navigate(`/projects/${project.project_id}`)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <Typography
                      sx={{
                        textAlign: "left",
                        fontSize: {
                          xs: "0.8rem",
                          sm: "0.85rem",
                        },
                      }}
                    >
                      {project.project_name}
                    </Typography>
                  </td>
                  <td>
                    <Typography
                      sx={{
                        textAlign: "left",
                        fontSize: {
                          xs: "0.8rem",
                          sm: "0.85rem",
                        },
                      }}
                    >
                      {project.clients.first_name} {project.clients.last_name}
                    </Typography>
                  </td>
                  <td style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Badge
                      alignItems="center"
                      variant="outlined"
                      label={project.status.name}
                      // color={getStatusColor(project.status.name)}
                    />
                  </td>
                  <td>
                    <Box
                      sx={{ display: "flex", gap: 2, alignItems: "center" }}
                    >
                      {/* <Link level="body-xs" component="button" >
                        Download
                      </Link> */}
                      <RowMenu projectId={project.project_id} />
                    </Box>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Sheet>

      <Box
        className="Pagination-laptopUp"
        sx={{
          pt: 2,
          gap: 1,
          [`& .${iconButtonClasses.root}`]: { borderRadius: "50%" },
          display: {
            xs: "none",
            md: "flex",
          },
        }}
      >
        <Button
          size="sm"
          variant="outlined"
          color="neutral"
          startDecorator={<KeyboardArrowLeftIcon />}
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
          {[...Array(totalPages).keys()].map((number) => (
            <IconButton
              key={number + 1}
              size="sm"
              color="neutral"
              variant="outlined"
              onClick={() => handlePageChange(number + 1)}
              sx={{
                backgroundColor:
                  currentPage === number + 1 ? "primary.main" : "transparent",
                color:
                  currentPage === number + 1
                    ? "primary.contrastText"
                    : "inherit",
                "&:hover": {
                  backgroundColor:
                    currentPage === number + 1
                      ? "primary.dark"
                      : "action.hover",
                },
                mx: 0.5, // Add some margin for spacing
                border:
                  currentPage === number + 1
                    ? "2px solid primary.dark"
                    : "1px solid rgba(0, 0, 0, 0.23)", // Adjust for your theme
                boxShadow:
                  currentPage === number + 1 ? "palette.primary.main" : "none", // Optional: adds a glow effect for the current page
              }}
            >
              {number + 1}
            </IconButton>
          ))}
        </Box>

        <Button
          size="sm"
          variant="outlined"
          color="neutral"
          endDecorator={<KeyboardArrowRightIcon />}
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </Box>


    </React.Fragment>
  );
}
