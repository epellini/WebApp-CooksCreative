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

  let project = { // delete after testing
    project_id: "123",
  };

  useEffect(() => {
    // const pathToImage = "project-images/123/2ee3b8bb-8fb2-4f56-a9b9-86f417a79cd0";
  
    // async function fetchImageUrl() {
    //   try {
    //     const { data, error } = await supabaseClient
    //       .storage
    //       .from("images")
    //       .getPublicUrl(pathToImage);
        
    //     if (error) {
    //       console.error(error);
    //     } else {
    //       console.log("Got public url", data);
    //       setImageUrl(data.publicUrl);
    //     }
    //   } catch (error) {
    //     console.error(error);
    //   }
    // }
  
    // fetchImageUrl();
  }, []); // Empty dependency array to run this effect

  async function uploadImage(e) {
    let file = e.target.files[0];
    console.log(file);

    const { data, error } = await supabaseClient.storage
      .from("images")
      .upload("project-images/" + project.project_id + "/" + uuidv4(), file);

    if (data) {
      console.log(data);
      setImages([...images, data]);
      console.log(images);
    } else {
      console.log(error);
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
