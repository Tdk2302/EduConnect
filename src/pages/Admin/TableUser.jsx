import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Chip, Avatar, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

const AVATAR_URL = "https://randomuser.me/api/portraits/men/32.jpg"; // Ảnh avatar mặc định

function TableUser({ listUsers, onView, onEdit, onDelete, onChangeRole }) {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 24px 0 rgba(80,80,80,0.08)', background: '#fff', mt: 3, p: 2 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: '#f4f6fb' }}>
            <TableCell sx={{ fontWeight: 800, color: '#3a3a3a', fontSize: 16, textAlign: 'left' }}>Họ tên</TableCell>
            <TableCell sx={{ fontWeight: 800, color: '#3a3a3a', fontSize: 16, textAlign: 'center' }}>Vai trò</TableCell>
            <TableCell sx={{ fontWeight: 800, color: '#3a3a3a', fontSize: 16, textAlign: 'left' }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 800, color: '#3a3a3a', fontSize: 16, textAlign: 'center' }}>Số điện thoại</TableCell>
            <TableCell sx={{ fontWeight: 800, color: '#3a3a3a', fontSize: 16, textAlign: 'center' }}>Trạng thái</TableCell>
            <TableCell sx={{ fontWeight: 800, color: '#3a3a3a', fontSize: 16, textAlign: 'center' }}>Ngày tạo</TableCell>
            <TableCell sx={{ fontWeight: 800, color: '#3a3a3a', fontSize: 16, textAlign: 'center' }}>Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <Typography color="text.secondary">No users found.</Typography>
              </TableCell>
            </TableRow>
          ) : (
            listUsers.map((user) => (
              <TableRow
                key={user.userId || user.email}
                sx={{
                  transition: 'background 0.2s',
                  '&:hover': { background: '#f0f4ff' },
                }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={user.avatar || AVATAR_URL} alt={user.fullName} sx={{ width: 44, height: 44, boxShadow: 2 }} />
                    <Box>
                      <Typography variant="body1" fontWeight={700} color="#222">
                        {user.fullName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={user.role} color={user.role === 'Admin' ? 'primary' : user.role === 'Teacher' ? 'secondary' : 'default'} sx={{ fontWeight: 600, fontSize: 14 }} />
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>
                  <Chip
                    label={user.isActive ? "Active" : "Inactive"}
                    color={user.isActive ? "success" : "default"}
                    size="small"
                    sx={{ fontWeight: 600, fontSize: 13, px: 1.5 }}
                  />
                </TableCell>
                <TableCell>{user.createAt ? user.createAt.split('T')[0] : ''}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => onView && onView(user)} sx={{ mx: 0.5, bgcolor: '#e3e8ff', '&:hover': { bgcolor: '#d0d8ff' }, borderRadius: 2 }}>
                    <VisibilityIcon />
                  </IconButton>
                  {user.role === 'Teacher' && (
                    <>
                      <IconButton color="info" onClick={() => onEdit && onEdit(user)} sx={{ mx: 0.5, bgcolor: '#e0f7fa', '&:hover': { bgcolor: '#b2ebf2' }, borderRadius: 2 }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => onDelete && onDelete(user)} sx={{ mx: 0.5, bgcolor: '#ffeaea', '&:hover': { bgcolor: '#ffd6d6' }, borderRadius: 2 }}>
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                  <IconButton color="secondary" onClick={() => onChangeRole && onChangeRole(user)} sx={{ mx: 0.5, bgcolor: '#f3e8ff', '&:hover': { bgcolor: '#e1d0ff' }, borderRadius: 2 }}>
                    <span role="img" aria-label="change-role" style={{ fontSize: 20 }}>🔄</span>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TableUser;
