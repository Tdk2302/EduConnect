// src/component/ProfileUser.jsx
import React, { useState, useEffect, useRef } from "react";
import { Card, Form, Input, Button, Avatar, Row, Col, Typography, message } from "antd";
import { UserOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";
import Header from "./Header";
import { updateParentProfile, getParentProfile, getTeacherDetail, putUpdateTeacher } from "../services/apiServices";

const { Title, Text } = Typography;

const getUserFromStorage = () => {
  try {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    return user || {};
  } catch {
    return {};
  }
};

export default function ProfileUser() {
  const user = getUserFromStorage();
  const [profile, setProfile] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    phone: user.phoneNumber || "0903053808",
    gender: user.gender || "Male",
    dateOfBirth: user.dateOfBirth || "1990-01-01",
    nationalId: user.nationalId || "1234567890",
    country: user.country || "Vietnam",
    city: user.city || "Hà Nội",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  });
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function fetchProfile() {
      if (user.role === "Teacher") {
        const data = await getTeacherDetail(user.userId, user.token);
        setProfile(data.data);
      } else {
        const data = await getParentProfile(user.token);
        setProfile(data.data);
      }
    }
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);

  const handleSave = async () => {
    setIsEditing(false);
    if (user.role === "Teacher") {
      try {
        await putUpdateTeacher(user.userId, profile.subjectId, profile.status, user.token);
        const newProfile = await getTeacherDetail(user.userId, user.token);
        setProfile((prev) => ({ ...prev, ...newProfile.data }));
        message.success("Cập nhật thành công!");
        const currentUser = JSON.parse(localStorage.getItem("userInfo") || "{}");
        currentUser.phoneNumber = profile.phone;
        localStorage.setItem("userInfo", JSON.stringify(currentUser));
      } catch (error) {
        message.error("Có lỗi xảy ra khi cập nhật!");
      }
    } else {
      const formData = new FormData();
      formData.append("FirstName", profile.firstName || "");
      formData.append("PhoneNumber", profile.phone || "");
      if (fileInputRef.current && fileInputRef.current.files[0]) {
        formData.append("imageFile", fileInputRef.current.files[0]);
      }
      formData.append("LastName", profile.lastName || "");
      formData.append("fullName", profile.fullName || "");
      try {
        const updateResponse = await updateParentProfile(formData, user.token);
        const backendUrl = "http://localhost:7064";
        const imageUrl = updateResponse.data.imageUrl
          ? updateResponse.data.imageUrl.startsWith("http")
            ? updateResponse.data.imageUrl
            : `${backendUrl}${updateResponse.data.imageUrl}`
          : null;
        setProfile((prev) => ({
          ...prev,
          userImage: imageUrl || prev.userImage,
          phone: profile.phone,
          role: profile.role,
          fullName: profile.fullName,
          ...updateResponse.data,
        }));
        message.success("Cập nhật thành công!");
        const currentUser = JSON.parse(localStorage.getItem("userInfo") || "{}");
        currentUser.phoneNumber = profile.phone;
        localStorage.setItem("userInfo", JSON.stringify(currentUser));
      } catch (error) {
        message.error("Có lỗi xảy ra khi cập nhật!");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProfile((prev) => ({ ...prev, avatar: ev.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Header />
      <div style={{ background: "#f7faff", minHeight: "100vh", padding: "32px 0" }}>
        <Row justify="center">
          <Col xs={24} md={16} lg={12}>
            <Card
              style={{ borderRadius: 16, boxShadow: "0 4px 24px #e0e3e8", marginTop: 32 }}
              title={<Title level={3} style={{ margin: 0, color: "#14448b" }}>Hồ sơ cá nhân</Title>}
              extra={
                isEditing ? (
                  <>
                    <Button icon={<SaveOutlined />} type="primary" onClick={handleSave} style={{ marginRight: 8 }}>Lưu</Button>
                    <Button onClick={handleCancel}>Hủy</Button>
                  </>
                ) : (
                  <Button icon={<EditOutlined />} onClick={handleEdit}>Chỉnh sửa</Button>
                )
              }
            >
              <Row gutter={[32, 32]} align="middle">
                <Col xs={24} md={6} style={{ textAlign: "center" }}>
                  <Avatar
                    size={96}
                    src={profile.avatar || profile.userImage || "https://randomuser.me/api/portraits/men/1.jpg"}
                    icon={<UserOutlined />}
                    style={{ marginBottom: 16, border: "2px solid #14448b" }}
                  />
                  {isEditing && (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        ref={fileInputRef}
                        onChange={handleAvatarChange}
                      />
                      <Button size="small" onClick={() => fileInputRef.current && fileInputRef.current.click()} style={{ marginTop: 8 }}>
                        Cập nhật ảnh
                      </Button>
                    </>
                  )}
                </Col>
                <Col xs={24} md={18}>
                  <Form layout="vertical">
                    <Row gutter={16}>
                      <Col xs={24} md={12}>
                        <Form.Item label="Họ và tên">
                          <Input name="fullName" value={profile.fullName} readOnly={!isEditing} onChange={handleChange} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item label="Email">
                          <Input name="email" value={profile.email} readOnly={!isEditing} onChange={handleChange} />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col xs={24} md={12}>
                        <Form.Item label="Vai trò">
                          <Input name="role" value={profile.role} readOnly onChange={handleChange} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item label="Số điện thoại">
                          <Input name="phone" value={profile.phone} readOnly={!isEditing} onChange={handleChange} />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col xs={24} md={12}>
                        <Form.Item label="Giới tính">
                          <Input name="gender" value={profile.gender} readOnly={!isEditing} onChange={handleChange} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item label="Ngày sinh">
                          <Input name="dateOfBirth" value={profile.dateOfBirth} readOnly={!isEditing} onChange={handleChange} />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col xs={24} md={12}>
                        <Form.Item label="CMND">
                          <Input name="nationalId" value={profile.nationalId} readOnly={!isEditing} onChange={handleChange} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        {user.role === "Teacher" ? (
                          <Form.Item label="Mã môn dạy (subjectId)">
                            <Input name="subjectId" value={profile.subjectId || ""} readOnly={!isEditing} onChange={handleChange} />
                          </Form.Item>
                        ) : (
                          <Form.Item label="Quốc gia">
                            <Input name="country" value={profile.country} readOnly={!isEditing} onChange={handleChange} />
                          </Form.Item>
                        )}
                      </Col>
                    </Row>
                    {user.role !== "Teacher" && (
                      <Row gutter={16}>
                        <Col xs={24} md={12}>
                          <Form.Item label="Thành phố">
                            <Input name="city" value={profile.city} readOnly={!isEditing} onChange={handleChange} />
                          </Form.Item>
                        </Col>
                      </Row>
                    )}
                  </Form>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}
