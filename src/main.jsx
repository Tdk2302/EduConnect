import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import DashBoard from "./component/dashboard.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <DashBoard />
  </StrictMode>
);
