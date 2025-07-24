import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Divider,
  Badge,
  Card,
  CardContent,
  Grid,
  Stack,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Skeleton,
  Fab,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Event as EventIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Class as ClassIcon,
  Refresh as RefreshIcon,
  MarkEmailRead as MarkReadIcon,
  Delete as DeleteIcon,
  Archive as ArchiveIcon,
} from "@mui/icons-material";
import { format, isToday, isYesterday, isThisWeek } from "date-fns";
import { vi } from "date-fns/locale";
import "./Notication.scss";
import Header from "../../../component/Header";
import { message } from "antd";
import { getReport } from "../../../services/apiServices";
import { getUserInfo } from "../../../services/handleStorageApi";
import { getStudentByParentEmail } from "../../../services/apiServices";
import { getTermByTermID } from "../../../services/apiServices";

const priorityColors = {
  high: "error",
  medium: "warning",
  low: "info",
};

const notificationTypes = {
  report: { label: "Báo cáo", icon: AssignmentIcon, color: "primary" },
  announcement: { label: "Thông báo", icon: NotificationsIcon, color: "info" },
  attendance: { label: "Chuyên cần", icon: ScheduleIcon, color: "warning" },
  achievement: { label: "Thành tích", icon: CheckCircleIcon, color: "success" },
  payment: { label: "Học phí", icon: WarningIcon, color: "error" },
};

function NotificationItem({
  notification,
  onMarkRead,
  onDelete,
  onArchive,
  onShowDetail, // Thêm vào đây
  menuOpen,
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  // Khởi tạo typeInfo
  const typeInfo = notificationTypes[notification.type];
  const typeColor = notificationTypes[notification.color];

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getTimeAgo = (timestamp) => {
    if (isToday(timestamp)) {
      return format(timestamp, "HH:mm");
    } else if (isYesterday(timestamp)) {
      return "Hôm qua";
    } else if (isThisWeek(timestamp)) {
      return format(timestamp, "EEEE", { locale: vi });
    } else {
      return format(timestamp, "dd/MM/yyyy");
    }
  };

  return (
    <>
      <ListItem
        onClick={() => {
          onMarkRead(notification.id); // Đánh dấu là đã đọc
          onShowDetail(notification); // Gọi hàm hiển thị chi tiết
        }}
        sx={{
          mb: 1,
          borderRadius: 2,
          backgroundColor: notification.isRead ? "transparent" : "action.hover",
          border: notification.isRead ? "1px solid" : "2px solid",
          borderColor: notification.isRead
            ? "divider"
            : `${priorityColors[notification.priority]}.main`,
          "&:hover": {
            backgroundColor: "action.hover",
            transform: "translateY(-1px)",
            boxShadow: 1,
            transition: "all 0.2s ease-in-out",
          },
        }}
      >
        <ListItemText
          primary={
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={notification.isRead ? "normal" : "bold"}
                sx={{ flexGrow: 1 }}
              >
                {notification.title}
              </Typography>
            </Box>
          }
          secondary={
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {notification.content}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  fontSize: "0.75rem",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <PersonIcon fontSize="small" />
                  <Typography variant="caption">
                    {notification.teacher}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <ClassIcon fontSize="small" />
                  <Typography variant="caption">
                    {notification.class}
                  </Typography>
                </Box>
                {/* <Typography variant="caption" color="text.secondary">
                  {getTimeAgo(notification)}
                </Typography> */}
              </Box>
            </Box>
          }
        />

        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            handleMenuClick(e);
          }}
        >
          <MoreIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={(e) => {
            e && e.stopPropagation();
            handleMenuClose();
          }}
        >
          {!notification.isRead && (
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                onMarkRead(notification.id);
                handleMenuClose();
              }}
            >
              <MarkReadIcon sx={{ mr: 1 }} />
              Đánh dấu đã đọc
            </MenuItem>
          )}
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              onArchive(notification.id);
              handleMenuClose();
            }}
          >
            <ArchiveIcon sx={{ mr: 1 }} />
            Lưu trữ
          </MenuItem>
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              onDelete(notification.id);
              handleMenuClose();
            }}
          >
            <DeleteIcon sx={{ mr: 1 }} />
            Xóa
          </MenuItem>
        </Menu>
      </ListItem>
    </>
  );
}

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] =
    useState(notifications);
  // const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedType, setSelectedType] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [loading, setLoading] = useState(false);
  const [selectedNotiId, setSelectedNotiId] = useState(null);
  const [notiDetail, setNotiDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedReport, setSelectedReport] = useState(null); // State để lưu thông tin báo cáo
  const getTimeAgo = (timestamp) => {
    if (isToday(timestamp)) {
      return format(timestamp, "HH:mm");
    } else if (isYesterday(timestamp)) {
      return "Hôm qua";
    } else if (isThisWeek(timestamp)) {
      return format(timestamp, "EEEE", { locale: vi });
    } else {
      return format(timestamp, "dd/MM/yyyy");
    }
  };
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };


  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleMarkRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    message.success("Đã xóa thông báo!");
  };

  const handleArchive = (id) => {
    message.success("Đã lưu trữ thông báo!");
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleRefresh = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleShowDetail = (notification) => {
    setSelectedReport(notification); // Lưu thông tin báo cáo vào state
  };

  useEffect(() => {
    let filtered = notifications;
    if (selectedTab === 1) {
      filtered = filtered.filter((n) => !n.isRead);
    } else if (selectedTab === 2) {
      filtered = filtered.filter((n) => n.isRead);
    }

    // Lọc theo học sinh đã chọn
    if (selectedStudent) {
      const selectedStudentObj = students.find(
        (student) =>
          student.fullName === selectedStudent ||
          student.studentId === selectedStudent
      );
      const classId = selectedStudentObj?.classId; // Lấy classId của học sinh đã chọn
      // Lọc thông báo theo classId
      if (classId) {
        filtered = filtered.filter((n) => n.classId === classId);
      }
    }
    console.log(filtered);
    setFilteredNotifications(filtered);
  }, [notifications, selectedTab, selectedStudent]);

  useEffect(() => {
    if (!selectedStudent) return;
    const selectedStudentObj = students.find(
      (student) =>
        student.fullName === selectedStudent ||
        student.studentId === selectedStudent
    );
    const classId = selectedStudentObj?.classId || "";
    const fetchReport = async () => {
      const userInfo = getUserInfo();
      setLoading(true);
      try {
        const res = await getReport(classId, userInfo.token);
        const mapped = await Promise.all(
          res.data.map(async (item) => {
            const termInfo = await axios.get(
              `https://localhost:7064/api/Term/${item.termId}`,
              {
                headers: { Authorization: `Bearer ${userInfo.token}` },
              }
            );
            return {
              id: item.reportId,
              title: item.title,
              content: item.description,
              isRead: false,
              timestamp: new Date(),
              teacher: item.teacherName,
              class: item.className,
              classId: item.classId,
              startTime: format(new Date(termInfo.data.startTime), "HH:mm", {
                locale: vi,
              }),
              endTime: format(new Date(termInfo.data.endTime), "HH:mm", {
                locale: vi,
              }),
              createdAt: termInfo.data.createdAt,
            };
          })
        );
        console.log("map", mapped);
        setNotifications(mapped);
      } catch (err) {
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [selectedStudent]);


  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleMarkRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    message.success("Đã xóa thông báo!");
  };

  const handleArchive = (id) => {
    message.success("Đã lưu trữ thông báo!");
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleRefresh = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleShowDetail = (notification) => {
    setSelectedReport(notification); // Lưu thông tin báo cáo vào state
  };

  // Thay đổi giá trị value của Select thành studentId
  useEffect(() => {
    let filtered = notifications;
    if (selectedTab === 1) {
      filtered = filtered.filter((n) => !n.isRead);
    } else if (selectedTab === 2) {
      filtered = filtered.filter((n) => n.isRead);
    }
    // Lọc theo học sinh đã chọn
    if (selectedStudent) {
      const selectedStudentObj = students.find(
        (student) => student.studentId === selectedStudent
      );
      const classId = selectedStudentObj?.classId; // Lấy classId của học sinh đã chọn
      // Lọc thông báo theo classId
      if (classId) {
        filtered = filtered.filter((n) => n.classId === classId);
      }
    }
    setFilteredNotifications(filtered);
  }, [notifications, selectedTab, selectedStudent]);

  // Khi fetch students, setSelectedStudent là studentId
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const userInfo = getUserInfo();
        const res = await getStudentByParentEmail(
          userInfo.token,
          userInfo.email
        );
        setStudents(res.data || []);
        if (res.data && res.data.length > 0) {
          setSelectedStudent(res.data[0].studentId); // Sử dụng studentId
        }
      } catch (err) {
        setStudents([]);
      }
    };
    fetchStudents();
  }, []);


  // Khi fetch report, tìm student theo studentId
  useEffect(() => {
    if (!selectedStudent) return;
    const selectedStudentObj = students.find(
      (student) => student.studentId === selectedStudent
    );
    const classId = selectedStudentObj?.classId || "";
    const fetchReport = async () => {
      const userInfo = getUserInfo();
      setLoading(true);
      try {
        const res = await getReport(classId, userInfo.token);
        const mapped = await Promise.all(
          res.data.map(async (item) => {
            const termInfo = await axios.get(
              `https://localhost:7064/api/Term/${item.termId}`,
              {
                headers: { Authorization: `Bearer ${userInfo.token}` },
              }
            );
            return {
              id: item.reportId,
              title: item.title,
              content: item.description,
              isRead: false,
              timestamp: new Date(),
              teacher: item.teacherName,
              class: item.className,
              classId: item.classId,
              startTime: format(new Date(termInfo.data.startTime), "HH:mm", {
                locale: vi,
              }),
              endTime: format(new Date(termInfo.data.endTime), "HH:mm", {
                locale: vi,
              }),
              createdAt: termInfo.data.createdAt,
            };
          })
        );
        setNotifications(mapped);
      } catch (err) {
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [selectedStudent]);


  return (
    <>
      <Header />
      <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
        {/* Header */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon
                  sx={{ fontSize: 40, color: "primary.main" }}
                />
              </Badge>
              <Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  Thông báo
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Nhận thông báo từ giáo viên về tình hình học tập của con
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                disabled={loading}
              >
                Làm mới
              </Button>
              {unreadCount > 0 && (
                <Button
                  variant="contained"
                  startIcon={<MarkReadIcon />}
                  onClick={handleMarkAllRead}
                >
                  Đánh dấu tất cả đã đọc
                </Button>
              )}
            </Box>
          </Box>

          {/* Search and Filters */}
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel id="student-select-label">Chọn học sinh</InputLabel>
                <Select
                  labelId="student-select-label"
                  value={selectedStudent}
                  label="Chọn học sinh"
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        minWidth: 250,
                        maxWidth: 400,
                      },
                    },
                  }}
                >
                  {students.map((student) => (
                    <MenuItem
                      key={student.studentId || student.id}
                      value={student.studentId} // Sử dụng studentId làm value
                    >
                      {student.fullName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Tabs */}
        <Paper sx={{ mb: 3, borderRadius: 3 }}>
          <Tabs value={selectedTab} onChange={handleTabChange} sx={{ px: 2 }}>
            <Tab label={`Tất cả (${notifications.length})`} />
            <Tab label={`Chưa đọc (${unreadCount})`} />
            <Tab label={`Đã đọc (${notifications.length - unreadCount})`} />
          </Tabs>
        </Paper>

        {/* Notifications List */}
        <Paper sx={{ borderRadius: 3 }}>
          {loading ? (
            <Box sx={{ p: 3 }}>
              {[1, 2, 3].map((item) => (
                <Box key={item} sx={{ mb: 2 }}>
                  <Skeleton variant="rectangular" height={100} />
                </Box>
              ))}
            </Box>
          ) : filteredNotifications.length > 0 ? (
            <List sx={{ p: 2 }}>
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => {
                    if (!notification.menuOpen) {
                      setSelectedNotiId(notification.id);
                      setNotifications((prev) =>
                        prev.map((n) =>
                          n.id === notification.id ? { ...n, isRead: true } : n
                        )
                      );
                    }
                  }}
                >
                  <NotificationItem
                    notification={notification}
                    onMarkRead={handleMarkRead}
                    onDelete={handleDelete}
                    onArchive={handleArchive}
                    onShowDetail={handleShowDetail}
                    // menuOpen={selectedNotiId === notification.id}
                  />
                </div>
              ))}
            </List>
          ) : (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <NotificationsIcon
                sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Không có thông báo nào
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Floating Action Button */}
        <Tooltip title="Làm mới thông báo">
          <Fab
            color="primary"
            aria-label="refresh"
            sx={{ position: "fixed", bottom: 16, right: 16 }}
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshIcon />
          </Fab>
        </Tooltip>

        {selectedReport && (
          <Dialog
            open={!!selectedReport}
            onClose={() => setSelectedReport(null)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>{selectedReport.title}</DialogTitle>
            <DialogContent>
              <Typography variant="body2">
                Giáo viên: {selectedReport.teacher}
              </Typography>
              <Typography variant="body2">
                Lớp: {selectedReport.class}
              </Typography>
              <Typography variant="body2">
                Term: {selectedReport.termDetails?.name || "Không có thông tin"}
              </Typography>
              <Typography variant="body2">
                Bắt đầu: {selectedReport.startTime || "Không có thông tin"}
              </Typography>
              <Typography variant="body2">
                Kết thúc: {selectedReport.endTime || "Không có thông tin"}
              </Typography>
              <Typography variant="body1">
                {selectedReport.content &&
                  selectedReport.content.split("\n").map((line, idx) => (
                    <React.Fragment key={idx}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedReport(null)}>Đóng</Button>
            </DialogActions>
          </Dialog>
        )}
      </Box>
    </>
  );
}