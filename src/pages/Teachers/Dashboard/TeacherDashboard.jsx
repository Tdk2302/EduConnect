import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  Avatar,
  Chip,
  CircularProgress,
  Paper,
  Divider,
  Tooltip,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import {
  School as SchoolIcon,
  Class as ClassIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Logout as LogoutIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip, ResponsiveContainer, Legend } from "recharts";
import { getTeacherDetail, getTeacherCourses, getAttendanceByCourse, getToken } from "../../../services/apiServices";
import { getUserInfo } from "../../../services/handleStorageApi";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { useTheme } from '@mui/material/styles';
import AttendancePage from "../Schedule/AttendancePage";
import { useNavigate } from "react-router-dom";

const COLORS = ["#2563eb", "#38bdf8", "#f59e42", "#10b981", "#f43f5e", "#6366f1", "#fbbf24", "#14b8a6"];

function formatTime(timeString) {
  try {
    const date = parseISO(timeString);
    return format(date, "HH:mm", { locale: vi });
  } catch {
    return timeString;
  }
}

export default function TeacherDashboard({ setSelected }) {
  const [teacher, setTeacher] = useState(null);
  const [courses, setCourses] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [loading, setLoading] = useState(true);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();

  // Attendance modal state for dashboard
  const [attendanceModal, setAttendanceModal] = useState({ open: false, courseId: null });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const user = getUserInfo();
      const token = getToken();
      try {
        const teacherRes = await getTeacherDetail(user?.id || user?.userId, token);
        setTeacher(teacherRes.data);
        const coursesRes = await getTeacherCourses(teacherRes.data.teacherId, token);
        setCourses(coursesRes.data || []);
        if ((coursesRes.data || []).length > 0) setSelectedCourse(coursesRes.data[0].courseId);
      } catch {
        setTeacher(null);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedCourse) return;
    async function fetchAttendance() {
      setAttendanceLoading(true);
      try {
        const token = getToken();
        const res = await getAttendanceByCourse(selectedCourse, token);
        setAttendanceData(res.data || []);
      } catch {
        setAttendanceData([]);
      } finally {
        setAttendanceLoading(false);
      }
    }
    fetchAttendance();
  }, [selectedCourse]);

  const stats = useMemo(() => {
    const totalCourses = courses.length;
    const activeCourses = courses.filter(c => c.status === "Active");
    const plannedCourses = courses.filter(c => c.status === "Planned").length;
    const uniqueClasses = [...new Set(activeCourses.map(c => c.classId))].length;
    const uniqueSubjects = [...new Set(activeCourses.map(c => c.subjectName))].length;
    return { totalCourses, activeCourses: activeCourses.length, plannedCourses, uniqueClasses, uniqueSubjects };
  }, [courses]);

  const attendanceStats = useMemo(() => {
    if (!attendanceData.length) return null;
    const total = attendanceData.length;
    const present = attendanceData.filter(a => a.participation === "Có tham gia").length;
    const absent = attendanceData.filter(a => a.participation === "Không tham gia").length;
    const focusMap = attendanceData.reduce((acc, cur) => {
      acc[cur.focus] = (acc[cur.focus] || 0) + 1;
      return acc;
    }, {});
    return { total, present, absent, presentRate: total ? Math.round((present/total)*100) : 0, absentRate: total ? Math.round((absent/total)*100) : 0, focusMap };
  }, [attendanceData]);

  const focusPieData = attendanceStats ? Object.entries(attendanceStats.focusMap).map(([k, v], i) => ({ name: k, value: v, color: COLORS[i%COLORS.length] })) : [];
  const participationBarData = attendanceStats ? [
    { name: "Đi học", value: attendanceStats.present },
    { name: "Vắng", value: attendanceStats.absent },
  ] : [];

  const todayCourses = useMemo(() => {
    const today = new Date();
    const todayStr = today.toLocaleDateString('en-CA'); // 'YYYY-MM-DD' local
    return courses.filter(c =>
      c.startTime &&
      new Date(c.startTime).toLocaleDateString('en-CA') === todayStr
    ).sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  }, [courses]);

  const subjectBreakdown = useMemo(() => {
    const map = {};
    courses.forEach(c => { map[c.subjectName] = (map[c.subjectName]||0)+1; });
    return Object.entries(map).map(([k,v],i) => ({ name: k, value: v, color: COLORS[i%COLORS.length] }));
  }, [courses]);

  const classBreakdown = useMemo(() => {
    const map = {};
    courses.forEach(c => { map[c.classId] = (map[c.classId]||0)+1; });
    return Object.entries(map).map(([k,v],i) => ({ name: k, value: v, color: COLORS[i%COLORS.length] }));
  }, [courses]);

  // Attendance analytics for all courses (not just selected)
  const attendanceSummary = useMemo(() => {
    if (!courses.length) return null;
    let totalSessions = 0;
    let totalPresent = 0;
    let totalAbsent = 0;
    let attendanceTrend = [];
    courses.forEach(course => {
      if (course.attendance && Array.isArray(course.attendance)) {
        const present = course.attendance.filter(a => a.participation === "Có tham gia").length;
        const absent = course.attendance.filter(a => a.participation === "Không tham gia").length;
        totalSessions++;
        totalPresent += present;
        totalAbsent += absent;
        attendanceTrend.push({
          name: course.subjectName + '-' + course.classId,
          rate: course.attendance.length ? Math.round((present / course.attendance.length) * 100) : 0
        });
      }
    });
    const avgAttendance = totalSessions ? Math.round((totalPresent / (totalPresent + totalAbsent)) * 100) : 0;
    return {
      totalSessions,
      totalPresent,
      totalAbsent,
      avgAttendance,
      attendanceTrend
    };
  }, [courses]);

  // Find all courses with attendance data
  const coursesWithAttendance = useMemo(() => courses.filter(c => c.attendance && Array.isArray(c.attendance) && c.attendance.length > 0), [courses]);
  // State for selected analytics course
  const [analyticsCourseId, setAnalyticsCourseId] = useState("");
  // Default: most recent course with attendance
  useEffect(() => {
    if (coursesWithAttendance.length > 0 && !analyticsCourseId) {
      setAnalyticsCourseId(coursesWithAttendance[0].courseId);
    }
  }, [coursesWithAttendance, analyticsCourseId]);
  // Get selected course attendance data
  const selectedAnalyticsCourse = useMemo(() => coursesWithAttendance.find(c => c.courseId === analyticsCourseId), [coursesWithAttendance, analyticsCourseId]);
  // Attendance stats for selected course
  const analyticsAttendanceStats = useMemo(() => {
    if (!selectedAnalyticsCourse) return null;
    const data = selectedAnalyticsCourse.attendance;
    const total = data.length;
    const present = data.filter(a => a.participation === "Có tham gia").length;
    const absent = data.filter(a => a.participation === "Không tham gia").length;
    const focusMap = data.reduce((acc, cur) => {
      acc[cur.focus] = (acc[cur.focus] || 0) + 1;
      return acc;
    }, {});
    return {
      total,
      present,
      absent,
      attendanceRate: total ? Math.round((present / total) * 100) : 0,
      focusMap
    };
  }, [selectedAnalyticsCourse]);
  const analyticsFocusPieData = analyticsAttendanceStats ? Object.entries(analyticsAttendanceStats.focusMap).map(([k, v], i) => ({ name: k, value: v, color: COLORS[i%COLORS.length] })) : [];

  if (loading) return <Box sx={{display:'flex',justifyContent:'center',alignItems:'center',height:'60vh'}}><CircularProgress size={60}/></Box>;

  // Quick Action Card component
  const QuickActionCard = ({ icon, label, color, onClick }) => (
    <Card
      sx={{
        p: 2,
        borderRadius: 3,
        boxShadow: 3,
        background: color,
        color: '#fff',
        cursor: 'pointer',
        transition: 'transform 0.1s',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: 6, opacity: 0.92 },
        display: 'flex',
        alignItems: 'center',
        minHeight: 90,
      }}
      onClick={onClick}
    >
      <Box display="flex" alignItems="center" gap={2}>
        {icon}
        <Box>
          <Typography fontWeight={700} fontSize={22}>{label.count !== undefined ? label.count : ''}</Typography>
          <Typography fontSize={15}>{label.text}</Typography>
        </Box>
      </Box>
    </Card>
  );

  return (
    <Box sx={{p:{xs:2,md:4}, background:'#f7faff', minHeight:'100vh'}}>
      {/* Header */}
      <Paper sx={{p:3,mb:4,borderRadius:3,boxShadow:2}}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} md={8} lg={9}>
            <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
              <Avatar src={teacher?.avatar} sx={{width:72,height:72,boxShadow:2}}/>
              <Box>
                <Typography variant="h4" fontWeight={800} color="#14448b">Chào mừng, {teacher?.fullName||'Giáo viên'}!</Typography>
                <Typography color="text.secondary" fontSize={18}>{teacher?.email}</Typography>
                <Chip label={teacher?.status||'Active'} color={teacher?.status==='Active'?'success':'default'} size="small" sx={{mt:1}}/>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <Box display="flex" justifyContent={{xs:'flex-start',md:'flex-end'}} gap={2} mt={{xs:2,md:0}}>
              <Tooltip title="Đăng xuất"><Button variant="outlined" color="error" startIcon={<LogoutIcon/>}>Đăng xuất</Button></Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      {/* Quick Actions + Quick Stats in one row */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={6} md={3}>
          <QuickActionCard
            icon={<ScheduleIcon />}
            label={{ text: 'Xem thời khóa biểu' }}
            color="#6366f1"
            onClick={() => setSelected && setSelected('schedule')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <QuickActionCard
            icon={<AssignmentIcon />}
            label={{ text: 'Tạo báo cáo' }}
            color="#10b981"
            onClick={() => setSelected && setSelected('report')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{p:2,borderRadius:3,boxShadow:3,background:'#2563eb',color:'#fff',minHeight:90,display:'flex',alignItems:'center'}}>
            <Box display="flex" alignItems="center" gap={2}>
              <SchoolIcon/>
              <Box>
                <Typography fontWeight={700} fontSize={22}>{stats.totalCourses}</Typography>
                <Typography fontSize={15}>Tổng khóa học</Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{p:2,borderRadius:3,boxShadow:3,background:'#38bdf8',color:'#fff',minHeight:90,display:'flex',alignItems:'center'}}>
            <Box display="flex" alignItems="center" gap={2}>
              <ScheduleIcon/>
              <Box>
                <Typography fontWeight={700} fontSize={22}>{todayCourses.length}</Typography>
                <Typography fontSize={15}>Lịch hôm nay</Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
      {/* Phân tích lớp học full width as colorful column chart */}
      <Box sx={{width:'100vw',position:'relative',left:'50%',right:'50%',ml:'-50vw',mr:'-50vw',background:'#fff',py:4,mb:4}}>
        <Typography fontWeight={700} fontSize={24} mb={3} textAlign="center">Phân tích lớp học</Typography>
        <ResponsiveContainer width="100%" height={480}>
          <BarChart data={classBreakdown} margin={{ left: 60, right: 60 }}>
            <XAxis dataKey="name" tick={{fontSize:18}}/>
            <YAxis allowDecimals={false} tick={{fontSize:18}}/>
            <ReTooltip />
            <Legend />
            <Bar dataKey="value" label={{ position: 'top', fontSize: 18 }}>
              {classBreakdown.map((entry, idx) => (
                <Cell key={entry.name} fill={COLORS[idx%COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* Analytics Section */}

      {/* Lịch dạy hôm nay và Phân tích môn học, full width of content, edge to edge, no maxWidth */}
      <Grid container spacing={2} mb={2} alignItems="stretch" justifyContent="center" style={{ width: '100%' }}>
        <Grid item xs={12} md={6} style={{ width: '50%' }}>
          <Paper sx={{p:3,borderRadius:4,boxShadow:2,height:'100%',display:'flex',flexDirection:'column',justifyContent:'stretch'}}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography fontWeight={700} fontSize={18}>Lịch dạy hôm nay</Typography>
            </Box>
            <Box sx={{maxHeight:420,overflowY:'auto',pr:1,flex:1}}>
              {todayCourses.length === 0 ? <Typography color="text.secondary">Không có lịch dạy hôm nay.</Typography> : (
                <Box>
                  {todayCourses.map((course, idx) => (
                    <Card key={course.courseId} sx={{mb:2,p:2,borderRadius:3,boxShadow:1,background:'#e0e7ff',cursor:'pointer'}} onClick={() => setAttendanceModal({ open: true, courseId: course.courseId })}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Box flex={1}>
                          <Typography fontWeight={700}>{course.subjectName} - {course.classId}</Typography>
                          <Typography fontSize={15} color="text.secondary">
                            {new Date(course.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - {new Date(course.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </Typography>
                          <Typography fontSize={14} color="text.secondary">
                            Trạng thái: {course.status}
                          </Typography>
                        </Box>
                      </Box>
                    </Card>
                  ))}
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} style={{ width: '49%' }}>
          <Paper sx={{p:3,borderRadius:4,boxShadow:2,height:'100%',display:'flex',flexDirection:'column',justifyContent:'stretch'}}>
            <Box display="flex" alignItems="center" justifyContent="flex-end" mb={2}>
              <Typography fontWeight={700} fontSize={18} textAlign="right">Phân tích môn học</Typography>
            </Box>
            <Box sx={{flex:1,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie data={subjectBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
                    {subjectBreakdown.map((entry, idx) => <Cell key={entry.name} fill={COLORS[idx%COLORS.length]}/>) }
                  </Pie>
                  <ReTooltip/>
                  <Legend/>
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      {/* Recent Courses */}
      <Paper sx={{p:3,mt:3,borderRadius:4,boxShadow:2}}>
        <Typography fontWeight={700} fontSize={20} mb={2}>Khóa học gần đây</Typography>
        <Grid container spacing={2}>
          {courses.slice(0,8).map((course,idx) => (
            <Grid item xs={12} sm={6} md={3} key={course.courseId}>
              <Card sx={{p:2,borderRadius:3,boxShadow:1,background:'#fff'}}>
                <Box display="flex" alignItems="center" gap={2}>
                  <SchoolIcon color="primary"/>
                  <Box flex={1}>
                    <Typography fontWeight={700}>{course.subjectName}</Typography>
                    <Typography fontSize={15} color="text.secondary">Lớp: {course.classId}</Typography>
                    <Typography fontSize={14} color="text.secondary">{formatTime(course.startTime)} - {formatTime(course.endTime)}</Typography>
                  </Box>
                </Box>
                <Divider sx={{my:1}}/>
                <Box display="flex" alignItems="center" gap={1}>
                  <Chip label={course.status} color={course.status==='Active'?'success':'default'} size="small"/>
                  <Chip label={course.dayOfWeek ? `Thứ ${course.dayOfWeek}` : ''} size="small"/>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
      {/* AttendancePage modal for dashboard */}
      <AttendancePage
        visible={attendanceModal.open}
        courseId={attendanceModal.courseId}
        onClose={() => setAttendanceModal({ open: false, courseId: null })}
      />
    </Box>
  );
} 