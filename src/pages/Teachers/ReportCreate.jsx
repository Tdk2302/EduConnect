import React, { useState } from "react";
import { Box, Paper, Typography, TextField, Button, MenuItem, Select, InputLabel, FormControl, Stack, Alert, Fade, InputAdornment, Snackbar } from "@mui/material";
import SchoolIcon from '@mui/icons-material/School';
import EventIcon from '@mui/icons-material/Event';
import CategoryIcon from '@mui/icons-material/Category';
import TitleIcon from '@mui/icons-material/Title';
import NotesIcon from '@mui/icons-material/Notes';

const classOptions = [
  { id: "12A1", name: "Lớp 12A1" },
  { id: "11B3", name: "Lớp 11B3" },
  { id: "10C5", name: "Lớp 10C5" },
  { id: "12A2", name: "Lớp 12A2" },
];

const typeOptions = [
  { value: "activity", label: "Hoạt động" },
  { value: "attitude", label: "Thái độ" },
];

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

export default function ReportCreate() {
  const [form, setForm] = useState({
    classId: "",
    date: "",
    type: "activity",
    title: "",
    content: "",
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setForm({ classId: "", date: "", type: "activity", title: "", content: "" });
    }, 1200);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: palette.backgroundBrand, py: 6 }}>
      <Fade in timeout={700}>
        <Paper sx={{
          maxWidth: 480,
          mx: 'auto',
          p: { xs: 3, md: 5 },
          borderRadius: 3,
          background: palette.primary,
          border: `1.5px solid ${palette.brand}`,
          boxShadow: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <SchoolIcon sx={{ fontSize: 36, color: palette.brand }} />
            <Typography variant="h4" fontWeight={900} color={palette.brand} letterSpacing={1}>
              Tạo báo cáo
            </Typography>
          </Box>
          <Typography variant="subtitle1" color={palette.darkLight} fontWeight={500} mb={3} textAlign="center">
            Gửi báo cáo hoạt động/thái độ học sinh cho lớp chủ nhiệm của bạn
          </Typography>
          <form onSubmit={handleSubmit} autoComplete="off" style={{ width: '100%' }}>
            <Stack spacing={2}>
              <FormControl fullWidth required variant="outlined">
                <InputLabel id="class-label">Lớp</InputLabel>
                <Select
                  labelId="class-label"
                  name="classId"
                  value={form.classId}
                  label="Lớp"
                  onChange={handleChange}
                  sx={{ background: palette.primary, borderRadius: 2, fontWeight: 600 }}
                  startAdornment={<InputAdornment position="start"><SchoolIcon sx={{ color: palette.brand }}/></InputAdornment>}
                >
                  {classOptions.map((cls) => (
                    <MenuItem key={cls.id} value={cls.id}>{cls.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                name="date"
                label="Ngày"
                type="date"
                value={form.date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
                sx={{ background: palette.primary, borderRadius: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EventIcon sx={{ color: palette.brand }} />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl fullWidth required variant="outlined">
                <InputLabel id="type-label">Loại</InputLabel>
                <Select
                  labelId="type-label"
                  name="type"
                  value={form.type}
                  label="Loại"
                  onChange={handleChange}
                  sx={{ background: palette.primary, borderRadius: 2, fontWeight: 600 }}
                  startAdornment={<InputAdornment position="start"><CategoryIcon sx={{ color: palette.brand }}/></InputAdornment>}
                >
                  {typeOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                name="title"
                label="Tiêu đề"
                value={form.title}
                onChange={handleChange}
                required
                sx={{ background: palette.primary, borderRadius: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TitleIcon sx={{ color: palette.brand }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                name="content"
                label="Nội dung"
                value={form.content}
                onChange={handleChange}
                multiline
                minRows={5}
                required
                sx={{ background: palette.primary, borderRadius: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <NotesIcon sx={{ color: palette.brand }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  bgcolor: palette.brand,
                  color: palette.primary,
                  fontWeight: 900,
                  borderRadius: 2,
                  fontSize: 18,
                  py: 1.2,
                  boxShadow: 'none',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: '#5126a7',
                  },
                }}
                fullWidth
              >
                {loading ? 'Đang gửi...' : 'GỬI BÁO CÁO'}
              </Button>
            </Stack>
          </form>
        </Paper>
      </Fade>
      <Snackbar
        open={success}
        autoHideDuration={2200}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={Fade}
      >
        <Alert icon={<SchoolIcon fontSize="inherit" />} severity="success" sx={{ bgcolor: palette.brand, color: palette.primary, fontWeight: 700, fontSize: 18, boxShadow: 'none' }}>
          Báo cáo đã được gửi thành công!
        </Alert>
      </Snackbar>
    </Box>
  );
} 