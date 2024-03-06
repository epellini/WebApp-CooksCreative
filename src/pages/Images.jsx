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

const Images = () => {
  const [images, setImages] = useState([]);
  const [projects, setProject] = useState([]); // need to do the function?
  const [fileName, setFileName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [projectImageUrl, setProjectImageUrl] = useState("");

  const insertData = async (imageUrl) => {
    const { data, error } = await supabaseClient
      .from("images")
      .insert([{ image_urls: imageUrl, project_id: project.project_id}]);
    if (error) {
      console.error("Error inserting image", error);
    }
  }

  async function getImageFromProject  () {
    const { data, error } = await supabaseClient
      .from("images")
      .select("image_urls")
      .eq("project_id", project.project_id);
    if (error) {
      console.error("Error fetching images", error);
    } else {
      console.log("Got images", data);
      console.log("Image Url: ", data[0].image_urls);
      setProjectImageUrl(data[0].image_urls);
    }
  }

  const CDNURL =
    "https://khqunikzqiyqnqgpcaml.supabase.co/storage/v1/object/public/images/project-images/";

  let project = {
    // delete after testing
    project_id: "162",
  };

  useEffect(() => {
    getImageFromProject();
    console.log("Project Image Url: ", projectImageUrl);

    const pathToImage = projectImageUrl;
    async function fetchImageUrl() {
      try {
        const { data, error } = await supabaseClient
          .storage
          .from("images")
          .getPublicUrl(pathToImage);
        if (error) {
          console.error(error);
        } else {
          console.log("Got public url", data);
          setImageUrl(data.publicUrl);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchImageUrl();
  }, []); // Empty dependency array to run this effect



  async function uploadImage(e) {
    let file = e.target.files[0];
    console.log(file);

    const { data, error } = await supabaseClient.storage
      .from("images")
      .upload("project-images/" + project.project_id + "/" + uuidv4(), file);

    if (data) {
      console.log("Data from upload:", data); // Add this line to log data
      console.log("path: "+ data.path);
      setImageUrl(data.path);
      insertData(data.path);

    } else {
      console.log("Error:", error);
    }
  }

  return (
    <div>
      Images Page
      <img src={imageUrl} />
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
