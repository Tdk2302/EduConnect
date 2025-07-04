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
    <Box sx={{ display: "flex", flexDirection: 'column', height: "100vh" }}>
      <Box sx={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <AdminSidebar selected={selected} onSelect={setSelected} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: "100%",
            overflowY: "auto",
            p: 2,
          }}
        >
          {content}
        </Box>
      </Box>
    </Box>
  );
} 