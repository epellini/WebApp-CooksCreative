import React from "react";
import FileUpload from "../components/FileUpload";
import DropZone from "../components/DropZone";
import { FormGroup } from "@mui/material";
import { FormControl } from "@mui/material";
import Button from "@mui/joy/Button";
import { v4 as uuidv4 } from "uuid";
import { supabaseClient } from "../supabase-client";

const Images = () => {
    
    let project = {
        project_id: "123"
    }

  async function getImages() {
    const { data, error } = await supabaseClient.storage
      .from("images")
      .list(project?.project_id + "/", { 
        limit: 10,
        offset: 0,
        sortBy: { column: "name", order: "asc" }
        });

    if (data) {
      console.log(data);
    } else {
      console.log(error);
    }

    if (data !== null) {
        setImages(data);
    } else {
        alert("No images found")
        console.log(error);
    }
  }

  async function uploadImage(e) {
    let file = e.target.files[0];
    console.log(file);

    const { data, error } = await supabaseClient.storage
      .from("images")
      .upload("images/" + project.project_id + "/" + uuidv4(), file);

    if (data) {
      getImages();
    } else {
      console.log(error);
    }
  }

  return (
    <div>
      Images Page
      {/* <DropZone />
      <FileUpload /> */}
      <FormGroup>
        <FormControl>
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={(e) => uploadImage(e)}
          />
        </FormControl>
        <Button variant="contained" color="primary">
          Submit
        </Button>
      </FormGroup>
    </div>
  );
};

export default Images;