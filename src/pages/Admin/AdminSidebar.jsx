import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Divider,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";

import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import EventNoteIcon from '@mui/icons-material/EventNote';

import { getUserInfo } from "../../services/handleStorageApi";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/handleStorageApi";

const drawerWidth = 240;
const collapsedWidth = 80;

const NAV_ITEMS = [
  { key: "users", label: "Quản lý người dùng", icon: <PeopleIcon />, path: "/admin/manage-user" },
  { key: "create-schedule", label: "Tạo TKB GV", icon: <EventNoteIcon />, path: "/admin/create-course" },
  { key: "settings", label: "Cài đặt", icon: <SettingsIcon />, path: "/admin/settings" },
];

const MAIN_BRAND = "#6D28D9";
const BACKGROUND_BRAND = "#EAF1FF";
const SECONDARY = "#E5E7EB";
const TERTIARY = "#1F2937";
const DARK_LIGHT = "#9CA3AF";

export default function AdminSidebar({ selected, onSelect }) {
  const [open, setOpen] = useState(true);
  const user = getUserInfo();
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={(theme) => ({
        width: open ? drawerWidth : collapsedWidth,
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        flexShrink: 0,
        height: "100vh",
        border: "none",
        borderRadius: "18px 0 0 18px",
        boxShadow: "0 8px 32px 0 rgba(30,64,175,0.13)",
        background: "#fff",
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : collapsedWidth,
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          boxSizing: "border-box",
          position: "static",
          border: "none",
          borderRadius: "18px 0 0 18px",
          boxShadow: "0 8px 32px 0 rgba(30,64,175,0.13)",
          background: "#fff",
          overflow: "hidden",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        },
      })}
    >
      <Toolbar
        sx={{
          minHeight: 56,
          px: open ? 2 : 2.5,
          justifyContent: open ? "space-between" : "center",
        }}
      >
        {open && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <img
              src="https://marketplace.canva.com/EAGG4nPLU7w/4/0/1600w/canva-blue-%26-gold-circle-illustrative-education-logo-r2giuWawSvQ.jpg"
              alt="logo"
              style={{ width: 32, height: 32, borderRadius: "50%" }}
            />
            <Typography
              variant="h6"
              sx={{
                color: MAIN_BRAND,
                fontWeight: 700,
                letterSpacing: 0.5,
                fontSize: 19,
              }}
            >
              EduConnect
            </Typography>
          </Box>
        )}
        <IconButton
          onClick={() => setOpen((v) => !v)}
          size="small"
          sx={{ color: MAIN_BRAND, background: SECONDARY }}
        >
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Toolbar>
      <Divider sx={{ borderColor: SECONDARY }} />
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <List sx={{ pt: 1, px: 1 }}>
          {NAV_ITEMS.map((item) => (
            <Tooltip
              key={item.key}
              title={!open ? item.label : ""}
              placement="right"
            >
              <ListItem
                button
                selected={selected === item.key}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  color: selected === item.key ? "#fff" : TERTIARY,
                  background:
                    selected === item.key ? MAIN_BRAND : "transparent",
                  fontWeight: selected === item.key ? 700 : 500,
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: open ? 2 : 1.5,
                  transition: "background 0.2s, color 0.2s",
                  "&:hover": {
                    background: selected === item.key ? MAIN_BRAND : SECONDARY,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: selected === item.key ? "#fff" : MAIN_BRAND,
                    minWidth: 36,
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {open && (
                  <ListItemText
                    primary={item.label}
                    sx={{
                      ".MuiTypography-root": {
                        fontSize: 15,
                        fontWeight: "inherit",
                        color: selected === item.key ? "#fff" : DARK_LIGHT,
                      },
                    }}
                  />
                )}
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </Box>
      <Box
        sx={{
          p: 2,
          m: 1,
          borderRadius: 2,
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "space-between" : "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: open ? "flex-start" : "center",
          }}
        >
          <Avatar
            src={
              user?.avatar || "https://randomuser.me/api/portraits/men/32.jpg"
            }
            alt={user?.fullName || "User"}
            sx={{
              width: 40,
              height: 40,
              mr: open ? 1.5 : 0,
              border: `2px solid ${MAIN_BRAND}`,
            }}
          />
          {open && (
            <Box>
              <Typography
                sx={{ fontWeight: 600, fontSize: 15, color: TERTIARY }}
              >
                {user?.fullName || "User"}
              </Typography>
              <Typography sx={{ fontSize: 13, color: DARK_LIGHT }}>
                {user?.email || ""}
              </Typography>
            </Box>
          )}
        </Box>

        {open && (
          <Tooltip title="Đăng xuất">
            <IconButton onClick={() => { logoutUser(); navigate('/signin'); }} sx={{ color: '#e11d48', ml: 1 }}>
              <LogoutOutlinedIcon fontSize="medium" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Drawer>
  );
}
