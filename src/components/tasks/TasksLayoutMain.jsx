import * as React from "react";
import { Button, Modal, ModalDialog, Sheet } from "@mui/joy";
import Dropdown from "@mui/joy/Dropdown";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import Menu from "@mui/joy/Menu";
import { useEffect, useState } from "react";
import { supabaseClient } from "../../supabase-client"; // Import the supabase client

// ICONS:
import Add from "@mui/icons-material/Add";

//Task Forms
import TaskForm from "./TaskForm";
import TaskTableAll from "./TaskTable_All";

export default function TasksLayoutMain() {
  const [open, setOpen] = React.useState(false);
  const [tasks, setTasks] = useState([]); // ok
  const [projects, setProjects] = useState([]);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  let [days, setDays] = useState(30);

  const createHandleClose = (index, value) => () => {
    if (typeof index === "number") {
      setSelectedIndex(index);
      setDays(value);
    }
  };

  const [members, setMembers] = React.useState([false, true, false]);
  const toggleMember = (index) => (event) => {
    const newMembers = [...members];
    newMembers[index] = event.target.checked;
    setMembers(newMembers);
  };

  async function getTasks() {
    const { data, error } = await supabaseClient.from("tasks").select(`
  *,
  projects(*)
`);

    if (error) {
      console.error("Error fetching tasks:", error);
    } else {
      setTasks(data);
      setProjects(data.map((task) => task.projects)); //get the projects for the specified task
    }
  }
  useEffect(() => {
    getTasks();
    console.log("Tasks:", tasks);
  }, []);

  const onHandleSubmit = () => {
    setOpen(false);
    //reload the tasks
    getTasks();
  };

  return (
    <React.Fragment>
      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: {
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
        <TaskTableAll tasks={tasks} getTasks={getTasks} />

        <Dropdown>
          <MenuButton>Select Number of Days</MenuButton>
          <Menu>
            <MenuItem
              {...(selectedIndex === 0 && { selected: true, variant: "soft" })}
              onClick={createHandleClose(0, 30)}
            >
              30
            </MenuItem>
            <MenuItem
              selected={selectedIndex === 1}
              onClick={createHandleClose(1, 60)}
            >
              60
            </MenuItem>
          </Menu>
        </Dropdown>

        <React.Fragment>
          <Button
            variant="outlined"
            color="neutral"
            startDecorator={<Add />}
            onClick={() => setOpen(true)}
          >
            New Task
          </Button>
          <Modal
            className="formWindow"
            open={open}
            onClose={() => setOpen(false)}
          >
            <ModalDialog>
              <TaskForm
                open={open}
                setOpen={setOpen}
                onHandleSubmit={onHandleSubmit}
              />
            </ModalDialog>
          </Modal>
        </React.Fragment>
      </Sheet>
    </React.Fragment>
  );
}
