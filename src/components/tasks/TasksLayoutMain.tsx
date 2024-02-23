import * as React from "react";
import {
  Autocomplete,
  Box,
  Button,
  AspectRatio,
  Divider,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  IconButton,
  Textarea,
  Stack,
  Select,
  Option,
  Typography,
  Tabs,
  TabList,
  Breadcrumbs,
  Link,
  Card,
  CardActions,
  CardOverflow,
  Modal,
  ModalDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Sheet,
  Chip,
} from "@mui/joy";

import Tab, { tabClasses } from "@mui/joy/Tab";

// ICONS:
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import Add from "@mui/icons-material/Add";

export default function TasksLayoutMain() {
  const [open, setOpen] = React.useState(false);

  const options = ["The Godfather", "Pulp Fiction"];

  return (
    <React.Fragment>
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
      ></Sheet>

      <Box sx={{ flex: 1, width: "100%" }}>
        <Stack
          spacing={4}
          sx={{
            display: "flex",
            maxWidth: "800px",
            mx: "auto",
            px: { xs: 2, md: 6 },
            py: { xs: 2, md: 3 },
          }}
        >
          <Card>
            <Box sx={{ mb: 1 }}>
              <Typography level="title-md">All Tasks</Typography>
              <Typography level="body-sm">Showing all tasks bla bla</Typography>
            </Box>
            <Divider />
            <Stack
              direction="row"
              spacing={3}
              sx={{ display: { xs: "none", md: "flex" }, my: 1 }}
            >
              <Stack spacing={2} sx={{ flexGrow: 1 }}>
                HI
                <Stack spacing={1}></Stack>
              </Stack>
            </Stack>

            <React.Fragment>
              <Button
                variant="outlined"
                color="neutral"
                startDecorator={<Add />}
                onClick={() => setOpen(true)}
              >
                New Task
              </Button>
              <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog>
                  <DialogTitle>New Task</DialogTitle>
                  <DialogContent sx={{ textAlign: "left" }}>
                    Fill in the form to create task
                  </DialogContent>
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      setOpen(false);
                    }}
                  >
                    <Stack direction="column" spacing={2}>
                      <FormControl sx={{ flexGrow: 1 }}>
                        <FormLabel>Task:</FormLabel>
                        <Input autoFocus required />
                      </FormControl>

                      <FormControl sx={{ flexGrow: 1 }}>
                        <FormLabel>Assign to:</FormLabel>
                        <Select
                          multiple
                          defaultValue={["dog", "cat"]}
                          renderValue={(selected) => (
                            <Box sx={{ display: "flex", gap: "0.25rem" }}>
                              {selected.map((selectedOption) => (
                                <Chip variant="soft" color="primary">
                                  {selectedOption.label}
                                </Chip>
                              ))}
                            </Box>
                          )}
                          sx={{
                            minWidth: "15rem",
                          }}
                          slotProps={{
                            listbox: {
                              sx: {
                                width: "100%",
                              },
                            },
                          }}
                        >
                          <Option value="dog">Dog</Option>
                          <Option value="cat">Cat</Option>
                          <Option value="fish">Fish</Option>
                          <Option value="bird">Bird</Option>
                        </Select>
                      </FormControl>

                      <FormControl sx={{ flex: 1 }} size="sm">
                        <FormLabel>Project:</FormLabel>
                        <Autocomplete
                          placeholder="Combo box"
                          options={options}
                          sx={{ width: 300 }}
                        />
                      </FormControl>

                      <Button type="submit">Create</Button>
                    </Stack>
                  </form>
                </ModalDialog>
              </Modal>
            </React.Fragment>

            {/* Mobile View */}
            {/* <Stack
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
                >
                  <Input size="sm" placeholder="First name" />
                  <Input size="sm" placeholder="Last name" />
                </FormControl>
              </Stack>
            </Stack>
            <FormControl>
              <FormLabel>Role</FormLabel>
              <Input size="sm" defaultValue="UI Developer" />
            </FormControl>
          </Stack> */}
            <CardOverflow
              sx={{ borderTop: "1px solid", borderColor: "divider" }}
            >
              <CardActions sx={{ alignSelf: "flex-end", pt: 2 }}>
                <Button size="sm" variant="outlined" color="neutral">
                  Cancel
                </Button>
                <Button size="sm" variant="solid">
                  Save
                </Button>
              </CardActions>
            </CardOverflow>
          </Card>
        </Stack>
      </Box>
    </React.Fragment>
  );
}
