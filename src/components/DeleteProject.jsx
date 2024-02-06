import React from 'react'
import { supabaseClient } from '../supabase'

export async function DeleteProject(project_id){
    const { error } = await supabaseClient.from("projects").delete().match({ project_id });
    if (error) {
      console.error("Error deleting project:", error);
    } else {
      console.log("Project deleted successfully");
    //   setProjects(projects.filter((project) => project.project_id !== project_id));
    }
}
