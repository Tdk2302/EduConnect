import React, { useState } from "react";
import { Box } from "@mui/material";
import SideBar from "./SideBar";
import ChatBox from "./ChatBox";
import NotificationDashboard from "./NotificationBox";
import TeacherSchedulePage from "./TeacherSchedulePage";
import "./TeacherMainLayout.css"

export default function TeacherMainLayout() {
  const [selected, setSelected] = useState("notify");

  let content;
  if (selected === "chat") content = <ChatBox />;
  else if (selected === "notify") content = <NotificationDashboard />;
  else content = <TeacherSchedulePage />;

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <SideBar selected={selected} onSelect={setSelected} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#f4f6fa',
          height: "100vh",
          overflowY: "auto",
          p: 3,
        }}
      >
        {content}
      </Box>
    </Box>
  );
}
