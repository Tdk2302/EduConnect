import React, { useState } from "react";
import { Box } from "@mui/material";
import AdminSidebar from "./AdminSidebar";
import ManageUser from "./ManageUser";
import AdminSettings from "./AdminSettings";

export default function AdminMainLayout() {
  const [selected, setSelected] = useState("users");

  let content;
  if (selected === "users") content = <ManageUser />;
  else content = <AdminSettings />;

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <AdminSidebar selected={selected} onSelect={setSelected} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: "100vh",
          overflowY: "auto",
          p: 2,
        }}
      >
        {content}
      </Box>
    </Box>
  );
} 