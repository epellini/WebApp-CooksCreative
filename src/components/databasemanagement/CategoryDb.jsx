import React, { useEffect } from "react";
import { useState } from "react";
import {
  Sheet,
  FormLabel,
  Input,
  Button,
  Table,
} from "@mui/joy";
import { supabaseClient } from "../../supabase-client"; // Import the supabase client
import { useNavigate } from "react-router";

export default function CategorydB() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  const [category, setCategory] = useState({
    name: "",
  });

  const getCategories = async () => {
    try {
      const { data, error } = await supabaseClient.from("category").select("*");
      if (error) {
        console.error("Error getting categories:", error);
      } else {
        console.log("Categories:", data);
        setCategories(data);
      }
    } catch (error) {
      console.error("Error getting categories:", error);
    }
  };

  const deleteCategory = async (id) => {
    try {
      const { data, error } = await supabaseClient
        .from("category")
        .delete()
        .eq("category_id", id);
      if (error) {
        console.error("Error deleting category:", error);
      } else {
        console.log("Category deleted successfully");
        getCategories(); // Refresh categories after deletion
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (category.name.trim() !== "") {
      try {
        const { data, error } = await supabaseClient
          .from("category")
          .insert([category]);
        if (error) {
          console.error("Error adding category:", error);
        } else {
          console.log("Category added successfully");
          navigate("/projects");
        }
      } catch (error) {
        console.error("Error adding category:", error);
      }
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <React.Fragment>
      <Sheet className="dashboard-categories" variant="outlined">
        <h1>Add a New Category</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <FormLabel htmlFor="name">Category Name</FormLabel>
            <Input
              onChange={handleChange}
              id="name"
              name="name"
              value={category.name}
              required
            />
          </div>
          <Button type="submit" variant="solid" color="primary">
            Add
          </Button>
        </form>

        <h1>Categories</h1>

        <Table
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
            border: "1px solid #CDD7E1",
            borderRadius: "5px",
          }}
        >
          <thead>
            <tr>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories
              .filter((category) => category.category_id !== 15)
              .map((category) => (
                <tr key={category.category_id}>
                  <td style={{ textAlign: "left" }}>{category.name}</td>
                  <td style={{ textAlign: "left" }}>
                    <Button
                      variant="solid"
                      color="error"
                      onClick={() => deleteCategory(category.category_id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Sheet>
    </React.Fragment>
  );
}
