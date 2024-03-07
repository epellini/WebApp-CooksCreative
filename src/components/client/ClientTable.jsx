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
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import Autocomplete from "@mui/joy/Autocomplete";
import { Skeleton } from "@mui/joy";
import HomeIcon from "@mui/icons-material/Home";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabaseClient } from "../../supabase-client"; // Import the supabase client
import { usePagination } from "../../hooks/usePagination";
import { convertToCSV, downloadCSV } from "../../utils/CsvUtils";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import ClientForm from "./ClientForm";

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
        <MenuItem onClick={() => navigate(`/clients/edit/${clientId}`)}>
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
  //const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState([]);
  const [status, setStatus] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // const [searchQuery, setSearchQuery] = useState("");
  // const [filteredClients, setFilteredClients] = useState([]);

  const [selectedClient, setSelectedClient] = useState(null);
  useEffect(() => {
    async function getClients() {
      setLoading(true); // Begin loading state

      try {
        const { data: clientsData, error } = await supabaseClient
          .from("clients")
          .select("*");

        if (error) {
          throw error;
        }

        setClients(clientsData);
      } catch (error) {
        console.error("Error fetching data: ", error.message);
      } finally {
        setLoading(false); // End loading state
      }
    }

    getClients();
  }, []);

  const filteredClients = selectedClient
    ? clients.filter((client) => client.client_id === selectedClient.client_id)
    : clients;

  // const [currentPage, setCurrentPage] = useState(1);
  // const [itemsPerPage, setItemsPerPage] = useState(10);

  // // Calculate total pages
  // const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  // // Determine the clients for the current page
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentClients = filteredClients.slice(
  //   indexOfFirstItem,
  //   indexOfLastItem
  // );

  // // Handle page change
  // const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // // Previous and Next page handlers
  // const handlePrevious = () =>
  //   setCurrentPage((currentPage) => Math.max(1, currentPage - 1));
  // const handleNext = () =>
  //   setCurrentPage((currentPage) => Math.min(totalPages, currentPage + 1));

  // const pageNumbers = [];
  // for (let i = 0; i < totalPages; i++) {
  //   pageNumbers.push(i);
  // }

  const {
    currentItems: currentClients,
    currentPage,
    totalPages,
    handlePageChange,
    handlePrevious,
    handleNext,
  } = usePagination(filteredClients, 10);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      // Select all clients
      const newSelected = clients.map((client) => client.client_id.toString());
      setSelected(newSelected);
    } else {
      // Clear selection if the main checkbox is unchecked
      setSelected([]);
    }
  };

  // This function copies the email of the client in clipboard and also redirects to email
  // function handleEmailClick(emailAddress) {
  //   navigator.clipboard
  //     .writeText(emailAddress)
  //     .then(() => {
  //       console.log("Email address copied to clipboard");
  //     })
  //     .catch((err) => {
  //       console.error("Failed to copy email address: ", err);
  //     });

  //   // Open default email client with the email address in the "To" field
  //   window.location.href = `mailto:${emailAddress}`;
  // }

  const handleExportSelected = () => {
    // Filter the clients to only those selected
    const selectedClientsData = clients.filter((client) =>
      selected.includes(client.client_id.toString())
    );

    // Convert the selected clients' data to CSV
    const csvData = convertToCSV(selectedClientsData);

    // Trigger the CSV file download
    downloadCSV(csvData, "SelectedClients.csv");
  };

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
              {/* {renderFilters()} */}
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
          <FormLabel>Search for client</FormLabel>
          <Autocomplete
            size="sm"
            placeholder="Search"
            options={clients}
            getOptionLabel={(option) =>
              `${option.first_name} ${option.last_name}`
            }
            // startDecorator={<SearchIcon />}
            value={selectedClient}
            onChange={(event, newValue) => {
              setSelectedClient(newValue);
              console.log("Selected client:", newValue);
            }}
            renderInput={(params) => <Input {...params} />}
          />
        </FormControl>
        {/* {renderFilters()} */}
      </Box>

      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: { xs: "none", md: "initial" },
          width: "100%",
          maxWidth: {
            lg: "100%",
            xl: "100%",
          },
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
          <thead>
            <tr>
              <th
                style={{ width: 10, textAlign: "center", padding: "12px 6px" }}
              >
                <Checkbox
                  size="sm"
                  indeterminate={
                    selected.length > 0 && selected.length !== clients.length
                  }
                  checked={
                    clients.length > 0 && selected.length === clients.length
                  }
                  onChange={handleSelectAllClick}
                  color={
                    selected.length > 0 || selected.length === clients.length
                      ? "primary"
                      : undefined
                  }
                  sx={{ verticalAlign: "text-bottom" }}
                />
              </th>
              <th style={{ width: 50, padding: "12px 6px" }}>Name</th>
              <th style={{ width: 70, padding: "12px 6px", textAlign: "left" }}>
                Contact
              </th>{" "}
              <th style={{ width: 40, padding: "12px 6px", textAlign: "left" }}>
                Address
              </th>
              {/* <th style={{ width: 20, padding: "12px 6px", textAlign: "left" }}>
                Utilities
              </th> */}
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
              currentClients.map((client) => {
                // filteredClients.map((client) => {
                //console.log("Clients:", client);
                return (
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
                      <Typography
                        sx={{
                          textAlign: "left",
                          fontSize: {
                            xs: "0.8rem",
                            sm: "0.85rem",
                          },
                        }}
                        onClick={() => navigate(`/clients/${client.client_id}`)}
                        style={{ cursor: "pointer" }}
                      >
                        {`${client.first_name} ${client.last_name}`}
                      </Typography>
                    </td>
                    <td>
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="flex-start"
                        gap={0.5}
                      >
                        {/* Phone number chip */}
                        <a
                          href={`tel:${client.phone_number}`}
                          style={{ textDecoration: "none" }}
                        >
                          <Chip size="sm" startDecorator={<LocalPhoneIcon />}>
                            {client.phone_number}
                          </Chip>
                        </a>

                        {/* Email chip */}
                        <a
                          href={`mailto:${client.email}`}
                          style={{ textDecoration: "none" }}
                        >
                          <Chip size="sm" startDecorator={<EmailIcon />}>
                            {client.email}
                          </Chip>
                        </a>
                      </Box>
                    </td>

                    <td>
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="flex-start"
                        gap={0.5}
                      >
                        <Link
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            `${client.street}, ${client.city}, ${client.province} ${client.postal_code}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          underline="hover"
                          sx={{
                            display: "flex", // Ensure the link covers the content
                            flexDirection: "column", // Stack items vertically
                            alignItems: "flex-start", // Align items to the start
                            gap: 0.5, // Maintain a small gap between lines
                          }}
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
                            {client.street}
                          </Typography>
                          <Typography
                            sx={{
                              textAlign: "left",
                              fontSize: {
                                xs: "0.8rem",
                                sm: "0.85rem",
                              },
                            }}
                          >
                            {`${client.city}, ${client.province} ${client.postal_code}`}
                          </Typography>
                        </Link>
                      </Box>
                    </td>

                    {/* <td>
                      <Box sx={{ display: "flex", gap: 2, alignItems: "left" }}>
                        <Link
                          level="body-xs"
                          component="button"
                          onClick={() => handleEmailClick(client.email)}
                        >
                          Email
                        </Link>
                        <RowMenu clientId={client.client_id} />
                      </Box>
                    </td> */}
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </Sheet>

      {/* Import to CSV button. Shows up when at least one client is selected  */}
      {selected.length > 0 && (
        <Button onClick={handleExportSelected} style={{ margin: "10px 0" }}>
          Export Email List
        </Button>
      )}

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

        {/* This is working version, the UI is not what we want  */}
        {/* {[...Array(totalPages).keys()].map(number => (
          <Button
            key={number + 1}
            onClick={() => handlePageChange(number + 1)}
            disabled={currentPage === number + 1}
          >
            {number + 1}
          </Button>
        ))} */}

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
