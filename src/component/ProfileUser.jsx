// src/component/ProfileUser.jsx
import React, { useState, useEffect } from "react";
import "./ProfileUser.scss";
import Header from "./Header";
import axios from "axios";

const getUserFromStorage = () => {
  try {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    return user || {};
  } catch {
    return {};
  }
};

const BASE_URL = "https://localhost:7064/api";

export default function ProfileUser() {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    role: "",
    phone: "+84909090909",
    gender: "Male",
    dateOfBirth: "23/02/2000",
    nationalId: "1234567890",
    country: "Vietnam",
    city: "Hanoi",
    postalCode: "10000",
    taxId: "",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  });
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    const user = getUserFromStorage();
    setProfile((prev) => ({
      ...prev,
      fullName: user.fullName || "",
      email: user.email || "",
      role: user.role || "",
    }));
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsEditing(false);

    const data = {
      phoneNumber: profile.phone,
      firstName: profile.fullName.split(" ")[0] || "",
      lastName: profile.fullName.split(" ").slice(1).join(" ") || "",
      studentId: profile.studentId || "studentId",
    };

    try {
      await axios.put(
        `${BASE_URL}/Parent/profile?email=${encodeURIComponent(profile.email)}`,
        data
      );
      toast.success("Cập nhật thành công!");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật!");
      console.error(error);
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
      <div className="profile-container">
        <div className="profile-sidebar">
          <h3>Cài đặt</h3>
          <ul>
            <li className="active">Hồ sơ cá nhân</li>
            <li>Bảo mật</li>
          </ul>
        </div>
        <div className="profile-main">
          <div className="profile-header">
            <img src={profile.avatar} alt="avatar" className="profile-avatar" />
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
              <input
                name="email"
                value={profile.email}
                readOnly={!isEditing}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Vai trò</label>
              <input
                name="role"
                value={profile.role}
                readOnly={!isEditing}
                onChange={handleChange}
              />
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
              <input
                name="gender"
                value={profile.gender}
                readOnly={!isEditing}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Ngày sinh</label>
              <input
                name="dateOfBirth"
                value={profile.dateOfBirth}
                readOnly={!isEditing}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>CMND</label>
              <input
                name="nationalId"
                value={profile.nationalId}
                readOnly={!isEditing}
                onChange={handleChange}
              />
            </div>
          </div>
          <h3>Địa chỉ</h3>
          <div className="profile-details">
            <div>
              <label>Quốc gia</label>
              <input
                name="country"
                value={profile.country}
                readOnly={!isEditing}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Thành phố</label>
              <input
                name="city"
                value={profile.city}
                readOnly={!isEditing}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
