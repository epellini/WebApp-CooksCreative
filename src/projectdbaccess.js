import { supabaseClient } from "./supabase";

export async function GetProjects() {
  const supabase = supabaseClient;
  const { data, error } = await supabase.from("projects").select("*");
  if (error) {
    throw error;
  }

  // Add data to projects
  const projectsWithClients = await Promise.all(
    data.map(async (project) => {
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("*")
        .eq("client_id", project.client_id)
        .single();

      if (clientError) {
        throw clientError;
      }

      return { ...project, client: clientData };
    })
  );
  



  return projectsWithClients;
}