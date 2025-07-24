import React from "react";
import { Layout, Menu, Button, Avatar, Dropdown } from "antd";
import { UserOutlined, LogoutOutlined, ProfileOutlined, LoginOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getUserInfo, logoutUser } from "../services/handleStorageApi";

const { Header: AntHeader } = Layout;

const menuItems = [
  { label: "Lịch học", path: "/student-schedule" },
  { label: "Chat Bot", path: "/chatbot" },
  { label: "Thông báo", path: "/parent-notifications" },
];

export default function Header() {
  const navigate = useNavigate();
  const user = getUserInfo();
  const isLoggedIn = !!user;

  const userMenu = {
    items: [
      {
        key: "profile",
        icon: <ProfileOutlined />,
        label: "Hồ sơ",
        onClick: () => navigate("/profile"),
      },
      {
        key: "logout",
        icon: <LogoutOutlined />,
        label: "Đăng xuất",
        onClick: () => {
          logoutUser();
          navigate("/signin");
        },
      },
    ],
  };

  return (
    <AntHeader style={{ background: "#fff", padding: 0, boxShadow: "0 2px 8px #f0f1f2", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ display: "flex", alignItems: "center", height: 64, maxWidth: 1400, margin: "0 auto", padding: "0 24px", justifyContent: "space-between" }}>
        <div style={{ fontWeight: 700, fontSize: 28, color: "#14448b", letterSpacing: 1, cursor: "pointer" }} onClick={() => navigate("/homepage")}>EduConnect</div>
        <Menu
          mode="horizontal"
          style={{ flex: 1, marginLeft: 40, fontWeight: 600, fontSize: 16, background: "transparent", borderBottom: "none" }}
          selectable={false}
        >
          {menuItems.map((item) => (
            <Menu.Item key={item.path} onClick={() => navigate(item.path)}>
              {item.label}
            </Menu.Item>
          ))}
        </Menu>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {!isLoggedIn ? (
            <>
              <Button icon={<LoginOutlined />} style={{ borderRadius: 6, fontWeight: 600 }} onClick={() => navigate("/signin")}>Đăng nhập</Button>
              <Button type="primary" style={{ borderRadius: 6, fontWeight: 600 }} onClick={() => navigate("/register")}>Đăng ký</Button>
            </>
          ) : (
            <Dropdown menu={userMenu} placement="bottomRight" trigger={["click"]}>
              <Avatar style={{ backgroundColor: "#14448b", cursor: "pointer" }} icon={<UserOutlined />} />
            </Dropdown>
          )}
        </div>
      </div>
    </AntHeader>
  );
}
