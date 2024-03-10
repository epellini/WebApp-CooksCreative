import React, { useEffect, useState } from "react";
import { CardContent, CardMedia, FormGroup } from "@mui/material";
import { FormControl } from "@mui/material";
import Button from "@mui/joy/Button";
import { v4 as uuidv4 } from "uuid";
import { supabaseClient } from "../../supabase-client";
import { Stack } from "@mui/material";
import { Box } from "@mui/material";
import SvgIcon from "@mui/joy/SvgIcon";
import { styled } from "@mui/joy";
import Card from "@mui/joy/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/joy/Snackbar";

const Images = (projectid) => {
  const [images, setImages] = useState([]);
  const [project, setProject] = useState({ project_id: projectid.projectid });
  const [imageUrl, setImageUrl] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [isUploading, setIsUploading] = useState(false);

  const VisuallyHiddenInput = styled("input")`
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    bottom: 0;
    left: 0;
    white-space: nowrap;
    width: 1px;
  `;

  const viewImage = (imageUrl) => {
    const link = document.createElement("a");
    link.target = "_blank";
    link.href = imageUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadImage = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const filename = imageUrl.split("/").pop().split("#")[0].split("?")[0];
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading the image:", error);
    }
  };

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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setIsUploading(true); // Indicate upload is starting
    await handleSubmit(file); // Now passing the file directly
    setIsUploading(false);
  };

  const deleteImage = async (imageUrl) => {
    setSnackbarMessage("THOMAS DO THIS DO FOR MEEE!");
    setOpenSnackbar(true);
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

  const handleSubmit = async (file) => {
    const { data, error } = await supabaseClient.storage
      .from("images")
      .upload(`project-images/${project.project_id}/${uuidv4()}`, file);

    if (data) {
      const path = data.path;
      await supabaseClient.from("images").insert({
        image_urls: path,
        project_id: project.project_id,
      });
      setImageUrls([...imageUrls, path]);
      setSelectedFile(null); 
      setImageUrl(""); 
      setRefresh(!refresh);
      setSnackbarMessage("Image Uploaded Successfully!");
      setOpenSnackbar(true);
    } else {
      console.error("Error uploading image", error);
    }
  };

  return (
    <div>
      <Snackbar
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
        autoHideDuration={5000} 
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        {snackbarMessage}
      </Snackbar>{" "}
      {isUploading ? (
        <CircularProgress />
      ) : (
        imageUrl && (
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
        )
      )}
      <FormGroup>
        <Button
          component="label"
          role={undefined}
          tabIndex={-1}
          variant="outlined"
          color="neutral"
          startDecorator={
            <SvgIcon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                />
              </svg>
            </SvgIcon>
          }
        >
          Upload an image
          <VisuallyHiddenInput
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="upload-image-input"
          />
        </Button>
      </FormGroup>
      <h2>Images</h2>
      <Stack
        direction="row"
        flexWrap="wrap"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        {imageUrls.map((imageUrl) => (
          <Card
            variant="outlined"
            key={imageUrl}
            sx={{
              width: 225,
              height: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardMedia
              component="img"
              src={imageUrl}
              alt="Uploaded"
              sx={{
                borderRadius: "8px",
                height: 200,
                objectFit: "cover",
                cursor: "pointer",
              }}
              onClick={() => viewImage(imageUrl)}
            />
            <CardContent
              sx={{ padding: "2px", "&:last-child": { paddingBottom: "2px" } }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                }}
              >
                <Button color="danger" onClick={() => deleteImage(imageUrl)}>
                  Delete
                </Button>
                <Button color="primary" onClick={() => downloadImage(imageUrl)}>
                  Download
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </div>
  );
};

export default Images;
