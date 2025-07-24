import { Layout, Menu, Avatar, Typography, Button } from "antd";
import {
  DashboardOutlined,
  NotificationOutlined,
  CalendarOutlined,
  FileTextOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined
} from "@ant-design/icons";
import React, { useState } from "react";
import TeacherDashboard from "../Dashboard/TeacherDashboard";
import NotificationDashboard from "../Notification/NotificationBox";
import TeacherSchedulePage from "./TeacherSchedulePage";
import ReportCreate from "../Report/ReportCreate";
import { getUserInfo, logoutUser } from "../../../services/handleStorageApi";
import { useNavigate } from "react-router-dom";

const { Sider, Content } = Layout;
const { Text } = Typography;

const navItems = [
  {
    key: "dashboard",
    icon: <DashboardOutlined />,
    label: "Dashboard",
  },
  {
    key: "schedule",
    icon: <CalendarOutlined />,
    label: "Thời khóa biểu",
  },
  {
    key: "report",
    icon: <FileTextOutlined />,
    label: "Tạo báo cáo",
  },
];

export default function TeacherMainLayout() {
  const [selected, setSelected] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const user = getUserInfo();
  const navigate = useNavigate();

  let content;
  switch (selected) {
    case "dashboard":
      content = <TeacherDashboard setSelected={setSelected} />;
      break;
    case "notify":
      content = <NotificationDashboard />;
      break;
    case "schedule":
      content = <TeacherSchedulePage />;
      break;
    case "report":
      content = <ReportCreate />;
      break;
    default:
      content = <TeacherDashboard setSelected={setSelected} />;
      break;
  }

  // Sidebar width (match antd default)
  const siderWidth = collapsed ? 80 : 220;

  return (
    <>
      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          trigger={null}
          width={220}
          style={{
            background: "#fff",
            boxShadow: "2px 0 8px #f0f1f2",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
            height: "100vh",
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            {/* Sidebar Header: Logo + Collapse Icon */}
            <div
              style={{
                height: 64,
                display: "flex",
                alignItems: "center",
                justifyContent: collapsed ? "center" : "flex-start",
                padding: collapsed ? "0" : "0 16px",
                borderBottom: "1px solid #f0f1f2",
                position: "relative"
              }}
            >
              {collapsed ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 22, color: "#14448b", letterSpacing: 1 }}>
                    E
                  </span>
                  <span onClick={() => setCollapsed(!collapsed)} style={{ cursor: "pointer", fontSize: 20 }}>
                    <MenuUnfoldOutlined />
                  </span>
                </div>
              ) : (
                <>
                  <span style={{ fontWeight: 700, fontSize: 22, color: "#14448b", letterSpacing: 1 }}>
                    EduConnect
                  </span>
                  <span onClick={() => setCollapsed(!collapsed)} style={{ cursor: "pointer", fontSize: 20, marginLeft: "auto" }}>
                    <MenuFoldOutlined />
                  </span>
                </>
              )}
            </div>
            <Menu
              mode="inline"
              selectedKeys={[selected]}
              style={{ borderRight: 0, fontWeight: 600, fontSize: 16, marginTop: 8 }}
              items={navItems.map((item) => ({
                key: item.key,
                icon: item.icon,
                label: item.label,
                onClick: () => setSelected(item.key),
              }))}
            />
          </div>
          {/* Sidebar Footer: User Info above, Logout at the very bottom */}
          <div
            style={{
              width: '100%',
              padding: collapsed ? 8 : 16,
              borderTop: '1px solid #f0f1f2',
              background: '#fff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: collapsed ? 12 : 8,
              marginBottom: 0,
              minHeight: collapsed ? 100 : 80,
              justifyContent: 'center',
            }}
          >
            <Avatar size={collapsed ? 32 : 36} style={{ backgroundColor: "#2563eb" }}>
              {user?.fullName ? user.fullName[0] : "U"}
            </Avatar>
            {!collapsed && (
              <div style={{ lineHeight: 1.1, flex: 1, minWidth: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <Text strong style={{ fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.fullName || "Teacher"}</Text>
                <Text type="secondary" style={{ fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email || ""}</Text>
              </div>
            )}
            <Button
              type="text"
              icon={<LogoutOutlined style={{ color: "#e11d48" }} />}
              style={{ color: "#e11d48", fontWeight: 600, width: collapsed ? undefined : '100%' }}
              onClick={() => { logoutUser(); navigate("/signin"); }}
            >
              {!collapsed && "Đăng xuất"}
            </Button>
          </div>
        </Sider>
        <Layout
          style={{
            marginLeft: siderWidth,
            minHeight: "100vh",
            transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          <Content style={{ margin: 0, background: "#f7faff", minHeight: "100vh", padding: 0 }}>
            {content}
          </Content>
        </Layout>
      </Layout>
      {/* Simple page footer */}
      <div style={{ width: '100%', textAlign: 'center', padding: 16, background: '#f8fafc', color: '#888', fontSize: 14 }}>
        © {new Date().getFullYear()} EduConnect. All rights reserved.
      </div>
    </>
  );
}
