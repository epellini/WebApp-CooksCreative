import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./pages/Auth/Auth";
import RootLayout from "./components/RootLayout";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CssVarsProvider>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <RootLayout>
            <App />
          </RootLayout>
        </AuthProvider>
      </BrowserRouter>
    </CssVarsProvider>
  </React.StrictMode>
);
