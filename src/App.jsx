import * as React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import ClientsPage from "./pages/Clients/ClientsPage.jsx";
import NotFound from "./pages/NotFound.jsx";
import ProjectPage from "./pages/Projects/ProjectPage.jsx";
import ProjectDetailsPage from "./pages/Projects/ProjectDetailsPage.jsx";
import ProjectForm from "./components/project/ProjectForm.jsx";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import CreateUserPage from "./pages/Auth/CreateUserPage.jsx";
import ConfirmationPage from "./pages/Auth/ConfirmationPage.jsx";
import PasswordPage from "./pages/Auth/PasswordPage.jsx";
import Protected from './components/Protected';
import ClientDetailsPage from "./pages/Clients/ClientDetailsPage.jsx";
import ClientForm from "./components/client/ClientForm.jsx";
import ForgotPassword from './pages/Auth/ForgotPassword.jsx';
import TasksPage from './pages/Tasks/TasksPage.jsx';
import TaskForm from './components/tasks/TaskForm.jsx';
import AdminPanel from './pages/AdminPanel/AdminPanel.jsx';
import { useAuth } from "./pages/Auth/Auth.jsx";

function App() {
  const { isAdmin, user } = useAuth();

  
  return (
    <div style={{ display: "flex" }}>
      <main style={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Protected />}>
            <Route index element={<Home/>} />
            <Route path="/projects">
              <Route index element={<ProjectPage />} />
              <Route path=":id" element={<ProjectDetailsPage />} />
              <Route path="new" element={<ProjectForm />} />
              <Route path="edit/:projectid" element={<ProjectForm />} />
            </Route>
            {isAdmin && (
              <Route path="/clients" element={<ClientsPage />} />
            )}
            <Route path="/tasks">
              <Route index element={<TasksPage/>}/>
              <Route path="new" element={<TaskForm/>}/>
              <Route path="edit/:taskid" element={<TaskForm/>}/>
            </Route>
          </Route>
          <Route path="/confirm-signup" element={<ConfirmationPage/>} />
          <Route path="/set-password" element={<PasswordPage/>} />
          <Route path="/create-user" element={<CreateUserPage/>} />
          <Route path="/forgot-password" element={<ForgotPassword/>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
