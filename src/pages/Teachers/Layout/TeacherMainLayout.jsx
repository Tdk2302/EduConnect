import React, { useState } from "react";
import { Box } from "@mui/material";
import SideBar from "./SideBar";

import NotificationDashboard from "../Notification/NotificationBox";
import TeacherSchedulePage from "./TeacherSchedulePage";
import ReportCreate from "../Report/ReportCreate";
import "./TeacherMainLayout.css";

export default function TeacherMainLayout() {
  const [selected, setSelected] = useState("notify");

  let content;
  if (selected === "notify") content = <NotificationDashboard />;
  else if (selected === "schedule") content = <TeacherSchedulePage />;
  else content = <ReportCreate />;

  return (
    <Box sx={{ display: "flex", flexDirection: 'column', height: "100vh" }}>
      <Box sx={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <SideBar selected={selected} onSelect={setSelected} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "#f4f6fa",
            height: "100%",
            overflowY: "auto",
            p: 3,
          }}
        >
          {content}
        </Box>
      </Box>
    </Box>
  );
}
