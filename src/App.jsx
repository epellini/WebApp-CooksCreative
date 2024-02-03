import * as React from 'react';
import { Routes, Route } from "react-router-dom";
import Sidebar from './components/Sidebar'; // Import the Sidebar component
import Header from './components/Header';
import Home from "./pages/Home.jsx";
import NewClient from "./pages/Clients/NewClient.jsx";
import Client from "./pages/Clients/Client.jsx";
import ClientList from "./pages/Clients/ClientList.jsx";
import NotFound from "./pages/NotFound.jsx";
import Projects from "./pages/Projects/Projects.jsx";
import ProjectDetails from "./pages/Projects/ProjectDetails"; // Import the Project component
import EditProject from "./pages/Projects/EditProject.jsx"; // Import the Edit component


// Auth Pages:
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
// Protected Route:
import Protected from './components/Protected';


function App() {
  return (
    <div style={{ display: 'flex' }}>
      <main style={{ flexGrow: 1 }}>

        <Routes>
          {/* AUTH ROUTES */}
          <Route path="/login" element={<Login/>} /> 
          <Route path="/register" element={<Register/>} /> 
          {/* END OF AUTH ROUTES */}

        {/* ALL THE PROTECTED ROUTES GO BELOW */}
          <Route path="/" element={<Protected/>} >
            <Route path='/' element={<Home/>} /> {/* HOME ROUTE */}
          
            {/* PROJECTS ROUTES */}
            <Route path="/projects">
            <Route index element={<Projects/>}/>
            <Route path=":id" element={<ProjectDetails/>} />
            <Route path="edit/:id" element={<EditProject/>} />
            </Route>
            
            {/* CLIENTS ROUTES */}
            <Route path="/clients"> 
            <Route index element={<ClientList/>}/>
            <Route path=":id" element={<Client/>}/>
            <Route path="new" element={<NewClient/>}/>
            </Route>
          </Route> {/* END OF PROTECTED ROUTES */}
          
          <Route path="*" element={<NotFound/>}/> {/* NOT FOUND ROUTE */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
