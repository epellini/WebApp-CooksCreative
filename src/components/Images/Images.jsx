import React, { useEffect } from "react";
import FileUpload from "../FileUpload";
import DropZone from "../DropZone";
import { FormGroup } from "@mui/material";
import { FormControl } from "@mui/material";
import Button from "@mui/joy/Button";
import { v4 as uuidv4 } from "uuid";
import { supabaseClient } from "../../supabase-client";
import { useState } from "react";
import { Stack } from "@mui/material";
import { Card } from "@mui/material";
import CardContent from "@mui/joy/CardContent";
import Box from "@mui/joy/Box";
import AspectRatio from "@mui/joy/AspectRatio";

const Images = (projectid) => {
  const [images, setImages] = useState([]);
  const [project, setProject] = useState({ project_id: projectid.projectid });
  const [fileName, setFileName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  
  const insertData = async (imageUrl) => {
    const { data, error } = await supabaseClient
      .from("images")
      .insert([{ image_urls: imageUrl, project_id: project.project_id }]);

    if (error) {
      console.error("Error inserting image", error);
    }
  };

  const getImages = async (pathToImage) => {
    const { data: publicUrlData, error: publicUrlError } =
      await supabaseClient.storage.from("images").getPublicUrl(pathToImage);
    if (publicUrlError) {
      console.error(publicUrlError);
      return;
    }
    console.log("Got public url", publicUrlData);
    setImages(publicUrlData);
  };

  async function getProjects() {
    const { data, error } = await supabaseClient.from("projects").select("*");
    if (error) {
      console.error("Error fetching projects", error);
    } else {
      console.log("Got projects", data);
      setProject(data);
    }
  }

  //might need this for loading the project from the project number on project details page.
  async function getImageFromProject() {
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

  // let project = {
  //   // delete after testing
  //   project_id: "162",
  // };

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch image URLs
        const { data: imageData, error: imageError } = await supabaseClient
          .from("images")
          .select("image_urls")
          .eq("project_id", project.project_id);

          console.log("Project ID: ", project.project_id);

        if (imageError) {
          console.error("Error fetching images", imageError);
          return;
        }

        console.log("Got images", imageData);

        // Fetch public URLs for all images
        if (imageData && imageData.length > 0) {
          const pathToImages = imageData.map((image) => image.image_urls);

          const imageUrlsPromises = pathToImages.map(async (pathToImage) => {
            const { data: publicUrlData, error: publicUrlError } =
              await supabaseClient.storage
                .from("images")
                .getPublicUrl(pathToImage);

            if (publicUrlError) {
              console.error(publicUrlError);
              return null;
            }

            console.log("Got public url", publicUrlData);
            return publicUrlData.publicUrl;
          });

          const fetchedImageUrls = await Promise.all(imageUrlsPromises);
          setImageUrls(fetchedImageUrls);
          console.log("Fetched image URLs", fetchedImageUrls);
          console.log("Image URLs", fetchedImageUrls); // Move this line here
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  async function uploadImage(e) {
    let file = e.target.files[0];
    console.log(file);

    const { data, error } = await supabaseClient.storage
      .from("images")
      .upload("project-images/" + project.project_id + "/" + uuidv4(), file);

    if (data) {
      console.log("Data from upload:", data); // Add this line to log data
      console.log("path: " + data.path);
      setImageUrl(data.path);
      insertData(data.path);
    } else {
      console.log("Error:", error);
    }
  }

  return (
    <div>
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
        {imageUrls.map((imageUrl) => {
          return (
            <Stack>
            <Box
              component="img"
              sx={{
                height: 233,
                width: 350,
                maxHeight: { xs: 233, md: 167 },
                maxWidth: { xs: 350, md: 250 },
              }}
              alt="The house from the offer."
              src={imageUrl}
            />
            </Stack>
          );
        })}

        {/* <Box>
          {imageUrls.map((imageUrl) => {
            return (
              <Box key={imageUrl}>
                <Card>
                  <img src={imageUrl} alt="Image" />
                  <CardContent>
                    <Button>Delete</Button>
                  </CardContent>
                </Card>
              </Box>
            );
          })}
        </Box> */}
      </Stack>
    </div>
  );
};

export default Images;
