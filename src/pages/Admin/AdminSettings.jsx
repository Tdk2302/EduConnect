import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

const palette = {
  primary: "#ffffff",
  secondary: "#E5E7EB",
  tertiary: "#1F2937",
  darkLight: "#9CA3AF",
  brand: "#6D28D9",
  green: "#10B981",
  red: "#EF4444",
  background: "#EBEBF5",
  active: "#2563eb",
  black: "#000000",
  backgroundBrand: "#EAF1FF"
};

export default function AdminSettings() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: palette.backgroundBrand, py: 6 }}>
      <Paper sx={{
        borderRadius: 2,
        background: '#fff',
        border: '1px solid #E5E7EB',
        boxShadow: 'none',
        p: 3,
      }}>
        <Typography variant="h5" fontWeight={700} color="#222" mb={2}>
          Cài đặt hệ thống (Demo)
        </Typography>
        <Typography color="#444">
          Đây là trang cài đặt hệ thống. Bạn có thể thêm các tuỳ chọn cấu hình tại đây.
        </Typography>
      </Paper>
    </Box>
  );
} 