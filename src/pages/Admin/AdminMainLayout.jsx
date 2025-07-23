import { Layout, Menu } from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { getUserInfo, logoutUser } from "../../services/handleStorageApi";
import { Avatar, Button, Tooltip } from "antd";
import { LogoutOutlined } from "@ant-design/icons";

const { Sider, Content } = Layout;

const navItems = [
  {
    key: "users",
    icon: <UserOutlined />,
    label: "Quản lý người dùng",
    path: "/admin/manage-user",
  },
  {
    key: "create-schedule",
    icon: <CalendarOutlined />,
    label: "Tạo TKB GV",
    path: "/admin/create-course",
  },
  {
    key: "settings",
    icon: <SettingOutlined />,
    label: "Cài đặt",
    path: "/admin/settings",
  },
];

export default function AdminMainLayout() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const user = getUserInfo();
  const selectedKey = navItems.find(
    (item) => location.pathname.includes(item.path.replace("/admin", ""))
  )?.key;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        style={{ background: "#fff", boxShadow: "2px 0 8px #f0f1f2", position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 100 }}
        width={220}
      >
        <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", fontWeight: 700, fontSize: 22, color: "#14448b", letterSpacing: 1, padding: "0 16px" }}>
          <span style={{ display: collapsed ? "none" : "block" }}>EduConnect</span>
          <span onClick={() => setCollapsed(!collapsed)} style={{ cursor: "pointer", fontSize: 20 }}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </span>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          style={{ borderRight: 0, fontWeight: 600, fontSize: 16, marginTop: 8 }}
          items={navItems.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: item.label,
            onClick: () => navigate(item.path),
          }))}
        />
        {/* Sidebar Footer: User Info + Logout */}
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: "100%",
            padding: collapsed ? "12px 0" : "16px 16px",
            borderTop: "1px solid #f0f1f2",
            background: "#fff",
            display: "flex",
            flexDirection: collapsed ? "column" : "row",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            transition: "all 0.2s"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", flexDirection: collapsed ? "column" : "row", width: "100%", justifyContent: collapsed ? "center" : "flex-start" }}>
            <Avatar size={collapsed ? 36 : 40} src={user?.avatar || "https://randomuser.me/api/portraits/men/32.jpg"} style={{ marginRight: collapsed ? 0 : 12, marginBottom: collapsed ? 6 : 0, border: "2px solid #14448b" }} />
            {!collapsed && (
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: "#222" }}>{user?.fullName || "Admin"}</div>
                <div style={{ fontSize: 13, color: "#888" }}>{user?.email || ""}</div>
              </div>
            )}
          </div>
          <Tooltip title="Đăng xuất">
            <Button
              type="text"
              icon={<LogoutOutlined style={{ color: "#e11d48", fontSize: 20 }} />}
              onClick={() => { logoutUser(); navigate("/signin"); }}
              style={{ marginLeft: collapsed ? 0 : 8, marginTop: collapsed ? 4 : 0, display: "flex", alignItems: "center", justifyContent: "center" }}
            />
          </Tooltip>
        </div>
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 220, minHeight: "100vh", transition: "margin-left 0.2s" }}>
        <Content style={{ margin: 0, background: "#f7faff", minHeight: "100vh", padding: 0, transition: "all 0.2s" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
