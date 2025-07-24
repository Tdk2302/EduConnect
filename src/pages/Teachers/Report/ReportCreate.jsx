import React, { useState, useEffect } from "react";
import {
  Box, Typography, Card, CardContent, Chip, CircularProgress, Divider, Button, TextField, Select, MenuItem, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Tabs, Tab, Paper
} from "@mui/material";
import { Assignment as AssignmentIcon, Event as EventIcon, School as SchoolIcon, Delete as DeleteIcon, History as HistoryIcon, Visibility as VisibilityIcon } from "@mui/icons-material";
import { postTerm, getToken, generateReport, postReport } from "../../../services/apiServices";

const MODES = [
  { value: "tháng", label: "Tháng" },
  { value: "năm", label: "Năm" },
  { value: "ngay", label: "Tùy chọn ngày" },
];
const CLASS_OPTIONS = [
  { value: "class01", label: "Lớp 01" },
  { value: "class02", label: "Lớp 02" },
  { value: "class03", label: "Lớp 03" },
  { value: "class04", label: "Lớp 04" },
  { value: "class05", label: "Lớp 05" },
];
const TEACHER_OPTIONS = [
  { value: "T001", label: "Nguyễn Văn A" },
  { value: "T002", label: "Trần Thị B" },
  { value: "T003", label: "Lê Văn C" },
  { value: "T004", label: "Phạm Thị D" },
  { value: "T005", label: "Hoàng Văn E" },
];

function getReportHistory() {
  return JSON.parse(localStorage.getItem("report_history") || "[]");
}
function saveReportHistory(list) {
  localStorage.setItem("report_history", JSON.stringify(list));
}

export default function ReportCreate() {
  // Tabs
  const [tab, setTab] = useState(0);

  // State for report creation
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState("tháng");
  const [month, setMonth] = useState(new Date().getMonth() + 1); // 1-12
  const [year, setYear] = useState(new Date().getFullYear());
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [termID, setTermID] = useState("");
  const [classId, setClassId] = useState("");
  const [reportContent, setReportContent] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [dialog, setDialog] = useState({ open: false, report: null });

  // History
  const [history, setHistory] = useState([]);
  const [filterClass, setFilterClass] = useState("");

  useEffect(() => {
    setHistory(getReportHistory());
  }, []);

  // Auto-update start/end date based on mode/month/year
  useEffect(() => {
    if (mode === "tháng") {
      const y = year;
      const m = month;
      const firstDay = new Date(y, m - 1, 1);
      const lastDay = new Date(y, m, 0);
      setStartTime(firstDay.toISOString().slice(0, 10));
      setEndTime(lastDay.toISOString().slice(0, 10));
    } else if (mode === "năm") {
      const y = year;
      setStartTime(new Date(y, 0, 1).toISOString().slice(0, 10));
      setEndTime(new Date(y, 11, 31).toISOString().slice(0, 10));
    }
  }, [mode, month, year]);

  // Step 1: Create Term
  const handleCreateTerm = async () => {
    if (!mode || !startTime || !endTime) {
      setSnackbar({ open: true, message: "Vui lòng nhập đủ thông tin kỳ báo cáo!", severity: "error" });
      return;
    }
    setLoading(true);
    try {
      const payload = {
        mode,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        createdAt: new Date().toISOString(),
      };
      const res = await postTerm(payload);
      setTermID(res?.data?.termID || res?.data?.termId || res?.data?.id || res?.data);
      setStep(1);
      setSnackbar({ open: true, message: "Tạo kỳ báo cáo thành công!", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Tạo kỳ báo cáo thất bại!", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Generate Report
  const handleGenerateReport = async () => {
    if (!classId) {
      setSnackbar({ open: true, message: "Vui lòng chọn lớp!", severity: "error" });
      return;
    }
    setLoading(true);
    try {
      const res = await generateReport(termID, classId);
      setReportContent(res.data);
      setStep(2);
      setSnackbar({ open: true, message: "Tạo báo cáo thành công!", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Tạo báo cáo thất bại!", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Save Report
  const handleSaveReport = async () => {
    if (!teacherId) {
      setSnackbar({ open: true, message: "Vui lòng chọn giáo viên!", severity: "error" });
      return;
    }
    setLoading(true);
    try {
      const lines = reportContent.split('\n').filter(line => line.trim() !== '');
      const title = lines[0] || '';
      const description = lines.slice(1).join('\n');
      const className = CLASS_OPTIONS.find(opt => opt.value === classId)?.label || classId;
      const payload = {
        teacherId,
        title,
        description,
        classId,
        termID,
        teacherName: teacherName || (TEACHER_OPTIONS.find(opt => opt.value === teacherId)?.label || ""),
        className,
        createdAt: new Date().toISOString(),
      };
      await postReport(payload);
      // Save to localStorage
      const newHistory = [payload, ...getReportHistory()];
      saveReportHistory(newHistory);
      setHistory(newHistory);
      setSnackbar({ open: true, message: "Lưu báo cáo thành công!", severity: "success" });
      setStep(0);
      setMode("tháng"); setStartTime(""); setEndTime(""); setTermID(""); setClassId(""); setReportContent(""); setTeacherId(""); setTeacherName("");
    } catch {
      setSnackbar({ open: true, message: "Lưu báo cáo thất bại!", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  // History actions
  const handleDeleteHistory = (idx) => {
    const newHistory = history.filter((_, i) => i !== idx);
    saveReportHistory(newHistory);
    setHistory(newHistory);
    setSnackbar({ open: true, message: "Đã xóa báo cáo khỏi lịch sử!", severity: "info" });
  };
  const handleViewHistory = (report) => setDialog({ open: true, report });

  // Filtered history
  const filteredHistory = filterClass ? history.filter(r => r.classId === filterClass) : history;

  return (
    <Box sx={{p:{xs:1,md:4}, background:'#f7faff', minHeight:'100vh'}}>
      <Paper sx={{maxWidth:900, mx:'auto', p:0, borderRadius:4, boxShadow:3, background:'#fff'}}>
        <Tabs value={tab} onChange={(_,v)=>setTab(v)} variant="fullWidth" sx={{borderBottom:1, borderColor:'#e0e7ef'}}>
          <Tab label={<Box display="flex" alignItems="center" gap={1}><AssignmentIcon/>Tạo báo cáo</Box>} />
          <Tab label={<Box display="flex" alignItems="center" gap={1}><HistoryIcon/>Lịch sử báo cáo</Box>} />
        </Tabs>
        {/* Tab 1: Tạo báo cáo */}
        {tab === 0 && (
          <Box sx={{p:{xs:2,md:4}}}>
            {step === 0 && (
              <>
                <Typography fontWeight={700} fontSize={20} mb={2}>Bước 1: Tạo kỳ báo cáo</Typography>
                <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
                  <Select value={mode} onChange={e=>setMode(e.target.value)} size="small" sx={{minWidth:120}}>{MODES.map(m=>(<MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>))}</Select>
                  {mode === "tháng" && (
                    <>
                      <Select value={month} onChange={e=>setMonth(Number(e.target.value))} size="small" sx={{minWidth:100}}>
                        {[...Array(12)].map((_,i)=>(<MenuItem key={i+1} value={i+1}>Tháng {i+1}</MenuItem>))}
                      </Select>
                      <Select value={year} onChange={e=>setYear(Number(e.target.value))} size="small" sx={{minWidth:100}}>
                        {[...Array(6)].map((_,i)=>{
                          const y = new Date().getFullYear() - 2 + i;
                          return <MenuItem key={y} value={y}>{y}</MenuItem>;
                        })}
                      </Select>
                    </>
                  )}
                  {mode === "năm" && (
                    <Select value={year} onChange={e=>setYear(Number(e.target.value))} size="small" sx={{minWidth:100}}>
                      {[...Array(6)].map((_,i)=>{
                        const y = new Date().getFullYear() - 2 + i;
                        return <MenuItem key={y} value={y}>{y}</MenuItem>;
                      })}
                    </Select>
                  )}
                  {mode === "ngay" && (
                    <>
                      <TextField type="date" label="Bắt đầu" InputLabelProps={{shrink:true}} value={startTime} onChange={e=>setStartTime(e.target.value)} size="small"/>
                      <TextField type="date" label="Kết thúc" InputLabelProps={{shrink:true}} value={endTime} onChange={e=>setEndTime(e.target.value)} size="small"/>
                    </>
                  )}
                  <Button variant="contained" color="primary" onClick={handleCreateTerm} disabled={loading}>{loading ? <CircularProgress size={20}/> : <EventIcon sx={{mr:1}}/>}Tạo kỳ</Button>
                </Box>
              </>
            )}
            {step === 1 && (
              <>
                <Typography fontWeight={700} fontSize={20} mb={2}>Bước 2: Tạo báo cáo (AI)</Typography>
                <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
                  <Select value={classId} onChange={e=>setClassId(e.target.value)} size="small" displayEmpty sx={{minWidth:160}}><MenuItem value="" disabled>Chọn lớp</MenuItem>{CLASS_OPTIONS.map(opt=>(<MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>))}</Select>
                  <Button variant="contained" color="secondary" onClick={handleGenerateReport} disabled={loading}>{loading ? <CircularProgress size={20}/> : <AssignmentIcon sx={{mr:1}}/>}Tạo báo cáo</Button>
                </Box>
                {reportContent && <Box sx={{whiteSpace:'pre-line',background:'#f8fafc',p:2,borderRadius:2,mb:2,fontFamily:'monospace'}}>{reportContent}</Box>}
                {reportContent && <Button variant="contained" color="primary" onClick={()=>setStep(2)}>Tiếp tục lưu báo cáo</Button>}
              </>
            )}
            {step === 2 && (
              <>
                <Typography fontWeight={700} fontSize={20} mb={2}>Bước 3: Lưu báo cáo vào hệ thống</Typography>
                <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
                  <Select value={teacherId} onChange={e=>{setTeacherId(e.target.value);setTeacherName(TEACHER_OPTIONS.find(opt=>opt.value===e.target.value)?.label||"");}} size="small" displayEmpty sx={{minWidth:180}}><MenuItem value="" disabled>Chọn giáo viên</MenuItem>{TEACHER_OPTIONS.map(opt=>(<MenuItem key={opt.value} value={opt.value}>{opt.label} ({opt.value})</MenuItem>))}</Select>
                </Box>
                <Box mb={2}>
                  <Typography fontWeight={600}>Nội dung báo cáo:</Typography>
                  <Box sx={{whiteSpace:'pre-line',background:'#f8fafc',p:2,borderRadius:2,mb:2,fontFamily:'monospace',maxHeight:200,overflowY:'auto'}}>{reportContent}</Box>
                </Box>
                <Button variant="contained" color="success" onClick={handleSaveReport} disabled={loading}>{loading ? <CircularProgress size={20}/> : "Lưu báo cáo"}</Button>
              </>
            )}
          </Box>
        )}
        {/* Tab 2: Lịch sử báo cáo */}
        {tab === 1 && (
          <Box sx={{p:{xs:2,md:4}}}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Select value={filterClass} onChange={e=>setFilterClass(e.target.value)} size="small" sx={{minWidth:120}} displayEmpty><MenuItem value="">Tất cả lớp</MenuItem>{CLASS_OPTIONS.map(opt=>(<MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>))}</Select>
            </Box>
            <Divider sx={{mb:2}}/>
            {filteredHistory.length === 0 ? <Typography color="text.secondary">Chưa có báo cáo nào.</Typography> : (
              <Box sx={{maxHeight:480,overflowY:'auto'}}>
                {filteredHistory.map((r,idx)=>(
                  <Paper key={idx} sx={{p:2,mb:2,borderRadius:3,boxShadow:1,background:'#fff',position:'relative'}}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <SchoolIcon color="primary"/>
                      <Box flex={1}>
                        <Typography fontWeight={700}>{r.title}</Typography>
                        <Typography fontSize={15} color="text.secondary">Lớp: {r.className} ({r.classId})</Typography>
                        <Typography fontSize={14} color="text.secondary">Giáo viên: {r.teacherName} ({r.teacherId})</Typography>
                        <Typography fontSize={13} color="text.secondary">Kỳ: {r.termID}</Typography>
                        <Typography fontSize={13} color="text.secondary">Ngày tạo: {new Date(r.createdAt).toLocaleString()}</Typography>
                      </Box>
                      <Button color="info" onClick={()=>handleViewHistory(r)}><VisibilityIcon/></Button>
                      <Button color="error" onClick={()=>handleDeleteHistory(idx)}><DeleteIcon/></Button>
                    </Box>
                  </Paper>
                ))}
              </Box>
            )}
          </Box>
        )}
      </Paper>
      {/* View Report Dialog */}
      <Dialog open={dialog.open} onClose={()=>setDialog({open:false,report:null})} maxWidth="sm" fullWidth>
        <DialogTitle>Chi tiết báo cáo</DialogTitle>
        <DialogContent>
          {dialog.report && (
            <Box>
              <Typography fontWeight={700} mb={1}>{dialog.report.title}</Typography>
              <Typography fontSize={15} color="text.secondary">Lớp: {dialog.report.className} ({dialog.report.classId})</Typography>
              <Typography fontSize={14} color="text.secondary">Giáo viên: {dialog.report.teacherName} ({dialog.report.teacherId})</Typography>
              <Typography fontSize={13} color="text.secondary">Kỳ: {dialog.report.termID}</Typography>
              <Typography fontSize={13} color="text.secondary">Ngày tạo: {new Date(dialog.report.createdAt).toLocaleString()}</Typography>
              <Divider sx={{my:2}}/>
              <Typography fontWeight={600}>Nội dung báo cáo:</Typography>
              <Box sx={{whiteSpace:'pre-line',background:'#f8fafc',p:2,borderRadius:2,mb:2,fontFamily:'monospace',maxHeight:320,overflowY:'auto'}}>{dialog.report.description}</Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setDialog({open:false,report:null})}>Đóng</Button>
        </DialogActions>
      </Dialog>
      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={()=>setSnackbar(s=>({...s,open:false}))} anchorOrigin={{vertical:'top',horizontal:'center'}}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
