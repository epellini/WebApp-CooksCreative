import React, { useState, useEffect } from 'react';
import { LinearProgress, Typography } from '@mui/joy'; // Import Joy UI components
import { supabaseClient } from "../../supabase-client"; // Import the supabase client

const DashboardStats = () => {
    const [tasks, setTasks] = useState([]); // State to hold the tasks
    const [projects, setProjects] = useState([]); // State to hold the projects
    const [loading, setLoading] = useState(true); // State to track loading status

    // Fetch tasks and projects from Supabase
    async function fetchTasksAndProjects() {
        try {
            // Fetch tasks
            const { data: tasksData, error: tasksError } = await supabaseClient
                .from('tasks')
                .select('*');
            if (tasksError) throw tasksError;

            // Fetch projects
            const { data: projectsData, error: projectsError } = await supabaseClient
                .from('projects')
                .select('*');
            if (projectsError) throw projectsError;

            setTasks(tasksData); // Set tasks state
            setProjects(projectsData); // Set projects state
            setLoading(false); // Set loading state to false
        } catch (error) {
            console.error('Error fetching data:', error.message);
            setLoading(false); // Set loading state to false in case of error
        }
    }

    useEffect(() => {
        fetchTasksAndProjects(); // Fetch data when component mounts
    }, []);

    if (loading) {
        return <LinearProgress />; // Display loading indicator while data is being fetched
    }

    return (
        <div>
            <Typography variant="body1">Projects: {projects.length}</Typography>
            <Typography variant="body1">Tasks: {tasks.length}</Typography>
        </div>
    );
};

export default DashboardStats;
