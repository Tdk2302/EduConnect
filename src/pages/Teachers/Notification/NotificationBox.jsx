import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  IconButton,
  Tabs,
  Tab,
  Stack,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ClassIcon from "@mui/icons-material/Class";
import AssessmentIcon from "@mui/icons-material/Assessment";
import InfoIcon from "@mui/icons-material/Info";
import ArticleIcon from "@mui/icons-material/Article";
import CampaignIcon from "@mui/icons-material/Campaign";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { format, subDays, addDays, startOfDay } from "date-fns";
import vi from "date-fns/locale/vi";
import "./NotificationBox.css";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

// Dynamically generate dates for mock data
const today = new Date();
const todayStr = format(today, "yyyy-MM-dd");
const yesterdayStr = format(subDays(today, 1), "yyyy-MM-dd");
const twoDaysAgoStr = format(subDays(today, 2), "yyyy-MM-dd");

// Expanded dummy data with dynamic dates - FIXED
let allEvents = [
  // Today's events
  {
    date: todayStr,
    classId: "12A1",
    type: "Report",
    title: "Báo cáo học tập hôm nay",
    content: "Tỷ lệ hoàn thành bài tập 95%.",
  },
  {
    date: todayStr,
    classId: "12A1",
    type: "Announcement",
    title: "Họp phụ huynh khẩn",
    content: "Thông báo về việc thay đổi lịch họp phụ huynh.",
  },
  {
    date: todayStr,
    classId: "11B3",
    type: "Announcement",
    title: "Thông báo họp phụ huynh",
    content: "Họp phụ huynh vào 8h sáng Chủ Nhật tuần này.",
  },
  {
    date: todayStr,
    classId: "10C5",
    type: "Announcement",
    title: "Học sinh đi muộn",
    content: "Em Nguyễn Văn D đi muộn 15 phút.",
  },

  // Yesterday's events
  {
    date: yesterdayStr,
    classId: "12A1",
    type: "Announcement",
    title: "Học sinh vắng",
    content: "Em Lê Thị C vắng không phép.",
  },
  {
    date: yesterdayStr,
    classId: "10C5",
    type: "Report",
    title: "Báo cáo chuyên cần",
    content: "Lớp có 1 lượt đi muộn.",
  },
  {
    date: yesterdayStr,
    classId: "12A2",
    type: "Report",
    title: "Báo cáo quỹ lớp",
    content: "Cập nhật quỹ: 3,100,000đ.",
  },
  {
    date: yesterdayStr,
    classId: "11B3",
    type: "Report",
    title: "Báo cáo điểm danh",
    content: "Lớp 11B3 đủ sĩ số.",
  },

  // Two days ago's events
  {
    date: twoDaysAgoStr,
    classId: "10C5",
    type: "Announcement",
    title: "Khen thưởng",
    content:
      "Học sinh Nguyễn Thị E đạt giải nhất thi học sinh giỏi cấp trường.",
  },
  {
    date: twoDaysAgoStr,
    classId: "12A2",
    type: "Announcement",
    title: "Nhắc nhở học phí",
    content: "Phụ huynh vui lòng hoàn thành học phí tháng 6.",
  },

  // Some old static data
  {
    date: "2024-06-28",
    classId: "12A1",
    type: "Report",
    title: "Báo cáo học tập Tuần 25",
    content: "Tỷ lệ hoàn thành bài tập 90%.",
  },
  {
    date: "2024-06-28",
    classId: "11B3",
    type: "Announcement",
    title: "Học sinh nghỉ học",
    content: "Em Mai Văn A xin nghỉ phép.",
  },
];

const classesData = [
  {
    id: "class01",
    name: "Lớp 12A1",
    teacher: "Nguyễn Thị Lan",
    students: { current: 32, total: 35 },
  },
  {
    id: "class02",
    name: "Lớp 11B3",
    teacher: "Trần Văn Hùng",
    students: { current: 38, total: 40 },
  },
  {
    id: "class03",
    name: "Lớp 10C5",
    teacher: "Lê Thị Hoa",
    students: { current: 30, total: 30 },
  },
  {
    id: "class04",
    name: "Lớp 12A2",
    teacher: "Phan Anh Dũng",
    students: { current: 34, total: 34 },
  },
];

function StatCard({ icon, title, value, color = "primary" }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        display: "flex",
        alignItems: "center",
        borderRadius: 3,
        height: "100%",
      }}
    >
      <Avatar sx={{ bgcolor: `${color}.main`, width: 48, height: 48, mr: 2 }}>
        {icon}
      </Avatar>
      <Box>
        <Typography variant="h6" fontWeight="600">
          {value}
        </Typography>
        <Typography color="text.secondary">{title}</Typography>
      </Box>
    </Paper>
  );
}

function ClassDetailView({ classInfo }) {
  const reports = classInfo.events.filter((e) => e.type === "Report");
  const announcements = classInfo.events.filter(
    (e) => e.type === "Announcement"
  );

  const chartData = [
    { name: "Báo cáo", value: reports.length },
    { name: "Thông báo", value: announcements.length },
  ].filter((d) => d.value > 0);

  const COLORS = ["#FF8042", "#00C49F"];
  const totalEvents = classInfo.events.length;

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, width: "100%" }}>
      <Grid container spacing={4} alignItems="flex-start">
        {/* Left: Pie Chart + Custom Legend */}
        <Grid item xs={12} md={5}>
          <Typography variant="h6" fontWeight="600" mb={2}>
            Phân loại
          </Typography>
          {chartData.length > 0 ? (
            <>
              <Box sx={{ height: 200, position: "relative" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="value"
                      paddingAngle={5}
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [
                        `${value} (${((value / totalEvents) * 100).toFixed(0)}%)`,
                        "Số lượng",
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h5" fontWeight="700">
                    {totalEvents}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Hoạt động
                  </Typography>
                </Box>
              </Box>
              <List dense sx={{ mt: 2, p: 0 }}>
                {chartData.map((entry, index) => (
                  <ListItem key={entry.name} disableGutters sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 24 }}>
                      <Box
                        sx={{
                          width: 14,
                          height: 14,
                          bgcolor: COLORS[index % COLORS.length],
                          borderRadius: "3px",
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${entry.name}: ${entry.value} (${((entry.value / totalEvents) * 100).toFixed(0)}%)`}
                      primaryTypographyProps={{
                        variant: "body2",
                        fontWeight: 500,
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          ) : (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="280px"
              color="text.secondary"
            >
              <Typography>Không có dữ liệu thống kê.</Typography>
            </Box>
          )}
        </Grid>

        {/* Right: Details List */}
        <Grid item xs={12} md={7}>
          <Typography variant="h6" fontWeight="600" mb={2}>
            Chi tiết hoạt động
          </Typography>
          <Box sx={{ maxHeight: 280, overflowY: "auto", pr: 1 }}>
            <List dense disablePadding>
              {classInfo.events.map((event, index) => (
                <ListItem
                  key={index}
                  divider={index < classInfo.events.length - 1}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {event.type === "Report" ? (
                      <ArticleIcon color="warning" />
                    ) : (
                      <CampaignIcon color="info" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={event.title}
                    secondary={event.content}
                    primaryTypographyProps={{ fontWeight: "500" }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export function ensureDemoEventForDate(dateStr) {
  const hasEvent = allEvents.some((ev) => ev.date === dateStr);
  if (!hasEvent) {
    // Tạo event demo cho tất cả classId trong classesData
    allEvents = [
      ...allEvents,
      ...classesData.map((cls) => ({
        date: dateStr,
        classId: cls.id,
        type: "Report",
        title: "Demo báo cáo cho ngày " + dateStr,
        content: "Đây là dữ liệu demo tự động tạo cho ngày bạn chọn.",
      })),
    ];
  }
}

export default function NotificationDashboard() {
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [notifications, setNotifications] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    selectedClasses: [],
  });
  const [sending, setSending] = useState(false);

  // Always ensure demo data for selected date
  ensureDemoEventForDate(format(selectedDate, "yyyy-MM-dd"));

  const dailyData = useMemo(() => {
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const eventsForDate = allEvents.filter((e) => e.date === dateStr);

    const classesWithEvents = classesData
      .map((c) => ({
        ...c,
        events: eventsForDate.filter((e) => e.classId === c.id),
      }))
      .filter((c) => c.events.length > 0);

    return { events: eventsForDate, classes: classesWithEvents };
  }, [selectedDate]);

  const totalReports = dailyData.events.filter(
    (e) => e.type === "Report"
  ).length;
  const totalAnnouncements = dailyData.events.filter(
    (e) => e.type === "Announcement"
  ).length;

  const overviewChartData = useMemo(() => {
    if (!dailyData.classes || dailyData.classes.length === 0) return [];
    return dailyData.classes.map((cls) => ({
      name: cls.id,
      "Báo cáo": cls.events.filter((e) => e.type === "Report").length,
      "Thông báo": cls.events.filter((e) => e.type === "Announcement").length,
    }));
  }, [dailyData]);

  // Only show the first class (homeroom teacher's class)
  const homeroomClass =
    dailyData.classes.length > 0 ? dailyData.classes[0] : null;

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setForm({ title: "", description: "", content: "", selectedClasses: [] });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleClassCheck = (classId) => {
    setForm((prev) => {
      const selected = prev.selectedClasses.includes(classId)
        ? prev.selectedClasses.filter((id) => id !== classId)
        : [...prev.selectedClasses, classId];
      return { ...prev, selectedClasses: selected };
    });
  };

  const handleSendNotification = async () => {
    setSending(true);
    try {
      for (const classId of form.selectedClasses) {
        const classInfo = classesData.find((c) => c.id === classId);
        const notificationData = {
          teacherId: "",
          title: form.title,
          description: form.description,
          classId: classInfo.id,
          termID: "2024-1",
          teacherName: classInfo.teacher,
          className: classInfo.name,
        };
        await createNotification(notificationData);
      }
      toast.success("Gửi thông báo thành công!");
      handleCloseDialog();
    } catch (error) {
      toast.error("Gửi thông báo thất bại!");
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await getNotificationsByClass("12A1"); // truyền classId phù hợp
        setNotifications(res.data); // tuỳ theo API trả về
      } catch (error) {
        setNotifications([]);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
      <Stack spacing={3}>
        {/* Nút tạo thông báo */}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenDialog}
          >
            Tạo thông báo
          </Button>
        </Box>
        {/* Dialog tạo thông báo */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Tạo thông báo mới</DialogTitle>
          <DialogContent>
            <TextField
              margin="normal"
              label="Tiêu đề"
              name="title"
              fullWidth
              value={form.title}
              onChange={handleFormChange}
            />
            <TextField
              margin="normal"
              label="Mô tả ngắn"
              name="description"
              fullWidth
              value={form.description}
              onChange={handleFormChange}
            />
            <TextField
              margin="normal"
              label="Nội dung chi tiết"
              name="content"
              fullWidth
              multiline
              minRows={3}
              value={form.content}
              onChange={handleFormChange}
            />
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Chọn lớp gửi thông báo:
              </Typography>
              {classesData.map((cls) => (
                <FormControlLabel
                  key={cls.id}
                  control={
                    <Checkbox
                      checked={form.selectedClasses.includes(cls.id)}
                      onChange={() => handleClassCheck(cls.id)}
                    />
                  }
                  label={cls.name}
                />
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={sending}>
              Hủy
            </Button>
            <Button
              onClick={handleSendNotification}
              variant="contained"
              color="primary"
              disabled={sending || !form.title || !form.selectedClasses.length}
            >
              {sending ? "Đang gửi..." : "Gửi thông báo"}
            </Button>
          </DialogActions>
        </Dialog>
        {/* Date Navigator */}
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            borderRadius: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="h6" fontWeight="600">
            Thông báo ngày: {format(selectedDate, "dd/MM/yyyy")}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Button
              variant="outlined"
              onClick={() => setSelectedDate(subDays(selectedDate, 1))}
            >
              Ngày trước
            </Button>
            <DatePicker
              label="Chọn ngày"
              value={selectedDate}
              onChange={(newDate) => setSelectedDate(startOfDay(newDate))}
              slotProps={{ textField: { size: "small", sx: { width: 150 } } }}
            />
            <Button
              variant="outlined"
              onClick={() => setSelectedDate(addDays(selectedDate, 1))}
            >
              Ngày sau
            </Button>
            <Button
              variant="contained"
              onClick={() => setSelectedDate(startOfDay(new Date()))}
            >
              Hôm nay
            </Button>
          </Box>
        </Paper>

        {/* Stat Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <StatCard
              icon={<ClassIcon />}
              title="Lớp có hoạt động"
              value={dailyData.classes.length}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard
              icon={<AssessmentIcon />}
              title="Tổng báo cáo"
              value={totalReports}
              color="warning"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard
              icon={<InfoIcon />}
              title="Tổng thông báo"
              value={totalAnnouncements}
              color="info"
            />
          </Grid>
        </Grid>

        {/* Overview Chart */}
        {dailyData.classes.length > 0 && (
          <Paper
            variant="outlined"
            sx={{ p: { xs: 2, md: 3 }, borderRadius: 4 }}
          >
            <Typography variant="h6" fontWeight="600" mb={2}>
              Tổng quan hoạt động trong ngày
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={overviewChartData}
                  margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip wrapperStyle={{ zIndex: 1100 }} />
                  <Legend />
                  <Bar
                    dataKey="Báo cáo"
                    fill="#FF8042"
                    name="Báo cáo"
                    radius={[5, 5, 0, 0]}
                  />
                  <Bar
                    dataKey="Thông báo"
                    fill="#00C49F"
                    name="Thông báo"
                    radius={[5, 5, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        )}

        {/* Main content area with Accordion restored */}
        <Typography variant="h5" fontWeight={700}>
          Hoạt động & Thái độ học sinh trong ngày
        </Typography>
        {homeroomClass ? (
          <Paper
            key={homeroomClass.id}
            variant="outlined"
            sx={{ borderRadius: 3, background: "#EAF1FF", p: { xs: 2, md: 3 } }}
          >
            <Typography variant="h6" fontWeight="600" sx={{ color: "#1F2937" }}>
              {homeroomClass.name}
              <Typography
                component="span"
                sx={{ color: "#9CA3AF", ml: 2, fontWeight: "normal" }}
              >
                - GVCN: {homeroomClass.teacher}
              </Typography>
            </Typography>
            <ClassDetailView classInfo={homeroomClass} />
          </Paper>
        ) : (
          <Paper
            variant="outlined"
            sx={{ borderRadius: 3, background: "#EAF1FF" }}
          >
            <Box textAlign="center" p={5}>
              <InfoIcon sx={{ fontSize: 48, color: "#9CA3AF" }} />
              <Typography variant="h6" color="#9CA3AF">
                Không có hoạt động nào trong ngày này.
              </Typography>
            </Box>
          </Paper>
        )}
      </Stack>
    </LocalizationProvider>
  );
}
