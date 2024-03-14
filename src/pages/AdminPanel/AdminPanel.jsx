import React from "react";
import Register from "../Auth/Register";
import CategoryDb from "../../components/databasemanagement/CategoryDb";
import UserDb from "../../components/databasemanagement/UserDb";
import {
    Box,
    Stack
} from "@mui/material";
const AdminPanel = () => {
    return (
        <div>
            Admin Panel
            <Register/>
            <Stack>
                <Box>
                    <h2>User Management</h2>
                    <UserDb/>
                </Box>
                <Box>
                    <h2>Table Management</h2>
                    <CategoryDb />
                </Box>
            </Stack>
        </div>
    );
}



export default AdminPanel;