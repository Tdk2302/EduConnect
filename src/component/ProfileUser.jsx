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

  return (
    <>
      <Header />
      <div className="profile-container">
        <div className="profile-sidebar">
          <h3>Cài đặt</h3>
          <ul>
            <li className="active">Hồ Sơ Của Tôi</li>
            <li>Bảo mật</li>
            <li>Cài đặt</li>
          </ul>
        </div>
        <div className="profile-main">
          <div className="profile-header">
            <img src={profile.avatar} alt="avatar" className="profile-avatar" />
            <div>
              <h2>{profile.fullName}</h2>
            </div>
            <button className="edit-btn">Chỉnh sửa</button>
          </div>
          <h3>Chi tiết cá nhân</h3>
          <div className="profile-details">
            <div>
              <label>Họ và Tên</label>
              <input value={profile.fullName} readOnly />
            </div>
            <div>
              <label>Email</label>
              <input value={profile.email} readOnly />
            </div>
            <div>
              <label>Số điện thoại</label>
              <input value={profile.phone} readOnly />
            </div>
            <div>
              <label>Giới tính</label>
              <input value={profile.gender} readOnly />
            </div>
            <div>
              <label>Ngày sinh</label>
              <input value={profile.dateOfBirth} readOnly />
            </div>
            <div>
              <label>Quốc tịch</label>
              <input value={profile.country} readOnly />
            </div>
          </div>
          <h3>Địa chỉ</h3>
          <div className="profile-details">
            <div>
              <label>Quốc gia</label>
              <input value={profile.country} readOnly />
            </div>
            <div>
              <label>Thành phố</label>
              <input value={profile.city} readOnly />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
