import * as React from "react";
import { useState } from "react";
import { Sheet, FormLabel, Input, Button } from "@mui/joy";
import { supabaseClient } from "../../supabase-client"; // Import the supabase client
import { useNavigate  } from "react-router";





export default function AddCategory() {
    const navigate = useNavigate();

    const [category, setCategory] = useState({
        name: "",
    });

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
                let result = null;
                const { data, error } = await supabaseClient
                    .from("category")
                    .insert([category]);
                result = { data, error };
                if (result.error) {
                    console.error("Error adding category:", result.error);
                } else {
                    navigate("/projects");
                    console.log("Category added successfully");
                }
            } catch (error) {
                console.error("Error adding category:", error);
            }
        }
    };

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
            </Sheet>
        </React.Fragment>
    );
}
