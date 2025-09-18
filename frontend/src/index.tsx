// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // importa o provider

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>   {/* ✅ daqui pra baixo todo mundo pode usar useAuth */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);