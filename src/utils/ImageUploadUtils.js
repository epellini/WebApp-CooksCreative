import { supabaseClient } from "../supabase-client";
import { v4 as uuidv4 } from 'uuid'; // Importing the UUID function

export const uploadImageToSupabase = async (file, projectId) => {
  try {
    const fileExt = file.name.split(".").pop(); // Retrieving the file extension
    const fileName = `${uuidv4()}.${fileExt}`; // Using UUID for a unique file name
    const filePath = `projects/${projectId}/${fileName}`; // Construct the path where the file will be stored in Supabase Storage

    console.log(`Uploading to: ${filePath}`); // Debugging line

    const { error: uploadError } = await supabaseClient.storage
      .from("images")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Upload error:", uploadError.message);
      throw new Error(uploadError.message);
    }

    // Retrieve the public URL for the uploaded file
    const { publicURL, error: urlError } = supabaseClient.storage
      .from("images")
      .getPublicUrl(filePath);

      if (urlError) {
        console.error("URL error:", urlError.message);
        throw new Error(urlError.message);
      }

    return publicURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error; // Rethrow to handle it in the component
  }
};



// import { supabaseClient } from "../supabase-client";

// export const uploadImageToSupabase = async (file) => {
//   try {

//     const fileExt = file.name.split(".").pop(); // Retrieving the file extension 
//     const fileName = `${Math.random()}.${fileExt}`; // Ensure unique file names
//     const filePath = `projects/${projectId}/${fileName}`; // It constructs the path where the file will be stored in Supabase Storage. It prefixes the unique file name with the directory path. 

//     const { error, data } = await supabaseClient.storage
//       .from("images")
//       .upload(filePath, file);

//     if (error) throw new Error(error.message);

//     // Assuming you want to return the public URL
//     const { publicURL } = supabaseClient.storage
//       .from("images")
//       .getPublicUrl(filePath);

//     return publicURL;
//   } catch (error) {
//     console.error("Error uploading image:", error);
//     throw error; // Rethrow to handle it in the component
//   }
// };