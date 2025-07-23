import React, { useState, useEffect } from "react";
import { List, Card, Tabs, Badge, Button, Input, Modal, Typography, Tag, Space, Spin } from "antd";
import { BellOutlined, CheckCircleOutlined, DeleteOutlined, ExclamationCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import Header from "../../../component/Header";
import { getReport, getStudentByParentEmail } from "../../../services/apiServices";
import { getUserInfo } from "../../../services/handleStorageApi";

const { TabPane } = Tabs;
const { Title, Text } = Typography;

const notificationTypes = {
  report: { label: "Báo cáo", color: "blue" },
  announcement: { label: "Thông báo", color: "purple" },
  attendance: { label: "Chuyên cần", color: "orange" },
  achievement: { label: "Thành tích", color: "green" },
  payment: { label: "Học phí", color: "red" },
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [modal, setModal] = useState({ visible: false, notification: null });
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const userInfo = getUserInfo();
        const res = await getStudentByParentEmail(userInfo.token, userInfo.email);
        setStudents(res.data || []);
        if (res.data && res.data.length > 0) {
          setSelectedStudent(res.data[0].studentId || res.data[0].id);
        }
      } catch (err) {
        setStudents([]);
      }
    };
    fetchStudents();
  }, []);

  // Dummy notifications for demo
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setNotifications([
        { id: 1, title: "Báo cáo học tập tháng 5", type: "report", isRead: false, content: "Báo cáo chi tiết học tập tháng 5.", date: "2024-05-30" },
        { id: 2, title: "Thông báo nghỉ học", type: "announcement", isRead: true, content: "Trường sẽ nghỉ học vào ngày 2/6.", date: "2024-05-29" },
        { id: 3, title: "Điểm danh ngày 28/5", type: "attendance", isRead: false, content: "Học sinh đã điểm danh đầy đủ.", date: "2024-05-28" },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((n) =>
    selectedTab === "all" ? true : n.type === selectedTab
  ).filter((n) =>
    n.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMarkRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };
  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };
  const handleShowDetail = (notification) => {
    setModal({ visible: true, notification });
  };
  const handleCloseModal = () => setModal({ visible: false, notification: null });

  return (
    <>
      <Header />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 0" }}>
        <Card style={{ borderRadius: 12, marginBottom: 24 }}>
          <Space align="center" style={{ width: "100%", justifyContent: "space-between" }}>
            <Space align="center">
              <Badge count={unreadCount}>
                <BellOutlined style={{ fontSize: 32, color: "#14448b" }} />
              </Badge>
              <Title level={3} style={{ margin: 0, color: "#14448b" }}>Thông báo</Title>
            </Space>
            <Button icon={<ReloadOutlined />}>Làm mới</Button>
          </Space>
        </Card>
        <Card style={{ borderRadius: 12 }}>
          <Tabs activeKey={selectedTab} onChange={setSelectedTab} type="line">
            <TabPane tab={<span>Tất cả</span>} key="all" />
            {Object.entries(notificationTypes).map(([key, val]) => (
              <TabPane tab={<span>{val.label}</span>} key={key} />
            ))}
          </Tabs>
          <Input.Search
            placeholder="Tìm kiếm thông báo..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ margin: "16px 0", maxWidth: 320 }}
          />
          {loading ? (
            <Spin style={{ display: "block", margin: "32px auto" }} />
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={filteredNotifications}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Button type="link" onClick={() => handleMarkRead(item.id)} disabled={item.isRead}>Đánh dấu đã đọc</Button>,
                    <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(item.id)} />,
                  ]}
                  style={{ background: item.isRead ? "#f7faff" : "#e6f7ff", borderRadius: 8, marginBottom: 8 }}
                  onClick={() => handleShowDetail(item)}
                >
                  <List.Item.Meta
                    title={<span style={{ fontWeight: 700 }}>{item.title}</span>}
                    description={
                      <Space>
                        <Tag color={notificationTypes[item.type]?.color || "default"}>{notificationTypes[item.type]?.label || item.type}</Tag>
                        <Text type="secondary">{item.date}</Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Card>
        <Modal
          visible={modal.visible}
          title={modal.notification?.title}
          onCancel={handleCloseModal}
          footer={null}
        >
          <Text>{modal.notification?.content}</Text>
        </Modal>
      </div>
    </>
  );
}
