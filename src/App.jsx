import * as React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Clients from "./pages/Clients/Clients.jsx";
import NotFound from "./pages/NotFound.jsx";
import ProjectPage from "./pages/Projects/ProjectPage.jsx";
import ProjectDetailsPage from "./pages/Projects/ProjectDetailsPage.jsx"; // Import the project details component
// import ProjectForm from "./pages/Projects/ProjectForm.jsx"; // Import the project form component
import ProjectForm from "./components/project/ProjectForm.jsx";

// Auth Pages:
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import CreateUserPage from "./pages/Auth/CreateUserPage.jsx";
// Protected Route:
import Protected from './components/Protected';
import ClientDetails from './pages/Clients/ClientDetails.jsx';
import ClientForm from './pages/Clients/ClientForm.jsx';
import ForgotPassword from './pages/Auth/ForgotPassword.jsx';
import TasksPage from './pages/Tasks/TasksPage.jsx';
import TaskForm from './components/tasks/TaskFormAdd.jsx';


function App() {
  return (
    <div style={{ display: "flex" }}>
      <main style={{ flexGrow: 1 }}>
        <Routes>
          {/* AUTH ROUTES */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* END OF AUTH ROUTES */}
          {/* PROTECTED ROUTE */}
          <Route path="/" element={<Protected />}>
            {/* HOME ROUTE */}
            <Route index element={<Home/>} />

            {/* PROJECTS ROUTES */}
            <Route path="/projects">
              <Route index element={<ProjectPage />} />
              <Route path=":id" element={<ProjectDetailsPage />} />
              <Route path="new" element={<ProjectForm />} />
              <Route path="edit/:projectid" element={<ProjectForm />} />
            </Route>

            {/* CLIENTS ROUTES */}
            <Route path="/clients" element={<Protected isAdminRoute={true} />}>
              <Route index element={<Clients />} />
              <Route path=":id" element={<ClientDetails />} />
              <Route path="new" element={<ClientForm />} />
              <Route path="edit/:clientId" element={<ClientForm />} />
            </Route>

             {/* TASKS ROUTES */}

             <Route path="/tasks">
              <Route index element={<TasksPage/>}/>
              <Route path="new" element={<TaskForm/>}/>
             </Route>




          </Route> {/* END OF PROTECTED ROUTE */}
          
            <Route path="/create-user" element={<CreateUserPage/>} />
            <Route path="/forgot-password" element={<ForgotPassword/>} />
          {/* NOT FOUND ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
