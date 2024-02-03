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
import Project from "./pages/Projects/Project.jsx"; // Import the Project component
import EditProject from "./pages/Projects/EditProject.jsx"; // Import the Edit component

function App() {
  return (
    <div style={{ display: 'flex' }}>
      <Header />
      <Sidebar />
      <main style={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/projects">
            <Route index element={<Projects/>}/>
            <Route path=":id" element={<Project/>} />
            <Route path="edit/:id" element={<EditProject/>} />
          </Route>
          <Route path="/clients">
            <Route index element={<ClientList/>}/>
            <Route path=":id" element={<Client/>}/>
            <Route path="new" element={<NewClient/>}/>
          </Route>

          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </main>
    </div>
  );
}

export default App;
