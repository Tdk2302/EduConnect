// src/component/ProfileUser.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Avatar,
  Row,
  Col,
  Typography,
  message,
} from "antd";
import { UserOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";
import Header from "./Header";
import SideBar from "../pages/Teachers/Layout/SideBar";
import {
  updateParentProfile,
  getParentProfile,
  getTeacherDetail,
  putUpdateTeacher,
} from "../services/apiServices";
import { toast } from "react-toastify";
import axios from "axios";
import "./ProfileUser.scss";
const { Title, Text } = Typography;

const getUserFromStorage = () => {
  try {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    return user || {};
  } catch {
    return {};
  }
};

// Hàm upload ảnh lên server, trả về url ảnh
const uploadImageToServer = async (file, token) => {
  const formData = new FormData();
  formData.append("File", file);
  const response = await axios.post(
    "https://localhost:7064/api/Upload",
    formData,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
  return response.data.imageUrl;
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
    userImage: "https://randomuser.me/api/portraits/men/1.jpg",
  });
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  //Validate Image
  const validateImage = (file) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxFileSize = 2 * 1024 * 1024; // 2MB

    if (!allowedTypes.includes(file.type)) {
      return false;
    }

    if (file.size > maxFileSize) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    async function fetchProfile() {
      if (user.role === "Teacher") {
        const data = await getTeacherDetail(user.userId, user.token);
        setProfile(data.data);
      } else {
        const data = await getParentProfile(user.token);
        let cleanData = { ...data.data };
        if (!cleanData.userImage || !/^https?:\/\//.test(cleanData.userImage)) {
          cleanData.userImage = "";
        }
        setProfile(cleanData);
        console.log(cleanData);
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
        await putUpdateTeacher(
          user.userId,
          profile.subjectId,
          profile.status,
          user.token
        );
        const newProfile = await getTeacherDetail(user.userId, user.token);
        setProfile((prev) => ({ ...prev, ...newProfile.data }));
        message.success("Cập nhật thành công!");
        const currentUser = JSON.parse(
          localStorage.getItem("userInfo") || "{}"
        );
        currentUser.phoneNumber = profile.phone;
        localStorage.setItem("userInfo", JSON.stringify(currentUser));
      } catch (error) {
        message.error("Có lỗi xảy ra khi cập nhật!");
      }
    } else {
      const formData = new FormData();
      formData.append("FirstName", profile.firstName || "");
      formData.append("PhoneNumber", profile.phone || "");
      formData.append("LastName", profile.lastName || "");
      formData.append("ImageUrl", profile.userImage || "");

      try {
        const updateResponse = await updateParentProfile(formData, user.token);

        setProfile((prev) => ({
          ...prev,
          userImage: prev.userImage,
          phone: profile.phone,
          role: profile.role,
          fullName: profile.fullName,
          ...updateResponse.data,
        }));
        message.success("Cập nhật thành công!");
        const currentUser = JSON.parse(
          localStorage.getItem("userInfo") || "{}"
        );
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

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate định dạng và size
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      const maxFileSize = 2 * 1024 * 1024; // 2MB
      if (!allowedTypes.includes(file.type)) {
        toast.error("Chỉ chấp nhận file ảnh JPEG, PNG, GIF.");
        return;
      }
      if (file.size > maxFileSize) {
        toast.error("Kích thước file tối đa là 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = async (ev) => {
        setProfile((prev) => ({
          ...prev,
          avatar: ev.target.result,
        }));
        try {
          const imageUrl = await uploadImageToServer(file, user.token);
          setProfile((prev) => ({
            ...prev,
            userImage: imageUrl, // lưu url ảnh đã upload
          }));
        } catch (err) {
          toast.error("Upload ảnh thất bại!");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {user.role !== "Teacher" && <Header />}

      <div style={{ display: "flex", minHeight: "100vh" }}>
        {user.role === "Teacher" && (
          <SideBar selected="profile" onSelect={() => {}} />
        )}
        <div style={{ flex: 1, display: "flex" }}>
          <div className="profile-container" style={{ flex: 1 }}>
            {user.role !== "Teacher" && (
              <div className="profile-sidebar">
                <h3>Cài đặt</h3>
                <ul>
                  <li className="active">Hồ sơ cá nhân</li>
                </ul>
              </div>
            )}
            <div className="profile-main">
              <div className="profile-header">
                <img
                  src={profile.avatar || profile.userImage}
                  alt="avatar"
                  className="profile-avatar"
                />
                {isEditing && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      ref={fileInputRef}
                      onChange={handleAvatarChange}
                    />
                    <button
                      className="edit-btn small-btn"
                      style={{
                        marginTop: 8,
                        padding: "4px 10px",
                        fontSize: "0.9em",
                      }}
                      onClick={() =>
                        fileInputRef.current && fileInputRef.current.click()
                      }
                    >
                      Cập Nhật Ảnh
                    </button>
                  </div>
                )}
                <div>
                  <h2>{profile.fullName}</h2>
                </div>
                <button
                  className="edit-btn"
                  onClick={isEditing ? () => setIsEditing(false) : handleEdit}
                >
                  {isEditing ? "Hủy" : "Chỉnh sửa"}
                </button>
                {isEditing && (
                  <button
                    className="save-btn edit-btn"
                    onClick={handleSave}
                    style={{ marginLeft: 8 }}
                  >
                    Lưu
                  </button>
                )}
              </div>
              <h3>Chi tiết cá nhân</h3>
              <div className="profile-details">
                <div>
                  <label>Họ và tên</label>
                  <input
                    name="fullName"
                    value={profile.fullName}
                    readOnly={!isEditing}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Email</label>
                  <input name="email" value={profile.email} readOnly="true" />
                </div>
                <div>
                  <label>Vai trò</label>
                  <input name="role" value={profile.role} readOnly="true" />
                </div>
                <div>
                  <label>Số điện thoại</label>
                  <input
                    name="phone"
                    value={profile.phone}
                    readOnly={!isEditing}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Giới tính</label>
                  <input name="gender" value={profile.gender} readOnly="true" />
                </div>
                <div>
                  <label>Ngày sinh</label>
                  <input
                    name="dateOfBirth"
                    value={profile.dateOfBirth}
                    readOnly="true"
                  />
                </div>
                <div>
                  <label>CMND</label>
                  <input
                    name="nationalId"
                    value={profile.nationalId}
                    readOnly="true"
                  />
                </div>
              </div>
              <h3>Địa chỉ</h3>
              <div className="profile-details">
                {user.role === "Teacher" ? (
                  <>
                    <Button
                      icon={<SaveOutlined />}
                      type="primary"
                      onClick={handleSave}
                      style={{ marginRight: 8 }}
                    >
                      Lưu
                    </Button>
                    <Button onClick={handleCancel}>Hủy</Button>
                  </>
                ) : (
                  <>
                    <div>
                      <label>Quốc gia</label>
                      <input
                        name="country"
                        value={profile.country}
                        readOnly="true"
                      />
                    </div>
                    <div>
                      <label>Thành phố</label>
                      <input name="city" value={profile.city} readOnly="true" />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
