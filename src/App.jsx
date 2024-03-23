import * as React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import ClientsPage from "./pages/Clients/ClientsPage.jsx";
import NotFound from "./pages/NotFound.jsx";
import ProjectPage from "./pages/Projects/ProjectPage.jsx";
import ProjectDetailsPage from "./pages/Projects/ProjectDetailsPage.jsx"; // Import the project details component
// import ProjectForm from "./pages/Projects/ProjectForm.jsx"; // Import the project form component
import ProjectForm from "./components/project/ProjectForm.jsx";

// Auth Pages:
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import CreateUserPage from "./pages/Auth/CreateUserPage.jsx";
import ConfirmationPage from "./pages/Auth/ConfirmationPage.jsx";
import PasswordPage from "./pages/Auth/PasswordPage.jsx";

// Protected Route:
import Protected from './components/Protected';
import ClientDetailsPage from "./pages/Clients/ClientDetailsPage.jsx";
import ClientForm from "./components/client/ClientForm.jsx";
import ForgotPassword from './pages/Auth/ForgotPassword.jsx';
import TasksPage from './pages/Tasks/TasksPage.jsx';
import TaskForm from './components/tasks/TaskForm.jsx';
import AdminPanel from './pages/AdminPanel/AdminPanel.jsx'

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
              <Route index element={<ClientsPage />} />
              <Route path=":id" element={<ClientDetailsPage />} />
              <Route path="new" element={<ClientForm />} />
              <Route path="edit/:clientId" element={<ClientForm />} />
            </Route>

             {/* TASKS ROUTES */}

             <Route path="/tasks">
              <Route index element={<TasksPage/>}/>
              <Route path="new" element={<TaskForm/>}/>
              <Route path="edit/:taskid" element={<TaskForm/>}/>
             </Route>

            {/* ADMIN ROUTES */}


          </Route> {/* END OF PROTECTED ROUTE */}
            <Route path="/confirm-signup" element={<ConfirmationPage/>} />
            <Route path="/set-password" element={<PasswordPage/>} />
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