import React, { useState } from "react";
import { postTerm, postReport, getToken } from "../../../services/apiServices";
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

const steps = ["Tạo kỳ báo cáo", "Tạo báo cáo"];

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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [classId, setClassId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [className, setClassName] = useState("");
  const [creatingReport, setCreatingReport] = useState(false);
  const [reportError, setReportError] = useState("");
  const [reportSuccess, setReportSuccess] = useState("");

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
      const token = getToken && getToken();
      const res = await postTerm(payload, token);
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
    if (
      !title ||
      !description ||
      !classId ||
      !teacherId ||
      !teacherName ||
      !className
    ) {
      setReportError("Vui lòng nhập đầy đủ thông tin báo cáo.");
      return;
    }
    setCreatingReport(true);
    try {
      const payload = {
        teacherId,
        title,
        description,
        classId,
        termID,
        teacherName,
        className,
      };
      const token = getToken && getToken();
      await postReport(payload, token);
      setReportSuccess("Tạo báo cáo thành công!");
      setTimeout(() => {
        setActiveStep(0);
        setTitle("");
        setDescription("");
        setClassId("");
        setTeacherId("");
        setTeacherName("");
        setClassName("");
        setTermID("");
        setReportSuccess("");
      }, 1200);
    } catch (err) {
      setReportError("Tạo báo cáo thất bại!");
    } finally {
      setCreatingReport(false);
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
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tiêu đề báo cáo"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Mô tả báo cáo"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    multiline
                    minRows={3}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Mã lớp"
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Tên lớp"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Mã giáo viên"
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Tên giáo viên"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Kỳ báo cáo (termID)"
                    value={termID}
                    disabled
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} display="flex" gap={2}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleBack}
                    disabled={creatingReport}
                  >
                    Quay lại
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    size="large"
                    startIcon={
                      creatingReport ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <AssignmentIcon />
                      )
                    }
                    disabled={creatingReport}
                  >
                    {creatingReport ? "Đang tạo..." : "Hoàn thành"}
                  </Button>
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
                </Grid>
              </Grid>
            </form>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default ReportCreate;
