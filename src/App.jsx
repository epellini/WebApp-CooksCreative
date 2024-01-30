import React from "react";
import "./App.css";
import { Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home.jsx";
import NewClient from "./pages/Clients/NewClient.jsx";
import Client from "./pages/Clients/Client.jsx";
import ClientList from "./pages/Clients/ClientList.jsx";
import NotFound from "./pages/NotFound.jsx";

function App() {
  return (
    <>
    <nav>
      <ul>
        <li><NavLink to="/" >Home</NavLink></li>
      </ul>
    </nav>
    <Routes>
      <Route path="/" element={<Home/>}/>

      <Route path="/clients">
        <Route index element={<ClientList/>}/>
        <Route path=":id" element={<Client/>}/>
        <Route path="new" element={<NewClient/>}/>
      </Route>
      <Route path="*" element={<NotFound/>}/>
    </Routes>
    </>
  );
}

export default App;
