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
  List,
  ListItem,
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
  Sheet,
  Chip,
  TabPanel,
  Tab,
  tabClasses,
  ListDivider,
  Table,
  Grid,
} from "@mui/joy";
import * as React from "react";
import DashboardProjects from "../components/home/DashboardProjects";
import DashboardTasks from "../components/home/DashboardTasks";
import DashboardCompletedTasks from "../components/home/DashBoardCompletedTasks";
import AddCategory from "../components/databasemanagement/AddCategory";
// import Button from "@mui/joy/Button";
// import { useAuth } from "../pages/Auth/Auth";

const Home = () => {
  // const {user} = useAuth();
  // const {signout} = useAuth();

  // const handleLogout = () => {
  //   signout();
  // }

  return (
    <div>
      <h1>Dashboard</h1>
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={1}>
        <Box gridColumn="span 8">
          <DashboardProjects />

        </Box>
        <Box gridColumn="span 4">
          <AddCategory />
        </Box>
        <Box gridColumn="span 8">
          <DashboardTasks />

        </Box>

        <Box gridColumn="span 4">
          <DashboardCompletedTasks />

        </Box>

      </Box>


    </div>
  );
};

export default Home;