import React, { useState } from "react";
import { postTerm, getToken, generateReport, postReport } from "../../../services/apiServices";
import { getUserInfo } from "../../../services/handleStorageApi";
import {
  Paper,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Divider,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EventIcon from "@mui/icons-material/Event";
import SchoolIcon from "@mui/icons-material/School";

const MODES = [
  { value: "tháng", label: "Tháng" },
  { value: "năm", label: "Năm" },
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

const steps = ["Tạo kỳ báo cáo", "Tạo báo cáo (AI)", "Lưu báo cáo vào hệ thống"];

const ReportCreate = () => {
  // Stepper state
  const [activeStep, setActiveStep] = useState(0);

  // Step 1: Create Term
  const [mode, setMode] = useState("tháng");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [creatingTerm, setCreatingTerm] = useState(false);
  const [termID, setTermID] = useState("");
  const [termError, setTermError] = useState("");
  const [termSuccess, setTermSuccess] = useState("");

  // Step 2: Create Report
  const [classId, setClassId] = useState("");
  const [creatingReport, setCreatingReport] = useState(false);
  const [reportError, setReportError] = useState("");
  const [reportSuccess, setReportSuccess] = useState("");
  const [reportContent, setReportContent] = useState("");

  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");
  const [manualTeacherId, setManualTeacherId] = useState("");
  const [manualTeacherName, setManualTeacherName] = useState("");

  // Parse title/description từ reportContent
  const lines = reportContent.split('\n').filter(line => line.trim() !== '');
  const title = lines[0] || '';
  const description = lines.slice(1).join('\n');
  const userInfo = getUserInfo();
  const teacherId = manualTeacherId;
  const teacherName = manualTeacherName || (TEACHER_OPTIONS.find(opt => opt.value === manualTeacherId)?.label || '');
  const className = CLASS_OPTIONS.find(opt => opt.value === classId)?.label || classId;

  const handleCreateTerm = async (e) => {
    e.preventDefault();
    setTermError("");
    setTermSuccess("");
    if (!mode || !startTime || !endTime) {
      setTermError("Vui lòng nhập đầy đủ thông tin kỳ báo cáo.");
      return;
    }
    setCreatingTerm(true);
    try {
      const payload = {
        mode,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        createdAt: new Date().toISOString(),
      };
      const res = await postTerm(payload); // không cần truyền token
      const newTermID =
        res?.data?.termID || res?.data?.termId || res?.data?.id || res?.data;
      setTermID(newTermID);
      setTermSuccess("Tạo kỳ báo cáo thành công!");
      setTimeout(() => {
        setActiveStep(1);
        setTermSuccess("");
      }, 800);
    } catch (err) {
      setTermError("Tạo kỳ báo cáo thất bại!");
    } finally {
      setCreatingTerm(false);
    }
  };

  const handleCreateReport = async (e) => {
    e.preventDefault();
    setReportError("");
    setReportSuccess("");
    setReportContent("");
    if (!classId) {
      setReportError("Vui lòng chọn lớp để tạo báo cáo.");
      return;
    }
    setCreatingReport(true);
    try {
      const res = await generateReport(termID, classId);
      setReportSuccess("Tạo báo cáo thành công!");
      setReportContent(res.data); // Lưu nội dung trả về
      // Không tự động quay lại step 1 nữa
      // setTimeout(() => {
      //   setActiveStep(0);
      //   setClassId("");
      //   setTermID("");
      //   setReportSuccess("");
      // }, 1200);
    } catch (err) {
      setReportError("Tạo báo cáo thất bại!");
    } finally {
      setCreatingReport(false);
    }
  };

  // Bước 3: Lưu báo cáo vào hệ thống
  const handleSaveReport = async () => {
    setSaveError("");
    setSaveSuccess("");
    setSaveLoading(true);
    if (!teacherId) {
      setSaveError("Vui lòng nhập mã giáo viên (teacherId)!");
      setSaveLoading(false);
      return;
    }
    try {
      await postReport({
        teacherId,
        title,
        description,
        classId,
        termID,
        teacherName,
        className,
      });
      setSaveSuccess("Lưu báo cáo vào hệ thống thành công!");
    } catch (err) {
      setSaveError("Lưu báo cáo thất bại!");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, mb: 4 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label, idx) => (
            <Step key={label} completed={activeStep > idx}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {activeStep === 0 && (
          <>
            <Box display="flex" alignItems="center" mb={2} gap={1}>
              <AssignmentIcon color="primary" fontSize="large" />
              <Typography variant="h5" fontWeight={700} color="primary.main">
                Tạo kỳ báo cáo
              </Typography>
            </Box>
            <form onSubmit={handleCreateTerm} autoComplete="off">
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Select
                    fullWidth
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                    label="Chế độ báo cáo"
                    variant="outlined"
                    size="small"
                    sx={{ mb: 1 }}
                  >
                    {MODES.map((m) => (
                      <MenuItem key={m.value} value={m.value}>
                        {m.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Thời gian bắt đầu"
                    InputLabelProps={{ shrink: true }}
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Thời gian kết thúc"
                    InputLabelProps={{ shrink: true }}
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    startIcon={
                      creatingTerm ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <EventIcon />
                      )
                    }
                    disabled={creatingTerm}
                    sx={{ mt: { xs: 1, sm: 0 } }}
                  >
                    {creatingTerm ? "Đang tạo..." : "Tiếp tục"}
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  {termError && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      {termError}
                    </Alert>
                  )}
                  {termSuccess && (
                    <Alert severity="success" sx={{ mt: 1 }}>
                      {termSuccess}
                    </Alert>
                  )}
                </Grid>
              </Grid>
            </form>
          </>
        )}
        {activeStep === 1 && (
          <>
            <Box display="flex" alignItems="center" mb={2} gap={1}>
              <SchoolIcon color="secondary" fontSize="large" />
              <Typography variant="h5" fontWeight={700} color="secondary.main">
                Tạo báo cáo
              </Typography>
            </Box>
            <form onSubmit={handleCreateReport} autoComplete="off">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                  <Select
                    fullWidth
                    value={classId}
                    onChange={e => setClassId(e.target.value)}
                    displayEmpty
                    size="small"
                  >
                    <MenuItem value="" disabled>Chọn lớp</MenuItem>
                    {CLASS_OPTIONS.map(opt => (
                      <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={12} display="flex" gap={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    size="large"
                    startIcon={creatingReport ? (<CircularProgress size={20} color="inherit" />) : (<AssignmentIcon />)}
                    disabled={creatingReport}
                  >
                    {creatingReport ? "Đang tạo..." : "Hoàn thành"}
                  </Button>
                  {reportSuccess && (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleBack}
                      sx={{ ml: 2 }}
                    >
                      Quay lại bước tạo kỳ báo cáo
                    </Button>
                  )}
                </Grid>
                <Grid item xs={12}>
                  {reportError && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      {reportError}
                    </Alert>
                  )}
                  {reportSuccess && (
                    <Alert severity="success" sx={{ mt: 1 }}>
                      {reportSuccess}
                    </Alert>
                  )}
                  {reportContent && (
                    <Box sx={{ mt: 2, whiteSpace: "pre-line", fontFamily: "monospace", background: "#f8f8f8", p: 2, borderRadius: 2 }}>
                      {reportContent}
                    </Box>
                  )}
                </Grid>
              </Grid>
            </form>
            {/* Nếu đã có reportContent, cho phép sang bước 3 */}
            {reportContent && (
              <Box sx={{ mt: 2, textAlign: 'right' }}>
                <Button variant="contained" color="primary" onClick={() => setActiveStep(2)}>
                  Tiếp tục lưu báo cáo
                </Button>
              </Box>
            )}
          </>
        )}
        {activeStep === 2 && (
          <>
            <Box display="flex" alignItems="center" mb={2} gap={1}>
              <AssignmentIcon color="primary" fontSize="large" />
              <Typography variant="h5" fontWeight={700} color="primary.main">
                Lưu báo cáo vào hệ thống
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1"><b>Tiêu đề:</b> {title}</Typography>
              <Typography variant="subtitle1"><b>Lớp:</b> {className} ({classId})</Typography>
              <Box display="flex" alignItems="center" gap={2} mb={1}>
                <Select
                  label="Mã giáo viên (teacherId)"
                  value={manualTeacherId}
                  onChange={e => {
                    setManualTeacherId(e.target.value);
                    setManualTeacherName(TEACHER_OPTIONS.find(opt => opt.value === e.target.value)?.label || "");
                  }}
                  displayEmpty
                  size="small"
                  sx={{ minWidth: 180 }}
                >
                  <MenuItem value="" disabled>Chọn giáo viên</MenuItem>
                  {TEACHER_OPTIONS.map(opt => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label} ({opt.value})</MenuItem>
                  ))}
                </Select>
                <Typography variant="subtitle1"><b>Giáo viên:</b> {teacherName}</Typography>
              </Box>
              <Typography variant="subtitle1"><b>Kỳ báo cáo (termID):</b> {termID}</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1"><b>Nội dung báo cáo:</b></Typography>
              <Box sx={{ whiteSpace: "pre-line", fontFamily: "monospace", background: "#f8f8f8", p: 2, borderRadius: 2, mb: 2, maxHeight: 320, overflowY: "auto" }}>
                {description}
              </Box>
            </Box>
            <Box display="flex" gap={2}>
              <Button variant="outlined" color="primary" onClick={() => setActiveStep(1)} disabled={saveLoading}>
                Quay lại
              </Button>
              <Button variant="contained" color="secondary" onClick={handleSaveReport} disabled={saveLoading}>
                {saveLoading ? <CircularProgress size={20} color="inherit" /> : "Lưu báo cáo"}
              </Button>
            </Box>
            {saveError && <Alert severity="error" sx={{ mt: 2 }}>{saveError}</Alert>}
            {saveSuccess && <Alert severity="success" sx={{ mt: 2 }}>{saveSuccess}</Alert>}
          </>
        )}
      </Paper>
    </Box>
  );
};

export default ReportCreate;
