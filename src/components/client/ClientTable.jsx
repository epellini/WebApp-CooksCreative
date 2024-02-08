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
import IconButton, { iconButtonClasses } from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import Dropdown from "@mui/joy/Dropdown";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import BlockIcon from "@mui/icons-material/Block";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Grid from "@mui/joy/Grid";
import Stack from "@mui/joy/Stack";
import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import { supabaseClient } from "../../supabase-client"; // Import the supabase client
import { Skeleton } from "@mui/joy";

function RowMenu({ clientId }) {
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
        <MenuItem onClick={() => navigate(`/client/edit/${clientId}`)}>
          Edit
        </MenuItem>

        <Divider />
        <MenuItem onClick={() => navigate(`/clients/${clientId}`)}>
          Details
        </MenuItem>
      </Menu>
    </Dropdown>
  );
}

export default function ClientTable() {
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState([]);
  const [status, setStatus] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function getClients() {
      setLoading(true); // Begin loading state

      try {
        // Replace 'projects(*)' with the actual relationship path if it differs
        const { data: clientsData, error } = await supabaseClient.from(
          "clients"
        ).select(`
          *,
          projects(*) 
        `);

        if (error) {
          throw error;
        }

        // Assuming 'clientsData' now contains each client with their related projects
        setClients(clientsData);
      } catch (error) {
        console.error("Error fetching data: ", error.message);
      } finally {
        setLoading(false); // End loading state
      }
    }

    getClients();
  }, []);

  // FILTERS
  const renderFilters = () => (
    <React.Fragment>
      <FormControl size="sm">
        {/* WILL NEED TO POPULATE THIS WITH DB DATA */}
        <FormLabel>Status</FormLabel>
        <Select
          size="sm"
          placeholder="Filter by status"
          slotProps={{ button: { sx: { whiteSpace: "nowrap" } } }}
        >
          <Option value="completed">Completed</Option>
          <Option value="in-progress">In Progress</Option>
          <Option value="pending-approval">Pending Approval</Option>
          <Option value="cancelled">Cancelled</Option>
          <Option value="refunded">Refunded</Option>
        </Select>
      </FormControl>
      <FormControl size="sm">
        {/* WILL NEED TO POPULATE THIS WITH DB DATA */}
        <FormLabel>Category</FormLabel>
        <Select size="sm" placeholder="All">
          <Option value="all">All</Option>
          <Option value="refund">General Home</Option>
          <Option value="purchase">Tiny Homes</Option>
          <Option value="debit">Additions</Option>
          <Option value="debit">Basements</Option>
          <Option value="debit">Bathrooms</Option>
        </Select>
      </FormControl>
      <FormControl size="sm">
        {/* WILL NEED TO POPULATE THIS WITH DB DATA - ALSO NEED TO KNOW WHAT TO ADD HERE */}
        <FormLabel>Customer</FormLabel>
        <Select size="sm" placeholder="All">
          <Option value="all">All</Option>
          <Option value="olivia">Olivia Rhye</Option>
          <Option value="steve">Steve Hampton</Option>
          <Option value="ciaran">Ciaran Murray</Option>
          <Option value="marina">Marina Macdonald</Option>
          <Option value="charles">Charles Fulton</Option>
          <Option value="jay">Jay Hoper</Option>
        </Select>
      </FormControl>
    </React.Fragment>
  );
  return (
    <React.Fragment>
      <Sheet
        className="SearchAndFilters-mobile"
        sx={{
          display: { xs: "flex", sm: "none" },
          my: 1,
          gap: 1,
        }}
      >
        <Input
          size="sm"
          placeholder="Search"
          startDecorator={<SearchIcon />}
          sx={{ flexGrow: 1 }}
        />
        <IconButton
          size="sm"
          variant="outlined"
          color="neutral"
          onClick={() => setOpen(true)}
        >
          <FilterAltIcon />
        </IconButton>
        <Modal open={open} onClose={() => setOpen(false)}>
          <ModalDialog aria-labelledby="filter-modal" layout="fullscreen">
            <ModalClose />
            <Typography id="filter-modal" level="h2">
              Filters
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Sheet sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {renderFilters()}
              <Button color="primary" onClick={() => setOpen(false)}>
                Submit
              </Button>
            </Sheet>
          </ModalDialog>
        </Modal>
      </Sheet>
      <Box
        className="SearchAndFilters-tabletUp"
        sx={{
          borderRadius: "sm",
          py: 2,
          display: { xs: "none", sm: "flex" },
          flexWrap: "wrap",
          gap: 1.5,
          "& > *": {
            minWidth: { xs: "120px", md: "160px" },
          },
        }}
      >
        <FormControl sx={{ flex: 1 }} size="sm">
          <FormLabel>Search for project</FormLabel>
          <Input
            size="sm"
            placeholder="Search"
            startDecorator={<SearchIcon />}
          />
        </FormControl>
        {renderFilters()}
      </Box>
      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: { xs: "none", sm: "initial" },
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
          {/* ADD CHANGES HERE MY BOY  */}
          <thead>
            <tr>
              <th
                style={{ width: 48, textAlign: "center", padding: "12px 6px" }}
              >
                <Checkbox
                  size="sm"
                  indeterminate={
                    selected.length > 0 && selected.length !== projects.length
                  }
                  checked={selected.length === projects.length}
                  onChange={(event) => {
                    // setSelected(
                    //   event.target.checked ? projects.map((project) => projects.project_id) : [],
                    // );
                  }}
                  color={
                    selected.length > 0 || selected.length === projects.length
                      ? "primary"
                      : undefined
                  }
                  sx={{ verticalAlign: "text-bottom" }}
                />
              </th>
              <th style={{ width: 120, padding: "12px 6px" }}>
                <Link
                  underline="none"
                  color="primary"
                  component="button"
                  // onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
                  fontWeight="lg"
                  endDecorator={<ArrowDropDownIcon />}
                  sx={{
                    "& svg": {
                      transition: "0.2s",
                      // transform:
                      //     order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
                    },
                  }}
                >
                  Name
                </Link>
              </th>
              <th style={{ width: 140, padding: "12px 6px", textAlign: "left" }}>Contact</th> {/* the width used to be 140*/}
              <th style={{ width: 140, padding: "12px 6px", textAlign: "left"}}>Address</th>
              <th style={{ width: 140, padding: "12px 6px", textAlign: "left" }}>Tags</th>
              <th style={{ width: 40, padding: "12px 6px", textAlign: "left" }}>Created at</th>
              <th style={{ width: 40, padding: "12px 6px", textAlign: "left" }}></th>
              
            </tr>
          </thead>

          {/*  */}
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6">
                  {" "}
                  <Skeleton variant="text" width="100%" height={50} />
                  <Skeleton variant="text" width="100%" height={50} />
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr key={client.client_id}>
                  <td
                    style={{
                      textAlign: "center",
                      width: 120,
                    }}
                  >
                    <Checkbox
                      size="sm"
                      checked={selected.includes(client.client_id.toString())}
                      color={
                        selected.includes(client.client_id.toString())
                          ? "primary"
                          : undefined
                      }
                      onChange={(event) => {
                        setSelected((prevSelected) =>
                          event.target.checked
                            ? prevSelected.concat(client.client_id.toString())
                            : prevSelected.filter(
                                (id) => id !== client.client_id.toString()
                              )
                        );
                      }}
                      slotProps={{ checkbox: { sx: { textAlign: "left" } } }}
                      sx={{ verticalAlign: "text-bottom" }}
                    />
                  </td>
                  {/* Displaying client's first and last names information if available */}
                  <td style={{ textAlign: "left" }}>
                    <Typography level="body-xs">{`${client.first_name} ${client.last_name}`}</Typography>
                  </td>
                  {/* Displaying client's contact information if available */}
                  <td>
                    {/* This is working version with out icons */}
                    {/* {client ? (
                      <Typography level="body-xs">
                        {`${client.phone_number} ${client.email}`}
                        </Typography>
                    ) : (
                      <Typography level="body-xs">N/A</Typography>
                    )} */}
                    <Box display="flex" flexDirection="column" alignItems="flex-start" gap={0.5}>
                      <Box display="flex" alignItems="left" gap={1}>
                        <Typography variant="body-xs" component="span">
                          <LocalPhoneIcon fontSize="small" sx={{mr: 1}}/>
                          {client.phone_number}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="left" gap={1}>
                        <Typography variant="body-xs" component="span">
                          <EmailIcon fontSize="small"  sx={{mr: 1}}/>
                          {client.email}
                        </Typography>
                      </Box>
                    </Box>
                  </td>
                  <td style={{ textAlign: "left" }}>
                      <Typography level="body-xs">{`${client.address}`}</Typography>
                  </td>

                  {/* <td>
                  <Typography level="body-xs">{project.project_id}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{project.client_id ? `${project.client_id.first_name} ${project.client_id.last_name}` : 'N/A' }</Typography>
                </td>*/}
                  {/* <td>
                    <Chip
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
                          ? "success"
                          : project.status.name == "Active"
                          ? "neutral"
                          : project.status.name == "Cancelled"
                          ? "danger"
                          : "default" // Use default color for "N/A" or other statuses
                      }
                    >
                      {project.status.name}
                    </Chip>
                  </td> */}
                  <td>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                      }}
                    >
                      {/* <Avatar size="sm">{project.client.first_name}</Avatar> */}
                      <div>
                        {/* <Typography level="body-xs">{project.client_id }</Typography> */}

                        <Typography level="body-xs">{status.name}</Typography>
                      </div>

                      {/* {project.client ? (
                        <Typography level="body-xs">{`${project.end_date}`}</Typography>
                      ) : (
                        <Typography level="body-xs">N/A</Typography>
                      )} */}
                    </Box>
                  </td>
                  <td>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "left" }}>
                      <Link level="body-xs" component="button">
                        Email
                      </Link>
                      <RowMenu projectId={client.client_id} />
                    </Box>
                  </td>
                  <td>
                    
                  </td>
                </tr>
              ))
            )}
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
        >
          Previous
        </Button>

        <Box sx={{ flex: 1 }} />
        {["1", "2", "3", "…", "8", "9", "10"].map((page) => (
          <IconButton
            key={page}
            size="sm"
            variant={Number(page) ? "outlined" : "plain"}
            color="neutral"
          >
            {page}
          </IconButton>
        ))}
        <Box sx={{ flex: 1 }} />

        <Button
          size="sm"
          variant="outlined"
          color="neutral"
          endDecorator={<KeyboardArrowRightIcon />}
        >
          Next
        </Button>
      </Box>
    </React.Fragment>
  );
}
