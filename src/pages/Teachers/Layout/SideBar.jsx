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
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { getUserInfo } from "../../../services/handleStorageApi";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;
const collapsedWidth = 80;

const NAV_ITEMS = [
  { key: "notify", label: "Thông Báo", icon: <NotificationsIcon /> },
  { key: "schedule", label: "Thời khóa biểu", icon: <CalendarMonthIcon /> },
  { key: "report", label: "Tạo báo cáo", icon: <AssignmentIcon /> },
];

const MAIN_BRAND = "#6D28D9";
const BACKGROUND_BRAND = "#EAF1FF";
const SECONDARY = "#E5E7EB";
const TERTIARY = "#1F2937";
const DARK_LIGHT = "#9CA3AF";

export default function SideBar({ selected, onSelect }) {
  const [open, setOpen] = useState(true);
  const user = getUserInfo();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleProfile = () => {
    handleMenuClose();
    navigate("/profile");
  };
  const handleLogout = () => {
    handleMenuClose();
    localStorage.clear();
    navigate("/signin");
  };

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
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : collapsedWidth,
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          boxSizing: "border-box",
          position: "static",
          border: "none",
          backgroundColor: BACKGROUND_BRAND,
          overflowX: "hidden",
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
              onClick={() => onSelect(item.key)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                color: selected === item.key ? "#fff" : TERTIARY,
                background: selected === item.key ? MAIN_BRAND : "transparent",
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
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ p: 2, m: 1, borderRadius: 2, background: SECONDARY }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: open ? "flex-start" : "center",
            position: "relative",
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
          {user?.role === "Teacher" && (
            <>
              <IconButton
                size="small"
                onClick={handleMenuClick}
                sx={{ ml: open ? 1 : 0 }}
              >
                <ArrowDropDownIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem onClick={handleProfile}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Box>
    </Drawer>
  );
}
