import React, { useState, useEffect } from "react";
import TableUser from "./TableUser";
import "./ManageUser.scss";

const ManageUser = () => {
  const [listUsers, setListUser] = useState([]);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    const sampleUsers = [
      {
        id: 1,
        fullName: "Nguyễn Thị Mai",
        roles: ["Teacher"],
        email: "mai.Teacher@gmail.com",
        username: "nguyenthimai",
        password: "123",
        dateCreated: "04/10/2023",
        status: "Active",
        avatar:
          "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-dep-8.jpg",
        theme: "dark",
      },
      {
        id: 2,
        fullName: "Trần Văn An",
        roles: ["Student"],
        email: "an.student@gmail.com",
        username: "tranvanan",
        password: "456",
        dateCreated: "06/03/2022",
        status: "Active",
        avatar:
          "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-dep-8.jpg",
        theme: "light",
      },
      {
        id: 3,
        fullName: "Lê Thị Hồng",
        roles: ["Teacher"],
        email: "hong.Teacher@gmail.com",
        username: "lethihong",
        password: "789",
        dateCreated: "01/12/2021",
        status: "Suspended",
        avatar:
          "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-dep-8.jpg",
        theme: "dark",
      },
      {
        id: 4,
        fullName: "Phạm Minh Tuấn",
        roles: ["Student"],
        email: "tuan.student@gmail.com",
        username: "phamminhtuan",
        password: "abc",
        dateCreated: "08/09/2020",
        status: "Inactive",
        avatar:
          "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-dep-8.jpg",
        theme: "light",
      },
      {
        id: 5,
        fullName: "Hoàng Lan",
        roles: ["Teacher"],
        email: "lan.multirole@gmail.com",
        username: "hoanglan",
        password: "def",
        dateCreated: "12/08/2019",
        status: "Active",
        avatar:
          "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-dep-8.jpg",
        theme: "dark",
      },
      {
        id: 6,
        fullName: "Vũ Minh Châu",
        roles: ["Student"],
        email: "chau.student@gmail.com",
        username: "vuminhchau",
        password: "ghi",
        dateCreated: "02/05/2021",
        status: "Active",
        avatar:
          "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-dep-8.jpg",
        theme: "light",
      },
      {
        id: 7,
        fullName: "Đặng Quốc Bảo",
        roles: ["Teacher"],
        email: "bao.Teacher@gmail.com",
        username: "dangquocbao",
        password: "jkl",
        dateCreated: "11/11/2022",
        status: "Active",
        avatar:
          "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-dep-8.jpg",
        theme: "dark",
      },
      {
        id: 8,
        fullName: "Ngô Thị Thu",
        roles: ["Student"],
        email: "thu.student@gmail.com",
        username: "ngothithu",
        password: "mno",
        dateCreated: "07/07/2020",
        status: "Inactive",
        avatar:
          "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-dep-8.jpg",
        theme: "light",
      },
      {
        id: 9,
        fullName: "Phan Văn Hùng",
        roles: ["Teacher"],
        email: "hung.Teacher@gmail.com",
        username: "phanvanhung",
        password: "pqr",
        dateCreated: "03/03/2023",
        status: "Suspended",
        avatar:
          "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-dep-8.jpg",
        theme: "dark",
      },
      {
        id: 10,
        fullName: "Lý Thị Kim",
        roles: ["Student"],
        email: "kim.student@gmail.com",
        username: "lythikim",
        password: "stu",
        dateCreated: "09/09/2021",
        status: "Active",
        avatar:
          "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-dep-8.jpg",
        theme: "light",
      },
    ];

    setListUser(sampleUsers);
  };

  // Loại bỏ logic mở modal, chỉ giữ các hàm quản lý khác
  const handleClickBtnView = () => {
    // Vô hiệu hóa vì không có modal
    console.log("View button clicked, but modal is disabled.");
  };

  const handleClickBtnUpdate = () => {
    // Logic cập nhật (có thể mở rộng sau)
    console.log("Update button clicked.");
  };

  const handleClickBtnDelete = () => {
    // Logic xóa (có thể mở rộng sau)
    console.log("Delete button clicked.");
  };

  return (
    <div className="manage-user-container">
      <div className="table-user-container">
        <TableUser
          listUsers={listUsers}
          handleClickBtnView={handleClickBtnView}
          handleClickBtnUpdate={handleClickBtnUpdate}
          handleClickBtnDelete={handleClickBtnDelete}
          handleManageStudent={() => {}}
          handleManageTeacher={() => {}}
          handleManageAccount={() => {}}
        />
      </div>
    </div>
  );
};

export default ManageUser;
