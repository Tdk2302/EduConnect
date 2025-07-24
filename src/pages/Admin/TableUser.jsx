import React from "react";
import { Table, Avatar, Button, Tag, Space } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined, SyncOutlined } from "@ant-design/icons";

const AVATAR_URL = "https://randomuser.me/api/portraits/men/32.jpg";

function TableUser({ listUsers, onView, onEdit, onDelete, onChangeRole, loadingEdit }) {
  const columns = [
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
      render: (text, user) => (
        <Space>
          <Avatar src={user.avatar || AVATAR_URL} />
          <div>
            <div style={{ fontWeight: 700 }}>{user.fullName}</div>
            <div style={{ color: "#888", fontSize: 13 }}>{user.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "Admin" ? "blue" : role === "Teacher" ? "purple" : "default"}>{role}</Tag>
      ),
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, user) => (
        <Tag color={
          status === "Active" || status === 1 || status === "1" || user.isActive
            ? "green"
            : "default"
        }>
          {status === "Active" || status === 1 || status === "1" || user.isActive ? "Active" : "Inactive"}
        </Tag>
      ),
      align: "center",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createAt",
      key: "createAt",
      render: (date) => (date ? date.split("T")[0] : ""),
      align: "center",
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "center",
      render: (_, user) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => onView && onView(user)} />
          {user.role === "Teacher" && (
            <Button icon={<EditOutlined />} onClick={() => onEdit && onEdit(user)} loading={loadingEdit} />
          )}
          {user.role !== "Teacher" && user.role !== "Parent" && (
            <Button icon={<DeleteOutlined />} danger onClick={() => onDelete && onDelete(user)} />
          )}
          {user.role !== "Parent" && (
            <Button icon={<SyncOutlined />} onClick={() => onChangeRole && onChangeRole(user)} />
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={listUsers}
      rowKey={(user) => user.userId || user.email}
      pagination={{ pageSize: 10 }}
      style={{ borderRadius: 12, background: "#fff", marginTop: 24 }}
      scroll={{ x: true }}
    />
  );
}

export default TableUser;
