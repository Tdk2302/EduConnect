import React, { useState } from "react";
import { Box } from "@mui/material";
import AdminSidebar from "./AdminSidebar";
import { useNavigate, Outlet } from "react-router-dom";

export default function AdminMainLayout() {
  const [selected, setSelected] = useState("users");
  const navigate = useNavigate();

  const handleSelect = (key) => {
    setSelected(key);
    if (key === "create-schedule") {
      navigate("/admin/create-schedule");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Box sx={{ display: "flex", flex: 1, minHeight: 0 }}>
        <AdminSidebar selected={selected} onSelect={handleSelect} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: "100%",
            overflowY: "auto",
            p: 2,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
