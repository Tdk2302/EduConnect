import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Button, Modal, TextField, Stack, Switch, FormControlLabel } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TableUser from "./TableUser";
import { getAllAdminUsers } from "../../services/apiServices";

const emptyUser = {
  fullName: "",
  role: "",
  email: "",
  phoneNumber: "",
  isActive: true,
  createAt: ""
};

export default function ManageUser() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [formData, setFormData] = useState(emptyUser);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    getAllAdminUsers()
      .then((res) => {
        setUsers(res.data.map(u => ({ ...u, createAt: u.createAt || new Date().toISOString() })));
      })
      .catch(() => {
        setUsers([]);
      });
  }, []);

  const handleOpenAdd = () => {
    setFormData(emptyUser);
    setModalMode("add");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setFormData(user);
    setEditIndex(users.findIndex(u => u.email === user.email));
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(emptyUser);
    setEditIndex(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === "add") {
      setUsers(prev => [
        ...prev,
        { ...formData, createAt: new Date().toISOString() }
      ]);
    } else if (modalMode === "edit" && editIndex !== null) {
      setUsers(prev => prev.map((u, idx) => idx === editIndex ? { ...formData } : u));
    }
    handleCloseModal();
  };

  const handleDeleteUser = (user) => {
    setUsers(prev => prev.filter(u => u.email !== user.email));
  };

  const handleViewUser = (user) => {
    alert(`Thông tin người dùng:\nHọ tên: ${user.fullName}\nEmail: ${user.email}\nVai trò: ${user.role}\nSố điện thoại: ${user.phoneNumber}\nTrạng thái: ${user.isActive ? "Active" : "Inactive"}\nNgày tạo: ${user.createAt}`);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#EAF1FF", py: 4 }}>
      <Paper sx={{ borderRadius: 2, background: "#fff", border: "1px solid #E5E7EB", boxShadow: "none", p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h5" fontWeight={700} color="#222">
            Quản lý người dùng
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAdd}
            sx={{ bgcolor: "#6D28D9", color: "#fff", fontWeight: 600, borderRadius: 2, boxShadow: "none", "&:hover": { bgcolor: "#5126a7" } }}
          >
            Thêm người dùng
          </Button>
        </Box>
        <TableUser
          listUsers={users}
          onView={handleViewUser}
          onEdit={handleOpenEdit}
          onDelete={handleDeleteUser}
        />
        <Modal open={isModalOpen} onClose={handleCloseModal}>
          <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, bgcolor: "#fff", borderRadius: 2, boxShadow: 24, p: 4 }}>
            <Typography variant="h6" mb={2} fontWeight={700} color="#6D28D9">
              {modalMode === "add" ? "Thêm người dùng mới" : "Chỉnh sửa người dùng"}
            </Typography>
            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField name="fullName" label="Họ và tên" value={formData.fullName} onChange={handleInputChange} required fullWidth />
                <TextField name="role" label="Vai trò" value={formData.role} onChange={handleInputChange} required fullWidth />
                <TextField name="email" label="Email" value={formData.email} onChange={handleInputChange} required fullWidth />
                <TextField name="phoneNumber" label="Số điện thoại" value={formData.phoneNumber} onChange={handleInputChange} required fullWidth />
                <FormControlLabel
                  control={<Switch checked={formData.isActive} onChange={handleInputChange} name="isActive" />}
                  label="Active"
                />
                <Button type="submit" variant="contained" sx={{ bgcolor: "#6D28D9", color: "#fff" }}>
                  {modalMode === "add" ? "Thêm" : "Lưu"}
                </Button>
              </Stack>
            </form>
          </Box>
        </Modal>
      </Paper>
    </Box>
  );
}
