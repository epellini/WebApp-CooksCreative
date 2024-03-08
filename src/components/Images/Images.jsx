import React, { useEffect, useState } from "react";
import { FormGroup } from "@mui/material";
import { FormControl } from "@mui/material";
import Button from "@mui/joy/Button";
import { v4 as uuidv4 } from "uuid";
import { supabaseClient } from "../../supabase-client";
import { Stack } from "@mui/material";
import { Box } from "@mui/material";

const Images = (projectid) => {
  const [images, setImages] = useState([]);
  const [project, setProject] = useState({ project_id: projectid.projectid });
  const [imageUrl, setImageUrl] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [refresh, setRefresh] = useState(false); // State variable for triggering refresh

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch image URLs
        const { data: imageData, error: imageError } = await supabaseClient
          .from("images")
          .select("image_urls")
          .eq("project_id", project.project_id);

        console.log("imageData: ", imageData);

        if (imageError) {
          console.error("Error fetching images", imageError);
          return;
        }

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

            return publicUrlData.publicUrl;
          });

          const fetchedImageUrls = await Promise.all(imageUrlsPromises);
          setImageUrls(fetchedImageUrls);
          console.log(fetchedImageUrls);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, [refresh]); // Trigger useEffect when refresh state changes

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    const url = URL.createObjectURL(e.target.files[0]);
    setImageUrl(url);
  };

  // const deleteImage = async (imageUrl) => {
  //   // Extracting the required portion of the URL
  //   const pathSegments = imageUrl.split('/');
  //   const imagePath = `${pathSegments[pathSegments.length - 3]}/${pathSegments[pathSegments.length - 1]}` +'.png';
  //   console.log("Image Path: ", imagePath);

  //   // Constructing the full path for deletion
  //   const fullPath = `${imagePath}`;

  //   console.log("Full Path: ", fullPath);

  //   // Removing the image
  //   const { data, error } = await supabaseClient.storage
  //     .from("images")
  //     .remove(['project-images/30640403-1327-4f0e-a9bb-3ceab3d12c2c.png']);

  //   if (error) {
  //     console.error("Error deleting image", error);
  //     return;
  //   }

  //   console.log("Data: ", data);

  //   console.log("Image deleted successfully");
  // };

  const handleSubmit = async () => {
    if (selectedFile) {
      const { data, error } = await supabaseClient.storage
        .from("images")
        .upload(
          `project-images/${project.project_id}/${uuidv4()}`,
          selectedFile
        );

      if (data) {
        const path = data.path;
        await supabaseClient.from("images").insert({
          image_urls: path,
          project_id: project.project_id,
        });
        setImageUrls([...imageUrls, path]);
        setSelectedFile(null);
        setImageUrl("");
        setRefresh(!refresh); // Toggle refresh state to trigger useEffect
      } else {
        console.error("Error uploading image", error);
      }
    }
  };

  return (
    <div>
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Preview"
          style={{
            height: 233,
            width: 350,
            maxHeight: { xs: 233, md: 167 },
            maxWidth: { xs: 350, md: 250 },
          }}
        />
      )}
      <FormGroup>
        <FormControl>
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="upload-image-input"
          />
          <label htmlFor="upload-image-input">
            <Button component="span">Upload Image</Button>
          </label>
        </FormControl>

          <FormControl>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </FormControl>

      </FormGroup>
      <h2>Images</h2>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        {imageUrls.map((imageUrl) => (
          <Box key={imageUrl}>
            <img
              src={imageUrl}
              alt="Uploaded"
              style={{ height: 233, width: 350 }}
            />
            {/* <Button
              variant="contained"
              color="secondary"
              onClick={() => deleteImage(imageUrl)}
            >
              Delete
            </Button> */}
          </Box>
        ))}
      </Stack>
    </div>
  );
};

export default Images;
