import React, { useState, useEffect } from "react";
import { Form, useNavigate, useParams } from "react-router-dom";
import Input from "@mui/joy/Input";
import FormLabel from "@mui/joy/FormLabel";
import Button from "@mui/joy/Button";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import Stack from "@mui/joy/Stack";
import Card from "@mui/joy/Card";
import Textarea from "@mui/joy/Textarea";
import CardOverflow from "@mui/joy/CardOverflow";
import CardActions from "@mui/joy/CardActions";

import { supabaseClient } from "../../supabase-client";

const ClientForm = () => {
  const [client, setClient] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    street: "",
    city: "",
    province: "",
    postal_code: "",
    notes: "",
    tag: "",
  });
  const { clientId } = useParams();
  console.log("clientId: ", clientId);

  const navigate = useNavigate();

  const supabase = supabaseClient;
  useEffect(() => {
    if (clientId) {
      const fetchClient = async () => {
        let { data, error } = await supabase
          .from("clients")
          .select("*")
          .eq("client_id", clientId)
          .single();

        if (error) {
          console.error("Error fetching client:", error);
        } else {
          setClient({
            first_name: data.first_name,
            last_name: data.last_name,
            phone_number: data.phone_number,
            email: data.email,
            street: data.street,
            city: data.city,
            province: data.province,
            postal_code: data.postal_code,
            notes: data.notes,
            tag: data.tag,
          });
        }
      };

      fetchClient();
    }
  }, [clientId, supabase]);

  // Updates the client state with form field values on change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handles form submission for both adding and editing a client
  const handleSubmit = async (e) => {
    e.preventDefault();
    const updates = {
      first_name: client.first_name,
      last_name: client.last_name,
      phone_number: client.phone_number,
      email: client.email,
      street: client.street,
      city: client.city,
      province: client.province,
      postal_code: client.postal_code,
      notes: client.notes,
      tag: client.tag,
      ...(clientId ? { client_id: clientId } : {}),
    };

    let result = null;

    if (clientId) {
      // Updating an existing client
      result = await supabaseClient
        .from("clients")
        .update(updates)
        .eq("client_id", clientId);
    } else {
      // Inserting a new client
      result = await supabaseClient.from("clients").insert([updates]);
    }

    if (result.error) {
      console.error("Error adding/editing client:", result.error);
    } else {
      navigate("/clients");
      console.log(
        clientId ? "Client updated successfully" : "Client added successfully"
      );
    }
  };
  // The form for adding or editing client details.
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
            <Breadcrumbs size="sm" aria-label="breadcrumbs" sx={{ pl: 0 }}>
              <Link underline="none" color="neutral" href="/" aria-label="Home">
                <HomeRoundedIcon />
              </Link>
              <Link
                underline="hover"
                color="neutral"
                href="/clients"
                fontSize={12}
                fontWeight={500}
              >
                Clients
              </Link>
              <Typography color="primary" fontWeight={500} fontSize={12}>
                {clientId ? "Update Client" : "Add Client"}
              </Typography>
            </Breadcrumbs>
            <Typography level="h2" component="h1" sx={{ mt: 1, mb: 2 }}>
              {clientId ? "Update Client" : "Add Client"}
            </Typography>
          </Box>
        </Box>
        <Stack
          spacing={0}
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
            <Typography level="title-md">Client Information</Typography>
            <Typography level="body-sm">
              Add a client information and other details to your client.
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
                  <FormLabel>First Name</FormLabel>
                  <Input
                    size="sm"
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={client.first_name}
                    onChange={handleChange} // Pass the event object directly
                    required
                  />
                </FormControl>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    size="sm"
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={client.last_name}
                    onChange={handleChange}
                    required
                  />
                </FormControl>
              </Stack>

              <Stack spacing={1}>
                {" "}
                <Stack direction="row" spacing={2}>
                  <FormControl sx={{ flexGrow: 1 }}>
                    <FormLabel htmlFor="phone_number">Phone Number</FormLabel>
                    <Input
                      id="phone_number"
                      name="phone_number"
                      value={client.phone_number}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>

                  <FormControl sx={{ flexGrow: 1 }}>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input
                      id="email"
                      name="email"
                      value={client.email}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <FormControl sx={{ flexGrow: 1 }} l>
                    <FormLabel htmlFor="street">Street</FormLabel>
                    <Input
                      id="street"
                      name="street"
                      value={client.street}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                  <FormControl sx={{ flexGrow: 1 }}>
                    <FormLabel htmlFor="city">City</FormLabel>
                    <Input
                      id="city"
                      name="city"
                      value={client.city}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <FormControl sx={{ flexGrow: 1 }}>
                    <FormLabel htmlFor="province">Province</FormLabel>
                    <Input
                      id="province"
                      name="province"
                      value={client.province}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                  <FormControl sx={{ flexGrow: 1 }}>
                    <FormLabel htmlFor="postal_code">Postal Code</FormLabel>
                    <Input
                      id="postal_code"
                      name="postal_code"
                      value={client.postal_code}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                </Stack>
                <FormControl>
                  <FormLabel htmlFor="notes">Notes</FormLabel>
                  <Textarea
                    size="sm"
                    minRows={4}
                    sx={{ flexGrow: 1 }}
                    id="notes"
                    name="notes"
                    value={client.notes}
                    onChange={handleChange}
                    required
                  />
                </FormControl>
              </Stack>
            </Stack>
          </Stack>

          <Stack
            direction="column"
            spacing={2}
            sx={{ display: { xs: "flex", md: "none" }, my: 1 }}
          >
            {/* MOBILE VIEW */}
            <Stack direction="row" spacing={2}>
              <Stack spacing={1} sx={{ flexGrow: 1 }}>
                <Stack direction={"row"} spacing={2}>
                  <FormControl sx={{ flexGrow: 1 }}>
                    <FormLabel>First Name</FormLabel>
                    <Input
                      size="sm"
                      type="text"
                      id="first_name"
                      name="first_name"
                      value={client.first_name}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                  <FormControl sx={{ flexGrow: 1 }}>
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      size="sm"
                      type="text"
                      id="last_name"
                      name="last_name"
                      value={client.last_name}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                </Stack>

                <Stack spacing={1}>
                  {" "}
                  <FormControl>
                    <FormLabel htmlFor="phone_number">Phone Number</FormLabel>
                    <Input
                      id="phone_number"
                      name="phone_number"
                      value={client.phone_number}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input
                      id="email"
                      name="email"
                      value={client.email}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="street">Street</FormLabel>
                    <Input
                      id="street"
                      name="street"
                      value={client.street}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="city">City</FormLabel>
                    <Input
                      id="city"
                      name="city"
                      value={client.city}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                  <Stack direction="row" spacing={2}>
                    <FormControl flexGrow={1}>
                      <FormLabel htmlFor="province">Province</FormLabel>
                      <Input
                        id="province"
                        name="province"
                        value={client.province}
                        onChange={handleChange}
                        required
                      />
                    </FormControl>
                    <FormControl flexGrow={1}>
                      <FormLabel htmlFor="postal_code">Postal Code</FormLabel>
                      <Input
                        id="postal_code"
                        name="postal_code"
                        value={client.postal_code}
                        onChange={handleChange}
                        required
                      />
                    </FormControl>
                  </Stack>
                  <FormControl>
                    <FormLabel htmlFor="notes">Notes</FormLabel>
                    <Textarea
                      size="sm"
                      minRows={4}
                      sx={{ flexGrow: 1 }}
                      id="notes"
                      name="notes"
                      value={client.notes}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                </Stack>
              </Stack>
            </Stack>
          </Stack>

          <CardOverflow sx={{ borderTop: "1px solid", borderColor: "divider" }}>
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
                {clientId ? "Update Client" : "Add Client"}
              </Button>
            </CardActions>
          </CardOverflow>
        </Card>
        </Stack>
      </Box>
    </form>
  );
};

export default ClientForm;
