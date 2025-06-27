import React, { useState } from "react";
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, IconButton, Avatar, Divider, Tooltip } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const drawerWidth = 240;
const collapsedWidth = 80;

const NAV_ITEMS = [
  { key: "chat", label: "ChatBox (A.I BOT)", icon: <ChatIcon /> },
  { key: "notify", label: "Thông Báo", icon: <NotificationsIcon /> },
  { key: "schedule", label: "Thời khóa biểu", icon: <CalendarMonthIcon /> },
];

const USER = {
  name: "Khiêm Lặc to",
  email: "KhiemL@Tgmail.com",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
};

const MAIN_BLUE = "#2563eb"; // primary blue
const NAVY = "#1e293b"; // dark blue-gray
const LIGHT_BLUE = "#eaf1fb"; // light blue background
const HOVER_BLUE = "#dbeafe"; // hover
const TEXT_BLUE = "#2563eb";
const TEXT_GRAY = "#64748b";

export default function SideBar({ selected, onSelect }) {
  const [open, setOpen] = useState(true);

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={(theme) => ({
        width: open ? drawerWidth : collapsedWidth,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : collapsedWidth,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          boxSizing: 'border-box',
          position: 'static',
          border: 'none',
          backgroundColor: '#eaf1fb',
          overflowX: 'hidden',
        },
      })}
    >
      <Toolbar sx={{ minHeight: 56, px: open ? 2 : 2.5, justifyContent: open ? 'space-between' : 'center' }}>
        {open && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <img src="https://marketplace.canva.com/EAGG4nPLU7w/4/0/1600w/canva-blue-%26-gold-circle-illustrative-education-logo-r2giuWawSvQ.jpg" alt="logo" style={{ width: 32, height: 32, borderRadius: '50%' }} />
            <Typography variant="h6" sx={{ color: "#2563eb", fontWeight: 700, letterSpacing: 0.5, fontSize: 19 }}>
              EduConnect
            </Typography>
          </Box>
        )}
        <IconButton onClick={() => setOpen((v) => !v)} size="small" sx={{ color: "#2563eb", background: "#dbeafe" }}>
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Toolbar>
      <Divider sx={{ borderColor: "#dbeafe" }} />
      <List sx={{ pt: 1, px: 1 }}>
        {NAV_ITEMS.map((item) => (
          <Tooltip key={item.key} title={!open ? item.label : ""} placement="right">
            <ListItem
              button
              selected={selected === item.key}
              onClick={() => onSelect(item.key)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                color: selected === item.key ? "#fff" : TEXT_BLUE,
                background: selected === item.key ? MAIN_BLUE : "transparent",
                fontWeight: selected === item.key ? 700 : 500,
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: open ? 2 : 1.5,
                transition: "background 0.2s, color 0.2s",
                "&:hover": { background: selected === item.key ? MAIN_BLUE : HOVER_BLUE },
              }}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 36, justifyContent: "center" }}>{item.icon}</ListItemIcon>
              {open && <ListItemText primary={item.label} sx={{ ".MuiTypography-root": { fontSize: 15, fontWeight: 'inherit' } }} />}
            </ListItem>
          </Tooltip>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ p: 2, m: 1, borderRadius: 2, background: "#dbeafe" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: open ? "flex-start" : "center" }}>
          <Avatar src={USER.avatar} alt={USER.name} sx={{ width: 40, height: 40, mr: open ? 1.5 : 0, border: `2px solid ${MAIN_BLUE}` }} />
          {open && (
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: 15, color: NAVY }}>{USER.name}</Typography>
              <Typography sx={{ fontSize: 13, color: TEXT_GRAY }}>{USER.email}</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Drawer>
  );
} 