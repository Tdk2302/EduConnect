// src/component/ProfileUser.jsx
import React, { useState } from "react";
import "./ProfileUser.scss";
import Header from "./Header";

const initialProfile = {
  firstName: "Leslie",
  lastName: "Alexander",
  email: "leslie@gmail.com",
  phone: "+317-439-5139",
  bio: "Customer Service Manager",
  gender: "Female",
  dateOfBirth: "1994-06-10",
  nationalId: "629 555-0129 333-0127",
  country: "United States",
  city: "Los Angeles",
  postalCode: "90001",
  taxId: "BH28F55219",
  avatar: "https://randomuser.me/api/portraits/women/1.jpg", // hoặc dùng ảnh local
};

export default function ProfileUser() {
  const [profile, setProfile] = useState(initialProfile);

  return (
    <>
      <Header />
      <div className="profile-container">
        <div className="profile-sidebar">
          <h3>Cài đặt</h3>
          <ul>
            <li className="active">Hồ sơ cá nhân</li>
            <li>Bảo mật</li>
            <li>Cài đặt</li>
          </ul>
        </div>
        <div className="profile-main">
          <div className="profile-header">
            <img src={profile.avatar} alt="avatar" className="profile-avatar" />
            <div>
              <h2>
                {profile.firstName} {profile.lastName}
              </h2>
              <p>{profile.bio}</p>
            </div>
            <button className="edit-btn">Sửa</button>
          </div>
          <h3>Chi tiết hồ sơ</h3>
          <div className="profile-details">
            <div>
              <label>Tên</label>
              <input value={profile.firstName} readOnly />
            </div>
            <div>
              <label>Họ</label>
              <input value={profile.lastName} readOnly />
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
              <label>Về tôi</label>
              <input value={profile.bio} readOnly />
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
              <label>Số CMND</label>
              <input value={profile.nationalId} readOnly />
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
