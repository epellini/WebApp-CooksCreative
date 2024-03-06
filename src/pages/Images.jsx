import React, { useEffect } from "react";
import FileUpload from "../components/FileUpload";
import DropZone from "../components/DropZone";
import { FormGroup } from "@mui/material";
import { FormControl } from "@mui/material";
import Button from "@mui/joy/Button";
import { v4 as uuidv4 } from "uuid";
import { supabaseClient } from "../supabase-client";
import { useState } from "react";
import { Stack } from "@mui/material";
import { Card } from "@mui/material";
import CardContent from "@mui/joy/CardContent";
import Box from "@mui/joy/Box";

const CDNURL =
  "https://khqunikzqiyqnqgpcaml.supabase.co/storage/v1/object/public/images/project-images/";
// CDNURL + project.project_id + "/" + image.name

const Images = () => {
  const [images, setImages] = useState([]);
  const [projects, setProject] = useState([]); // need to do the function?

  let project = { // delete after testing
    project_id: "123",
  };

  async function getImages() {
    const { data, error } = await supabaseClient.storage
      .from("images")
      .list(project?.project_id + "/", {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    if (data) {
      console.log(data);
    } else {
      console.log(error);
    }

    if (data !== null) {
      setImages(data);
    } else {
      alert("No images found");
      console.log(error);
    }
  }

  useEffect(() => {
    getImages();
  }, []);

  async function uploadImage(e) {
    let file = e.target.files[0];
    console.log(file);

    const { data, error } = await supabaseClient.storage
      .from("images")
      .upload("project-images/" + project.project_id + "/" + uuidv4(), file);

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
      <h2>Images</h2>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Box>
          {images.map((image) => {
            return (
              <Box key={CDNURL + project.project_id + "/" + image.name}>
                <Card>
                  <img src={CDNURL + project.project_id + "/" + image.name} />
                  <CardContent>
                    <Button>Delete</Button>
                  </CardContent>
                </Card>
              </Box>
            );
          })}
        </Box>
      </Stack>
    </div>
  );
};

export default Images;
