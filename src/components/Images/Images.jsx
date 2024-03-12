import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { CardContent, CardMedia, FormGroup } from "@mui/material";
import { FormControl } from "@mui/material";
import Button from "@mui/joy/Button";
import { v4 as uuidv4 } from "uuid";
import { supabaseClient } from "../../supabase-client";
import { Stack } from "@mui/material";
import { Box } from "@mui/material";
import SvgIcon from "@mui/joy/SvgIcon";
import { Typography, styled } from "@mui/joy";
import Card from "@mui/joy/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/joy/Snackbar";
import Grid from "@mui/material/Grid";


const Images = (projectid, ref) => {
  const [images, setImages] = useState([]);
  const [project, setProject] = useState({ project_id: projectid.projectid });
  const [imageUrl, setImageUrl] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

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

  // Add this to expose the file input click functionality to parent components
  useImperativeHandle(ref, () => ({
    triggerFileInputClick: () => {
      document.getElementById('upload-image-input').click();
    }
  }));

  const getImages = async () => {
    try {
      const { data: imageData, error: imageError } = await supabaseClient
        .from("images")
        .select("image_urls")
        .eq("project_id", project.project_id);

      console.log("imageData: ", imageData);

      if (imageError) {
        console.error("Error fetching images:", imageError);
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
    } catch (imageError) {
      console.log(imageError);
    }
  };

  useEffect(() => {
    getImages();
  }, [imageUrl]);

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

    const urlParts = imageUrl.split('/');
    const imagePathIndex = urlParts.findIndex(part => part === 'images') + 1;
    const imagePath = urlParts.slice(imagePathIndex).join('/');
    console.log("Image Path: ", imagePath);

    const { error: dbError } = await supabaseClient
      .from('images')
      .delete()
      .match({ image_urls: imagePath });

    if (dbError) {
      console.error('Error deleting image URL from the database:', dbError);
      setSnackbarMessage("Failed to delete image URL from the database.");
      setOpenSnackbar(true);
      return;
    }


    // Step 2: Delete the image from storage
    const { error: storageError } = await supabaseClient
      .storage
      .from('images')
      .remove([imagePath]);

    if (storageError) {
      console.error('Error deleting image file from storage:', storageError);
      setSnackbarMessage("Failed to delete image file from storage.");
      setOpenSnackbar(true);
      return;
    }

    setSnackbarMessage("Image deleted successfully!");
    setOpenSnackbar(true);

  };


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
      setSnackbarMessage("Image Uploaded Successfully!");
      setOpenSnackbar(true);
    } else {
      console.error("Error uploading image", error);
    }

    await getImages();
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
      <FormGroup >
        <Typography margin={2} level="h2">Image Gallery</Typography>
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
      <Grid container marginTop={2} spacing={2} justifyContent="center">
        {imageUrls.map((imageUrl) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={imageUrl}>
            <Card
              variant="outlined"
              sx={{
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
                    padding: "2px",
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
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default forwardRef(Images);
