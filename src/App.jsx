// src/App.jsx

import { Outlet } from "react-router-dom";
import "./App.css";
import Header from "@/components/Header"; // Import Header component

const App = () => {
  return (
    <div className="app-container">
      <div className="header-container">
        <Header />
      </div>
      <div className="main-container">
        <div className="sidenav-container"></div>
        <div className="app-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default App;
