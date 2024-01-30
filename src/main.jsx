import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
     <CssVarsProvider>
      <CssBaseline />
    <BrowserRouter>
      <App />
    </BrowserRouter>
     </CssVarsProvider>
  </React.StrictMode>
);
