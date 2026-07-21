
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app.jsx";
import "./app.css";

// Punto de arranque de la aplicación.
// Aquí React "engancha" el componente app al <div id="root"> del index.html
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);