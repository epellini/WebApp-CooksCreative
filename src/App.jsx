import * as React from 'react';
import { Routes, Route} from "react-router-dom";
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from "./pages/Home.jsx";
import NewClient from "./pages/Clients/NewClient.jsx";
import Client from "./pages/Clients/Client.jsx";
import ClientList from "./pages/Clients/ClientList.jsx";
import NotFound from "./pages/NotFound.jsx";
import Projects from "./pages/Projects.jsx";
import Login from "./pages/auth/Login.jsx";
import ProtectedRoute from './ProtectedRoute.jsx';

function App() {
  return (
    <div style={{ display: 'flex' }}>
      <ProtectedRoute>
      <Header />
      <Sidebar/>
      </ProtectedRoute>
      <main style={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/projects" element={ <ProtectedRoute><Projects/></ProtectedRoute>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/clients" >
            <Route index element={<ProtectedRoute> <ClientList/> </ProtectedRoute>}/>
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
