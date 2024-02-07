import * as React from 'react';
import { Routes, Route } from "react-router-dom";
import Sidebar from './components/Sidebar'; // Import the Sidebar component
import Header from './components/Header';
import Home from "./pages/Home.jsx";
import Clients from "./pages/Clients/Clients.jsx";
import NotFound from "./pages/NotFound.jsx";
import Projects from "./pages/Projects/Projects.jsx";
import ProjectDetails from "./pages/Projects/ProjectDetails"; // Import the Project component
import EditProject from "./pages/Projects/EditProject.jsx"; // Import the Edit component
import AddProject from './pages/Projects/AddProject.jsx';

// Auth Pages:
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
// Protected Route:
import Protected from './components/Protected';
import ClientDetails from './pages/Clients/ClientDetails.jsx';
import ClientForm from './pages/Clients/ClientForm.jsx';


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
            <Route path="/projects/new" element={<AddProject/>} />
            </Route>
            
            {/* CLIENTS ROUTES */}
            <Route path="/clients"> 
            <Route index element={<Clients/>}/>
            <Route path=":id" element={<ClientDetails/>}/>
            <Route path="/clients/new" element={<ClientForm/>}/>
            <Route path="/clients/edit/:clientId" element={<ClientForm />} />
            </Route>
          </Route> {/* END OF PROTECTED ROUTES */}
          
          <Route path="*" element={<NotFound/>}/> {/* NOT FOUND ROUTE */}
        </Routes>
      </main>
    </div>
  );
}

export default App;