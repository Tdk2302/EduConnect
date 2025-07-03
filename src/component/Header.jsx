import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { getUserInfo, logoutUser } from "../services/handleStorageApi";

const Logo = ({ navigate }) => (
  <Typography
    variant="h6"
    sx={{
      fontWeight: 700,
      fontSize: 30,
      margin: "20px 0px",
      letterSpacing: 1,
      color: "#4B1EFF",
      userSelect: "none",
      cursor: "pointer",
    }}
    onClick={() => navigate("/homepage")}
  >
    Edu<span style={{ color: "#E53945" }}>Connect</span>
  </Typography>
);

const menuItems = [
  { label: "Schedule", path: "/student-schedule" },
  { label: "Chat Bot", path: "/chatbot" },
  { label: "Notifications", path: "/notifications" },
];

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  textTransform: "none",
  fontWeight: 500,
  fontSize: 15,
  marginLeft: theme.spacing(2),
}));

const Header = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const user = getUserInfo();
  const isLoggedIn = !!user;

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    logoutUser();
    handleMenuClose();
    navigate("/signin");
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: "#fff",
        color: "#222",
        boxShadow: "none",
        borderBottom: "1px solid #f2f2f2",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", minHeight: 80 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Logo navigate={navigate} />
          <Box sx={{ display: { xs: "none", md: "flex" }, ml: 4, gap: 2 }}>
            {menuItems.map((item, idx) => (
              <Box
                key={item.label}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  ml: 2,
                  fontSize: 20,
                  borderRadius: 2,
                  padding: "10px 20px",
                  marginRight: 2,
                  transition: "background 0.2s",
                  background: activeMenu === idx ? "#f0f0ff" : "transparent",
                  "&:hover": {
                    background: "#f5f5f5",
                  },
                  cursor: "pointer",
                }}
                onClick={() => {
                  setActiveMenu(idx);
                  if (item.path) {
                    navigate(item.path);
                  }
                }}
              >
                <Typography
                  sx={{
                    fontWeight: activeMenu === idx ? 700 : 400,
                    fontSize: 19,
                    marginLeft: 5,
                  }}
                >
                  {item.label}
                </Typography>
                {item.dropdown && (
                  <ExpandMoreIcon sx={{ fontSize: 18, ml: 0.5 }} />
                )}
              </Box>
            ))}
            {/* Teacher Only Section */}
            {user?.role === "Teacher" && (
              <Box
                sx={{
                  ml: 3,
                  px: 2.5,
                  py: 1.2,
                  borderRadius: 2,
                  background: "#6D28D9",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 17,
                  letterSpacing: 0.5,
                  boxShadow: 1,
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer"
                }}
                onClick={() => navigate("/teacher")}
              >
                Teacher Hub
              </Box>
            )}
          </Box>
        </Box>
        <Box>
          {!isLoggedIn ? (
            <>
              <StyledButton
                variant="outlined"
                sx={{
                  borderColor: "#4B1EFF",
                  color: "#4B1EFF",
                  mr: 2,
                  minWidth: 90,
                }}
                onClick={() => navigate("/signin")}
              >
                Đăng nhập
              </StyledButton>
              <StyledButton
                variant="contained"
                sx={{
                  background: "#E53945",
                  color: "#fff",
                  minWidth: 100,
                  boxShadow: "none",
                  "&:hover": { background: "#c62832" },
                }}
                onClick={() => navigate("/register")}
              >
                Đăng kí
              </StyledButton>
            </>
          ) : (
            <>
              <IconButton onClick={handleMenuOpen} color="inherit">
                <AccountCircleIcon sx={{ fontSize: 40 }} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{
                  zIndex: 1300,
                  fontSize: 20,
                  fontWeight: 500,
                }}
              >
                <MenuItem
                  sx={{
                    fontSize: 18,
                    fontWeight: 500,
                    color: "#222",
                  }}
                  onClick={() => navigate("/profile")}
                >
                  Hồ sơ
                </MenuItem>
                <MenuItem
                  sx={{
                    fontSize: 18,
                    fontWeight: 500,
                    color: "#222",
                  }}
                  onClick={handleMenuClose}
                >
                  Cài đặt
                </MenuItem>
                <MenuItem
                  sx={{
                    fontSize: 18,
                    fontWeight: 500,
                    color: "#222",
                  }}
                  onClick={handleLogout}
                >
                  Đăng xuất
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
