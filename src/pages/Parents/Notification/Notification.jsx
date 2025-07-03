import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Avatar,
  Chip,
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
import { format, parseISO, isToday, isYesterday, isThisWeek } from "date-fns";
import { vi } from "date-fns/locale";
import "./Notication.scss";
import Header from "../../../component/Header";
import axios from "axios";
import { message } from "antd";

const notificationTypes = {
  report: { label: "Báo cáo", icon: AssignmentIcon, color: "primary" },
  announcement: { label: "Thông báo", icon: NotificationsIcon, color: "info" },
  attendance: { label: "Chuyên cần", icon: ScheduleIcon, color: "warning" },
  achievement: { label: "Thành tích", icon: CheckCircleIcon, color: "success" },
  payment: { label: "Học phí", icon: WarningIcon, color: "error" },
};

const priorityColors = {
  high: "error",
  medium: "warning",
  low: "info",
};

function NotificationItem({
  notification,
  onMarkRead,
  onDelete,
  onArchive,
  menuOpen,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const typeInfo = notificationTypes[notification.type];
  const TypeIcon = typeInfo.icon;

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
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: `${typeInfo.color}.main` }}>
            <TypeIcon />
          </Avatar>
        </ListItemAvatar>

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
                <Typography variant="caption" color="text.secondary">
                  {getTimeAgo(notification.timestamp)}
                </Typography>
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedType, setSelectedType] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [loading, setLoading] = useState(false);
  const [selectedNotiId, setSelectedNotiId] = useState(null);
  const [notiDetail, setNotiDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

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
    message.success("Đã đánh dấu là đã đọc!");
  };

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    message.success("Đã xóa thông báo!");
  };

  const handleArchive = (id) => {
    // Implement archive functionality
    message.success("Đã lưu trữ thông báo!");
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const fetchNotiDetail = (notiId) => {
    console.log("notiId fetch:", notiId);
    setDetailLoading(true);
    const BASE_URL = "https://localhost:7064/api";
    axios
      .get(`${BASE_URL}/Report/${notiId}`)
      .then((res) => setNotiDetail(res.data))
      .catch(() => setNotiDetail(null))
      .finally(() => setDetailLoading(false));
  };

  // Filter notifications based on search, tab, type, and priority
  useEffect(() => {
    let filtered = notifications;

    // Filter by tab (all, unread, read)
    if (selectedTab === 1) {
      filtered = filtered.filter((n) => !n.isRead);
    } else if (selectedTab === 2) {
      filtered = filtered.filter((n) => n.isRead);
    }

    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter((n) => n.type === selectedType);
    }

    // Filter by priority
    if (selectedPriority !== "all") {
      filtered = filtered.filter((n) => n.priority === selectedPriority);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          n.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          n.teacher.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredNotifications(filtered);
  }, [notifications, selectedTab, selectedType, selectedPriority, searchTerm]);

  useEffect(() => {
    const BASE_URL = "https://localhost:7064/api";
    const classId = "class01";
    setLoading(true);
    axios
      .get(`${BASE_URL}/Report`, { params: { classId } })
      .then((res) => {
        const mapped = res.data.map((item) => ({
          id: item.reportId || item.id,
          title: item.title || "",
          content: item.description || "",
          type: "report",
          priority: "medium",
          isRead: false,
          timestamp: new Date(),
          teacher: item.teacherName || item.teacher || "",
          class: item.className || item.class || item.classId || "",
        }));
        setNotifications(mapped);
      })
      .catch((err) => {
        setNotifications([]);
      })
      .finally(() => setLoading(false));
  }, []);

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
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Tìm kiếm thông báo..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
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
                      fetchNotiDetail(notification.id);
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
                    menuOpen={selectedNotiId === notification.id}
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
              <Typography variant="body2" color="text.secondary">
                {searchTerm ||
                selectedType !== "all" ||
                selectedPriority !== "all"
                  ? "Thử thay đổi bộ lọc để xem thêm thông báo"
                  : "Bạn sẽ nhận được thông báo từ giáo viên tại đây"}
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

        {selectedNotiId && (
          <Dialog
            open={!!selectedNotiId}
            onClose={() => {
              setSelectedNotiId(null);
              setNotiDetail(null);
            }}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Chi tiết thông báo</DialogTitle>
            <DialogContent>
              {detailLoading ? (
                <CircularProgress />
              ) : notiDetail ? (
                <Box>
                  <Typography>
                    <b>Tiêu đề:</b> {notiDetail.title}
                  </Typography>
                  <Typography>
                    <b>Mô tả:</b> {notiDetail.description}
                  </Typography>
                  <Typography>
                    <b>Giáo viên:</b>{" "}
                    {notiDetail.teacherName || notiDetail.teacher}
                  </Typography>
                  <Typography>
                    <b>Lớp:</b>{" "}
                    {notiDetail.className ||
                      notiDetail.class ||
                      notiDetail.classId}
                  </Typography>
                  <Typography>
                    <b>Term:</b> {notiDetail.termId || notiDetail.term}
                  </Typography>
                </Box>
              ) : (
                <Typography>Lỗi khi tải chi tiết thông báo</Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedNotiId(null)}>Đóng</Button>
            </DialogActions>
          </Dialog>
        )}
      </Box>
    </>
  );
}
