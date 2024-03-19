import React, { useState, useEffect } from "react";
import { supabaseClient } from "../../supabase-client";

import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Alert from '@mui/material/Alert';
import Button from '@mui/joy/Button';

const UserDb = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data: usersData, error: usersError } = await supabaseClient
        .from("users")
        .select("*")
        .order("user_id", { ascending: true });

      if (usersError) throw usersError;
      setUsers(usersData);
    } catch (error) {
      setError(error.message);
    }
  };

  //   const deleteUser = async (userId) => {
  //     try {
  //       const { error } = await supabase
  //         .from("users")
  //         .delete()
  //         .match({ user_id: userId });

  //       if (error) throw error;

  //       // Refresh the list after deletion
  //       fetchUsers();
  //     } catch (error) {
  //       console.error("Error deleting user:", error.message);
  //     }
  //   };

  return (
    <div>
      <List>
        {users.map((user) => (
          <ListItem key={user.user_id}>
            <ListItemContent>
              {user.firs_name} - {user.last_name} - {user.email}
            </ListItemContent>
            <Button
              variant="outlined"
              color="danger"
            //   startDecorator={<DeleteIcon />}
              onClick={() => deleteUser(user.user_id)}
            >
              Delete
            </Button>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default UserDb;
