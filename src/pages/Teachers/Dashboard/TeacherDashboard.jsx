import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  School as SchoolIcon,
  Class as ClassIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Notifications as NotificationsIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  AccessTime as TimeIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { getTeacherDetail, getTeacherCourses, getToken } from "../../../services/apiServices";
import { getUserInfo } from "../../../services/handleStorageApi";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

function StatCard({ icon, title, value, subtitle, color = "primary", onClick }) {
  return (
    <Card 
      sx={{ 
        height: "100%", 
        borderRadius: 3, 
        cursor: onClick ? "pointer" : "default",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": onClick ? {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)"
        } : {}
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar sx={{ bgcolor: `${color}.main`, width: 48, height: 48, mr: 2 }}>
            {icon}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" fontWeight="600" color={`${color}.main`}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function QuickActionCard({ title, description, icon, color, onClick }) {
  return (
    <Card 
      sx={{ 
        p: 2, 
        borderRadius: 3, 
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
        }
      }}
      onClick={onClick}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Avatar sx={{ bgcolor: `${color}.main`, width: 40, height: 40, mr: 2 }}>
          {icon}
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight="600">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}

// Hàm chuyển đổi dayOfWeek thành tên ngày
const getDayName = (dayOfWeek) => {
  const days = {
    "1": "Thứ 2",
    "2": "Thứ 3", 
    "3": "Thứ 4",
    "4": "Thứ 5",
    "5": "Thứ 6",
    "6": "Thứ 7",
    "7": "Chủ nhật"
  };
  return days[dayOfWeek] || `Ngày ${dayOfWeek}`;
};

// Hàm format thời gian
const formatTime = (timeString) => {
  try {
    const date = parseISO(timeString);
    return format(date, "HH:mm", { locale: vi });
  } catch {
    return timeString;
  }
};

export default function TeacherDashboard() {
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const user = useMemo(() => getUserInfo(), []);

  const fetchDashboardData = useCallback(async () => {
    if (hasLoaded) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const token = getToken();
      const userId = user?.id || user?.userId;

      if (!userId) {
        throw new Error("Không tìm thấy thông tin user");
      }

      // Lấy thông tin teacher để có teacherId
      const teacherRes = await getTeacherDetail(userId, token);
      const teacher = teacherRes.data;
      setTeacherInfo(teacher);

      if (!teacher.teacherId) {
        throw new Error("Không tìm thấy mã giáo viên");
      }

      // Gọi API getTeacherCourses với teacherId
      const coursesRes = await getTeacherCourses(teacher.teacherId, token);
      setCourses(coursesRes.data || []);

      setHasLoaded(true);
    } catch (err) {
      console.error("Lỗi khi tải dashboard:", err);
      setError(err.message || "Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, [user, hasLoaded]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Tính toán thống kê từ dữ liệu courses thực tế
  const stats = useMemo(() => {
    const totalCourses = courses.length;
    const activeCourses = courses.filter(c => c.status === "Active");
    const plannedCourses = courses.filter(c => c.status === "Planned").length;
    const uniqueActiveClasses = [...new Set(activeCourses.map(c => c.classId))].length;
    const activeSubjects = [...new Set(activeCourses.map(c => c.subjectName))].length;
    return {
      totalCourses,
      uniqueActiveClasses,
      plannedCourses,
      activeSubjects,
      activeCoursesCount: activeCourses.length
    };
  }, [courses]);

  // Lấy courses hôm nay
  const todayCourses = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay() === 0 ? "7" : today.getDay().toString();
    
    return courses.filter(course => 
      course.dayOfWeek === dayOfWeek && course.status === "Active"
    ).sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  }, [courses]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Chào mừng trở lại, {teacherInfo?.fullName || user?.fullName || "Teacher"}! 👋
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<SchoolIcon />}
            title="Tổng khóa học"
            value={stats.totalCourses}
            subtitle={`${stats.uniqueActiveClasses} lớp đang hoạt động`}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<ClassIcon />}
            title="Lớp đang hoạt động"
            value={stats.uniqueActiveClasses}
            subtitle={`${stats.activeSubjects} môn học`}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<ScheduleIcon />}
            title="Lịch hôm nay"
            value={todayCourses.length}
            subtitle="Khóa học sắp tới"
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<AssignmentIcon />}
            title="Khóa học dự kiến"
            value={stats.plannedCourses}
            subtitle="Đang lên kế hoạch"
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Paper sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <Typography variant="h6" fontWeight="600" gutterBottom>
          Thao tác nhanh
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <QuickActionCard
              title="Xem lịch dạy"
              description="Kiểm tra lịch dạy hôm nay"
              icon={<ScheduleIcon />}
              color="primary"
              onClick={() => console.log("Navigate to schedule")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <QuickActionCard
              title="Điểm danh"
              description="Điểm danh học sinh"
              icon={<TrendingUpIcon />}
              color="success"
              onClick={() => console.log("Navigate to attendance")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <QuickActionCard
              title="Thông báo"
              description="Gửi thông báo cho học sinh"
              icon={<NotificationsIcon />}
              color="info"
              onClick={() => console.log("Navigate to notifications")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <QuickActionCard
              title="Báo cáo"
              description="Tạo báo cáo học tập"
              icon={<AssignmentIcon />}
              color="warning"
              onClick={() => console.log("Navigate to reports")}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Teacher Info */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, height: "fit-content" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography variant="h6" fontWeight="600">
                Thông tin cá nhân
              </Typography>
              <Tooltip title="Chỉnh sửa">
                <IconButton size="small" sx={{ ml: "auto" }}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Avatar 
                src={user?.avatar} 
                sx={{ width: 80, height: 80, mr: 2 }}
              />
              <Box>
                <Typography variant="h6" fontWeight="600">
                  {teacherInfo?.fullName || user?.fullName || "Teacher"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {teacherInfo?.email || user?.email || ""}
                </Typography>
                <Chip 
                  label={teacherInfo?.status || "Active"} 
                  color={teacherInfo?.status === "Active" ? "success" : "default"}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Môn học chính"
                  secondary={stats.activeSubjects > 0 ? `${stats.activeSubjects} môn học` : "Chưa cập nhật"}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Số lớp đang dạy"
                  secondary={stats.uniqueActiveClasses}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Tổng khóa học"
                  secondary={stats.totalCourses}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Today's Schedule */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography variant="h6" fontWeight="600">
                Lịch dạy hôm nay ({todayCourses.length})
              </Typography>
              <Tooltip title="Xem tất cả">
                <IconButton size="small" sx={{ ml: "auto" }}>
                  <ViewIcon />
                </IconButton>
              </Tooltip>
            </Box>
            {todayCourses.length > 0 ? (
              <List>
                {todayCourses.map((course, index) => (
                  <ListItem 
                    key={course.courseId} 
                    divider 
                    sx={{ 
                      borderRadius: 2, 
                      mb: 1,
                      "&:hover": { bgcolor: "action.hover" }
                    }}
                  >
                    <ListItemIcon>
                      <TimeIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${course.subjectName} - ${course.classId}`}
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            {formatTime(course.startTime)} - {formatTime(course.endTime)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Khóa học ID: {course.courseId}
                          </Typography>
                        </Box>
                      }
                    />
                    <Chip
                      label={course.status}
                      color={course.status === "Active" ? "success" : "default"}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box textAlign="center" py={4}>
                <CalendarIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Không có lịch dạy hôm nay
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Hôm nay bạn không có khóa học nào được lên lịch.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Courses */}
      <Paper sx={{ p: 3, mt: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight="600" gutterBottom>
          Khóa học gần đây ({courses.length})
        </Typography>
        <Grid container spacing={2}>
          {courses.slice(0, 6).map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course.courseId}>
              <Card sx={{ p: 2, borderRadius: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <SchoolIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2" fontWeight="600">
                    {course.subjectName}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Lớp: {course.classId}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {getDayName(course.dayOfWeek)} - {formatTime(course.startTime)}-{formatTime(course.endTime)}
                </Typography>
                <Chip
                  label={course.status}
                  color={course.status === "Active" ? "success" : "default"}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
} 