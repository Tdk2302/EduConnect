// src/component/ProfileUser.jsx
import React, { useState, useEffect } from "react";
import "./ProfileUser.scss";
import Header from "./Header";
import SideBar from "../pages/Teachers/Layout/SideBar";
import {
  updateParentProfile,
  getParentProfile,
  getTeacherDetail,
  putUpdateTeacher,
} from "../services/apiServices";
import { toast } from "react-toastify";

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
    phone: user.phoneNumber,
    gender: user.gender,
    dateOfBirth: user.dateOfBirth,
    nationalId: user.nationalId,
    country: user.country,
    city: user.city,
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  });
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = React.useRef(null);

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
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

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
        console.log(newProfile.data);

        setProfile((prev) => ({
          ...prev,
          ...newProfile.data,
        }));
        toast.success("Cập nhật thành công!");

        const currentUser = JSON.parse(
          localStorage.getItem("userInfo") || "{}"
        );
        currentUser.phoneNumber = profile.phone;
        localStorage.setItem("userInfo", JSON.stringify(currentUser));
      } catch (error) {
        toast.error("Có lỗi xảy ra khi cập nhật!");
        console.error(error);
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
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
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
          fullName: profile.fullName,
          ...updateResponse.data,
        }));
        toast.success("Cập nhật thành công!");

        const currentUser = JSON.parse(
          localStorage.getItem("userInfo") || "{}"
        );
        currentUser.phoneNumber = profile.phone;
        localStorage.setItem("userInfo", JSON.stringify(currentUser));
      } catch (error) {
        toast.error("Có lỗi xảy ra khi cập nhật!");
        console.error("Update error:", error);
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

  const backendUrl = "http://localhost:7064";

  return (
    <>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {user.role === "Teacher" && (
          <SideBar selected="profile" onSelect={() => {}} />
        )}
        <div style={{ flex: 1, display: "flex" }}>
          {user.role !== "Teacher" && <Header />}
          <div className="profile-container" style={{ flex: 1 }}>
            {user.role !== "Teacher" && (
              <div className="profile-sidebar">
                <h3>Cài đặt</h3>
                <ul>
                  <li className="active">Hồ sơ cá nhân</li>
                  <li>Bảo mật</li>
                </ul>
              </div>
            )}
            <div className="profile-main">
              <div className="profile-header">
                <img
                  src={
                    profile.avatar ||
                    (profile.userImage
                      ? profile.userImage.startsWith("http")
                        ? profile.userImage
                        : `${backendUrl}${profile.userImage}`
                      : "https://randomuser.me/api/portraits/men/1.jpg")
                  }
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
                {user.role === "Teacher" ? (
                  <>
                    <div>
                      <label>Ngày tạo</label>
                      <input
                        name="createdAt"
                        value={profile.createdAt || ""}
                        readOnly
                      />
                    </div>
                    <div>
                      <label>Mã môn dạy (subjectId)</label>
                      <input
                        name="subjectId"
                        value={profile.subjectId || ""}
                        readOnly={!isEditing}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                ) : (
                  <>
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
