import React, { useState, useEffect, useMemo } from "react";
import TableUser from "./TableUser";
import { getAllAdminUsers, putChangeUserRole, putUpdateTeacher, deleteTeacher, getTeacherDetail } from "../../services/apiServices";
import { getUserInfo } from "../../services/handleStorageApi";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Avatar, Typography, Box, Chip, MenuItem, Select, FormControl, InputLabel, CircularProgress, Tabs, Tab, Stack, TextField, Grid, Paper
} from "@mui/material";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SearchIcon from '@mui/icons-material/Search';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import "./ManageUser.scss";
import { message } from "antd";

const ROLE_CATEGORIES = [
  { label: "Quản trị viên", value: "Admin" },
  { label: "Giáo viên", value: "Teacher" },
  { label: "Phụ huynh", value: "Parent" },
];

const SUBJECT_OPTIONS = [
  { value: "SUB001", label: "Toán" },
  { value: "SUB002", label: "Tiếng Việt" },
  { value: "SUB003", label: "Ngoại Ngữ" },
];

const ManageUser = () => {
  const [listUsers, setListUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openRoleModal, setOpenRoleModal] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [loadingRole, setLoadingRole] = useState(false);
  const [roleFilter, setRoleFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openEditTeacher, setOpenEditTeacher] = useState(false);
  const [editTeacher, setEditTeacher] = useState({ userId: '', subjectId: '', status: 'Active' });
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState("");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [teacherDetail, setTeacherDetail] = useState(null);
  const [loadingTeacherDetail, setLoadingTeacherDetail] = useState(false);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const userInfo = getUserInfo();
      const token = userInfo?.token;
      const res = await getAllAdminUsers(token);
      setListUser(res.data);
    } catch (error) {
      setListUser([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtered users by role and search
  const filteredUsers = useMemo(() => {
    let users = listUsers;
    if (roleFilter) users = users.filter(u => u.role === roleFilter);
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      users = users.filter(u =>
        (u.fullName && u.fullName.toLowerCase().includes(s)) ||
        (u.email && u.email.toLowerCase().includes(s)) ||
        (u.phoneNumber && u.phoneNumber.toLowerCase().includes(s))
      );
    }
    return users;
  }, [listUsers, roleFilter, search]);

  // Modal handlers
  const handleOpenViewModal = async (user) => {
    if (user.role === 'Teacher') {
      setLoadingTeacherDetail(true);
      setOpenViewModal(true);
      try {
        const userInfo = getUserInfo();
        const token = userInfo?.token;
        const res = await getTeacherDetail(user.userId, token);
        setTeacherDetail(res.data);
      } catch (e) {
        setTeacherDetail(null);
      }
      setLoadingTeacherDetail(false);
    } else {
      setSelectedUser(user);
      setOpenViewModal(true);
    }
  };
  const handleCloseViewModal = () => {
    setOpenViewModal(false);
    setSelectedUser(null);
    setTeacherDetail(null);
  };
  const handleOpenRoleModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setOpenRoleModal(true);
  };
  const handleCloseRoleModal = () => {
    setOpenRoleModal(false);
    setSelectedUser(null);
    setNewRole("");
  };
  const handleRoleChange = (e) => {
    setNewRole(e.target.value);
  };
  const handleSaveRole = async () => {
    if (!selectedUser) return;
    setLoadingRole(true);
    try {
      const userInfo = getUserInfo();
      const token = userInfo?.token;
      await putChangeUserRole(selectedUser.email, newRole, token);
      setOpenRoleModal(false);
      setSelectedUser(null);
      setNewRole("");
      fetchAllUsers();
    } catch (error) {
      // handle error
    } finally {
      setLoadingRole(false);
    }
  };

  // Filter tab change
  const handleChangeTab = (e, value) => setRoleFilter(value);

  const handleEditTeacher = (user) => {
    setEditTeacher({ userId: user.userId, subjectId: user.subjectId || '', status: user.status || 'Active' });
    setOpenEditTeacher(true);
  };
  const handleCloseEditTeacher = () => {
    setOpenEditTeacher(false);
    setEditTeacher({ userId: '', subjectId: '', status: 'Active' });
  };
  const handleSaveEditTeacher = async () => {
    setLoadingEdit(true);
    try {
      const userInfo = getUserInfo();
      const token = userInfo?.token;
      await putUpdateTeacher(editTeacher.userId, editTeacher.subjectId, editTeacher.status, token);
      setOpenEditTeacher(false);
      fetchAllUsers();
      message.success("Cập nhật giáo viên thành công!");
    } catch (e) {
      message.error("Có lỗi xảy ra khi cập nhật giáo viên!");
    }
    setLoadingEdit(false);
  };
  const handleDeleteTeacher = (user) => {
    setDeleteUserId(user.userId);
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
    setDeleteUserId("");
  };
  const handleConfirmDelete = async () => {
    setLoadingDelete(true);
    try {
      const userInfo = getUserInfo();
      const token = userInfo?.token;
      await deleteTeacher(deleteUserId, token);
      setOpenDelete(false);
      fetchAllUsers();
      message.success("Xóa giáo viên thành công!");
    } catch (e) {
      message.error("Có lỗi xảy ra khi xóa giáo viên!");
    }
    setLoadingDelete(false);
  };

  return (
    <Box className="manage-user-container" sx={{ width: '100%', maxWidth: 1300, mx: 'auto' }}>
      <Typography className="manage-user-title" variant="h3" fontWeight={900} mb={4} color="#4B1EFF" sx={{ letterSpacing: 1, fontFamily: 'inherit' }}>Quản lý người dùng</Typography>
      <Box mb={4} display="flex" alignItems="center" gap={2}>
        <Tabs className="manage-user-title" value={roleFilter} onChange={handleChangeTab} textColor="primary" indicatorColor="primary" sx={{ minHeight: 56 }}>
          {ROLE_CATEGORIES.map(cat => (
            <Tab key={cat.value} value={cat.value} label={cat.label} icon={cat.value === 'Admin' ? <AdminPanelSettingsIcon /> : cat.value === 'Teacher' ? <SchoolIcon /> : <PersonIcon />} iconPosition="start" sx={{ fontWeight: 800, fontSize: 18, minWidth: 140 }} />
          ))}
        </Tabs>
        <Box flex={1} />
        <Box sx={{ minWidth: 260, display: 'flex', alignItems: 'center', border: '1px solid #E5E7EB', borderRadius: 2, background: '#fff' }}>
          <SearchIcon sx={{ ml: 1, color: '#888' }} />
          <input
            type="text"
            placeholder="Tìm kiếm tên, email, SĐT..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: 16,
              padding: '10px 12px',
              width: '100%',
            }}
          />
        </Box>
      </Box>
      <Box className="table-user-container" sx={{ mt: 2, borderRadius: 5, boxShadow: '0 4px 32px 0 rgba(80,80,80,0.10)', background: '#fff' }}>
        <TableUser
          listUsers={filteredUsers}
          onView={handleOpenViewModal}
          onEdit={handleEditTeacher}
          onDelete={handleDeleteTeacher}
          onChangeRole={handleOpenRoleModal}
        />
      </Box>
      {/* Modal xem thông tin user/teacher */}
      <Dialog open={openViewModal} onClose={handleCloseViewModal} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 5 } }}>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 800, fontSize: 28, letterSpacing: 1 }}>Thông tin giáo viên</DialogTitle>
        <DialogContent sx={{ minHeight: 350 }}>
          {loadingTeacherDetail ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}><CircularProgress /></Box>
          ) : teacherDetail ? (
            <Box>
              <Box display="flex" flexDirection="column" alignItems="center" mb={5}>
                <Avatar src={teacherDetail.userImage || "https://randomuser.me/api/portraits/men/32.jpg"} sx={{ width: 120, height: 120, boxShadow: 6, border: '5px solid #e3e8ff', mb: 2 }} />
                <Typography fontWeight={900} fontSize={26}>{teacherDetail.fullName}</Typography>
              </Box>
              <Grid container spacing={4} justifyContent="center">
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 4, borderRadius: 4, mb: 2, minWidth: 320 }}>
                    <Typography fontWeight={700} fontSize={18} mb={3} color="primary.main">Thông tin cơ bản</Typography>
                    <Box display="flex" flexDirection="column" gap={2}>
                      <InfoRow label="Mã giáo viên" value={teacherDetail.teacherId} />
                      <InfoRow label="User ID" value={teacherDetail.userId} />
                      <InfoRow label="Họ tên" value={teacherDetail.fullName} />
                      <InfoRow label="Họ" value={teacherDetail.firstName} />
                      <InfoRow label="Tên" value={teacherDetail.lastName} />
                      <InfoRow label="Email" value={teacherDetail.email} />
                      <InfoRow label="SĐT" value={teacherDetail.phoneNumber} />
                      <InfoRow label="Môn dạy" value={SUBJECT_OPTIONS.find(s => s.value === teacherDetail.subjectId)?.label || teacherDetail.subjectId} />
                      <InfoRow label="Trạng thái" value={teacherDetail.status === '1' || teacherDetail.status === 1 ? 'Hoạt động' : ((teacherDetail.status === '0' || teacherDetail.status === 0 || teacherDetail.status === '2' || teacherDetail.status === 2) ? 'Không hoạt động' : teacherDetail.status)} />
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper elevation={2} sx={{ p: 4, borderRadius: 4, mb: 2, minWidth: 220 }}>
                    <Typography fontWeight={700} fontSize={18} mb={3} color="primary.main">Thông tin hệ thống</Typography>
                    <Box display="flex" flexDirection="column" gap={2}>
                      <InfoRow label="Ngày tạo" value={teacherDetail.createAt ? teacherDetail.createAt.split('T')[0] : '-'} />
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          ) : selectedUser ? (
            <Box display="flex" flexDirection="column" alignItems="center" gap={4}>
              <Box sx={{ position: 'relative' }}>
                <Avatar src={selectedUser.avatar || "https://randomuser.me/api/portraits/men/32.jpg"}
                  sx={{ width: 130, height: 130, boxShadow: 6, border: '5px solid #e3e8ff', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.06)' } }}
                />
                <Box sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: '#fff', borderRadius: '50%', boxShadow: 2 }}>
                  <PersonIcon color="primary" fontSize="large" />
                </Box>
              </Box>
              <Typography variant="h5" fontWeight={800}>{selectedUser.fullName}</Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <EmailIcon color="action" />
                <Typography color="text.secondary" fontSize={20}>{selectedUser.email}</Typography>
              </Box>
              <Chip
                icon={selectedUser.role === 'Admin' ? <AdminPanelSettingsIcon /> : selectedUser.role === 'Teacher' ? <SchoolIcon /> : <PersonIcon />}
                label={selectedUser.role}
                color={selectedUser.role === 'Admin' ? 'primary' : selectedUser.role === 'Teacher' ? 'secondary' : 'default'}
                sx={{ fontWeight: 700, fontSize: 18, letterSpacing: 1 }}
              />
              <Box display="flex" alignItems="center" gap={1}>
                <PhoneIphoneIcon color="action" />
                <Typography fontSize={19}>SĐT: <b>{selectedUser.phoneNumber || "-"}</b></Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <VerifiedUserIcon color={selectedUser.isActive ? 'success' : 'disabled'} />
                <Typography fontSize={19}>Trạng thái: <Chip label={selectedUser.isActive ? "Active" : "Inactive"} color={selectedUser.isActive ? "success" : "default"} size="medium" sx={{ fontWeight: 700, fontSize: 16 }} /></Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <CalendarMonthIcon color="action" />
                <Typography fontSize={19}>Ngày tạo: <b>{selectedUser.createAt ? selectedUser.createAt.split('T')[0] : "-"}</b></Typography>
              </Box>
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={handleCloseViewModal} color="primary" variant="contained" size="large" sx={{ minWidth: 160, fontWeight: 800, borderRadius: 3, fontSize: 20, background: 'linear-gradient(90deg,#4B1EFF 0%,#6A5BFF 100%)' }}>Đóng</Button>
        </DialogActions>
      </Dialog>
      {/* Modal đổi role */}
      <Dialog open={openRoleModal} onClose={handleCloseRoleModal} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 5 } }}>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 800, fontSize: 28, letterSpacing: 1 }}>Đổi quyền người dùng</DialogTitle>
        <DialogContent sx={{ }}>
          {selectedUser && (
            <Box display="flex" flexDirection="column" alignItems="center" gap={4}>
              <Box sx={{ position: 'relative' }}>
                <Avatar src={selectedUser.avatar || "https://randomuser.me/api/portraits/men/32.jpg"}
                  sx={{ width: 110, height: 110, boxShadow: 4, border: '4px solid #e3e8ff', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' } }}
                />
                <Box sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: '#fff', borderRadius: '50%', boxShadow: 2 }}>
                  <PersonIcon color="primary" fontSize="large" />
                </Box>
              </Box>
              <Typography variant="h6" fontWeight={800}>{selectedUser.fullName}</Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <EmailIcon color="action" />
                <Typography color="text.secondary" fontSize={18}>{selectedUser.email}</Typography>
              </Box>
              <FormControl fullWidth>
                <InputLabel id="role-select-label">Role</InputLabel>
                <Select
                  labelId="role-select-label"
                  value={newRole}
                  label="Role"
                  onChange={handleRoleChange}
                  sx={{ fontSize: 18, fontWeight: 800, borderRadius: 2, letterSpacing: 1 }}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {selected === 'Admin' ? <AdminPanelSettingsIcon sx={{ mr: 1 }} /> : selected === 'Teacher' ? <SchoolIcon sx={{ mr: 1 }} /> : <PersonIcon sx={{ mr: 1 }} />}
                      <Typography fontWeight={800}>{selected}</Typography>
                    </Box>
                  )}
                >
                  <MenuItem value="Admin" sx={{ fontSize: 17, fontWeight: 700 }}>Admin</MenuItem>
                  <MenuItem value="Teacher" sx={{ fontSize: 17, fontWeight: 700 }}>Teacher</MenuItem>
                  <MenuItem value="Parent" sx={{ fontSize: 17, fontWeight: 700 }}>Parent</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={handleCloseRoleModal} color="secondary" size="large" sx={{ minWidth: 130, fontWeight: 800, borderRadius: 3, fontSize: 20 }}>Hủy</Button>
          <Button onClick={handleSaveRole} color="primary" variant="contained" disabled={loadingRole || !newRole} size="large" sx={{ minWidth: 160, fontWeight: 800, borderRadius: 3, fontSize: 20, background: 'linear-gradient(90deg,#4B1EFF 0%,#6A5BFF 100%)', boxShadow: 3, position: 'relative' }}>
            {loadingRole ? <CircularProgress size={30} sx={{ color: '#fff', position: 'absolute', left: '50%', top: '50%', mt: '-15px', ml: '-15px' }} /> : "Lưu"}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Modal edit Teacher */}
      <Dialog open={openEditTeacher} onClose={handleCloseEditTeacher} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 800, fontSize: 24 }}>Chỉnh sửa giáo viên</DialogTitle>
        <DialogContent>
          <Typography fontWeight={700} fontSize={18} mb={3} color="primary.main">Chỉnh sửa thông tin giáo viên</Typography>
          <Box display="flex" flexDirection="column" gap={3} mt={1}>
            <FormControl fullWidth>
              <InputLabel>Môn dạy</InputLabel>
              <Select
                value={editTeacher.subjectId}
                label="Môn dạy"
                onChange={e => setEditTeacher({ ...editTeacher, subjectId: e.target.value })}
              >
                {SUBJECT_OPTIONS.map(opt => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={editTeacher.status}
                label="Trạng thái"
                onChange={e => setEditTeacher({ ...editTeacher, status: e.target.value })}
              >
                <MenuItem value="Active">Hoạt động</MenuItem>
                <MenuItem value="Inactive">Không hoạt động</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={handleCloseEditTeacher} color="secondary">Hủy</Button>
          <Button onClick={handleSaveEditTeacher} color="primary" variant="contained" disabled={loadingEdit}>
            {loadingEdit ? <CircularProgress size={22} /> : "Lưu"}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Modal xác nhận xóa Teacher */}
      <Dialog open={openDelete} onClose={handleCloseDelete} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 800, fontSize: 22, color: 'error.main' }}>
          <DeleteForeverIcon sx={{ mr: 1, fontSize: 28, verticalAlign: 'middle' }} /> Xác nhận xóa giáo viên
        </DialogTitle>
        <DialogContent>
          <Typography align="center">Bạn có chắc chắn muốn xóa giáo viên này không?</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={handleCloseDelete} color="secondary">Hủy</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" disabled={loadingDelete}>
            {loadingDelete ? <CircularProgress size={22} /> : "Xóa"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

function InfoRow({ label, value }) {
  return (
    <Box display="flex" alignItems="center" gap={2} sx={{ mb: 0.5 }}>
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120, flexShrink: 0, textAlign: 'left' }}>{label}:</Typography>
      <Typography fontWeight={700} fontSize={17} sx={{ textAlign: 'left', wordBreak: 'break-word' }}>{value}</Typography>
    </Box>
  );
}

export default ManageUser;
