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
            <li className="active">My Profile</li>
            <li>Security Options</li>
            <li>Preferences</li>
          </ul>
        </div>
        <div className="profile-main">
          <div className="profile-header">
            <img src={profile.avatar} alt="avatar" className="profile-avatar" />
            <div>
              <h2>{profile.fullName}</h2>
            </div>
            <button className="edit-btn">Edit</button>
          </div>
          <h3>Personal Details</h3>
          <div className="profile-details">
            <div>
              <label>First Name</label>
              <input value={profile.firstName} readOnly />
            </div>
            <div>
              <label>Last Name</label>
              <input value={profile.lastName} readOnly />
            </div>
            <div>
              <label>Email address</label>
              <input value={profile.email} readOnly />
            </div>
            <div>
              <label>Phone</label>
              <input value={profile.phone} readOnly />
            </div>
            <div>
              <label>Bio</label>
              <input value={profile.bio} readOnly />
            </div>
            <div>
              <label>Gender</label>
              <input value={profile.gender} readOnly />
            </div>
            <div>
              <label>Date of Birth</label>
              <input value={profile.dateOfBirth} readOnly />
            </div>
            <div>
              <label>National ID</label>
              <input value={profile.nationalId} readOnly />
            </div>
          </div>
          <h3>Địa chỉ</h3>
          <div className="profile-details">
            <div>
              <label>Country</label>
              <input value={profile.country} readOnly />
            </div>
            <div>
              <label>City/State</label>
              <input value={profile.city} readOnly />
            </div>
            <div>
              <label>Postal Code</label>
              <input value={profile.postalCode} readOnly />
            </div>
            <div>
              <label>TAX ID</label>
              <input value={profile.taxId} readOnly />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
