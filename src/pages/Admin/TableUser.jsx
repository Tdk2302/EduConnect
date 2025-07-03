import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Chip, Avatar, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

const AVATAR_URL = "https://randomuser.me/api/portraits/men/32.jpg"; // Ảnh avatar mặc định

function TableUser({ listUsers, onView, onEdit, onDelete }) {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #E5E7EB', boxShadow: 'none', background: '#fff', mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: '#F6F8FC' }}>
            <TableCell sx={{ fontWeight: 700, color: '#4B1EFF' }}>Full Name</TableCell>
            <TableCell sx={{ fontWeight: 700, color: '#4B1EFF' }}>Role</TableCell>
            <TableCell sx={{ fontWeight: 700, color: '#4B1EFF' }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 700, color: '#4B1EFF' }}>Phone Number</TableCell>
            <TableCell sx={{ fontWeight: 700, color: '#4B1EFF' }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 700, color: '#4B1EFF' }}>Created At</TableCell>
            <TableCell sx={{ fontWeight: 700, color: '#4B1EFF' }}>Actions</TableCell>
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
              <TableRow key={user.userId || user.email}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={AVATAR_URL} alt={user.fullName} sx={{ width: 36, height: 36 }} />
                    <Typography variant="body1" fontWeight={600} color="#222">
                      {user.fullName}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>
                  <Chip
                    label={user.isActive ? "Active" : "Inactive"}
                    color={user.isActive ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell>{user.createAt ? user.createAt.split('T')[0] : ''}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => onView(user)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton color="info" onClick={() => onEdit(user)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => onDelete(user)}>
                    <DeleteIcon />
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
