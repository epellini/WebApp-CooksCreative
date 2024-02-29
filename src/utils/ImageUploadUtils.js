import { supabaseClient } from "../supabase-client";

export const uploadImageToSupabase = async (file) => {
  try {

    const fileExt = file.name.split(".").pop(); // Retrieving the file extension 
    const fileName = `${Math.random()}.${fileExt}`; // Ensure unique file names
    const filePath = `projects/${fileName}`; // It constructs the path where the file will be stored in Supabase Storage. It prefixes the unique file name with the directory path. 

    const { error, data } = await supabaseClient.storage
      .from("images")
      .upload(filePath, file);

    if (error) throw new Error(error.message);

    // Assuming you want to return the public URL
    const { publicURL } = supabaseClient.storage
      .from("images")
      .getPublicUrl(filePath);

    return publicURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error; // Rethrow to handle it in the component
  }
};
