import axios from "axios";

// const BASE_URL = "https://swd-backend-web.onrender.com/api";
const BASE_URL = "https://localhost:7064/api";

// ------------------ AUTH ------------------
const postSignin = async (email, password) => {
  return axios.post(
    `${BASE_URL}/Auth/login`,
    { email, password },
    { withCredentials: true }
  );
};

const postGoogleLogin = async (credential) => {
  return axios.post(`${BASE_URL}/Auth/login-google`, { IdToken: credential });
};

const postRegister = async (
  firstName,
  lastName,
  email,
  password,
  studentId
) => {
  return axios.post(
    `${BASE_URL}/Auth/Register`,
    {
      firstName,
      lastName,
      email,
      password,
      studentId,
    },
    { withCredentials: true }
  );
};

const forgetPassword = async (email) => {
  return axios.post(
    `${BASE_URL}/Auth/forgot-password`,
    { email },
    { withCredentials: true }
  );
};

const resetPassword = async ({ email, token, newPassword }) => {
  return axios.post(
    `${BASE_URL}/Auth/reset-password`,
    {
      email,
      token,
      newPassword,
    },
    { withCredentials: true }
  );
};

// ------------------ TOKEN ------------------
const getToken = () => {
  const info = localStorage.getItem("userInfo");
  if (!info) return null;
  try {
    const parsed = JSON.parse(info);
    return parsed.token || null;
  } catch {
    return null;
  }
};

// Giải mã JWT token, trả về payload (object) hoặc null nếu lỗi
const decodeToken = (token) => {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

// ------------------ ADMIN ------------------
const getAllAdminUsers = async (token) => {
  if (!token) token = getToken();
  return axios.get(`${BASE_URL}/Admin/User`, {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

const putChangeUserRole = async (email, role, token) => {
  if (!token) token = getToken();
  return axios.put(
    `${BASE_URL}/Admin/users/role`,
    { email, role },
    {
      withCredentials: true,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
};

// ------------------ TEACHER ------------------
const putUpdateTeacher = async (userId, subjectId, status, token) => {
  if (!token) token = getToken();
  return axios.put(
    `${BASE_URL}/Teacher/${userId}`,
    { subjectId, status },
    {
      withCredentials: true,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
};

const deleteTeacher = async (userId, token) => {
  if (!token) token = getToken();
  return axios.delete(`${BASE_URL}/Teacher/${userId}`, {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

const getTeacherDetail = async (userId, token) => {
  if (!token) token = getToken();
  return axios.get(`${BASE_URL}/Teacher/${userId}`, {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

const getTeacherCourses = async (teacherId, token) => {
  if (!token) token = getToken();
  return axios.get(`${BASE_URL}/Course/teacher/${teacherId}`, {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

// ------------------ PARENT ------------------

const updateParentProfile = async (formData, token) => {
  if (!token) token = getToken();
  return axios.put(`${BASE_URL}/Parent/profile`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
};

const getStudentByParentEmail = async (token, email) => {
  if (!token) token = getToken();
  return axios.get(`${BASE_URL}/Parent/students?email=${email}`, {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

const getParentProfile = async (token) => {
  if (!token) token = getToken();
  return axios.get(`${BASE_URL}/Parent/profile`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    withCredentials: true,
  });
};

// ------------------ COURSE & ATTENDANCE ------------------
const postCourse = async (courseData, token) => {
  if (!token) token = getToken();
  return axios.post(`${BASE_URL}/Course`, courseData, {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

const postAttendance = async (attendanceData, token) => {
  if (!token) token = getToken();
  return axios.post(`${BASE_URL}/Attendance`, attendanceData, {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

const getStudentSchedule = async (classId, token) => {
  if (!token) token = getToken();
  return axios.get(`${BASE_URL}/Course/class/${classId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    withCredentials: true,
  });
};


// ------------------ SLOT ------------------
const getSlots = async (token) => {
  if (!token) token = getToken();
  return axios.get(`${BASE_URL}/Slot/all`, {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

// ------------------ ATTENDANCE STATISTICS ------------------
const getAttendanceByCourse = async (courseId, token) => {
  if (!token) token = getToken();
  return axios.get(`${BASE_URL}/Attendance/course/${courseId}`, {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

const updateAttendance = async (attendanceData, token) => {
  if (!token) token = getToken();
  return axios.put(`${BASE_URL}/Attendance`, attendanceData, {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

const postScore = async (scoreData, token) => {
  if (!token) token = getToken();
  return axios.post(`${BASE_URL}/Score`, scoreData, {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

const getScoresByCourse = async (courseId, token) => {
  if (!token) token = getToken();
  return axios.get(`${BASE_URL}/Score/course/${courseId}`, {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

const updateScore = async (scoreData, token) => {
  if (!token) token = getToken();
  return axios.put(`${BASE_URL}/Score`, scoreData, {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

// ------------------ REPORT ------------------
const postReport = async (reportData, token) => {
  if (!token) token = getToken();
  return axios.post(`${BASE_URL}/Report`, reportData, {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

const getReport = async (classId, token) => {
  if (!token) token = getToken();
  return axios.get(`${BASE_URL}/Report`, {
    params: { classId },
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

const getReportDetail = async (classId, token) => {
  if (!token) token = getToken();
  return axios.get(`${BASE_URL}/Report`, {
    params: { classId },
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

// ------------------ TERM ------------------
const postTerm = async (termData, token) => {
  if (!token) token = getToken();
  return axios.post(`${BASE_URL}/Term`, termData, {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

const getTermByTermID = async (termID, token) => {
  if (!token) token = getToken();
  return (
    axios.get(`${BASE_URL}/Term/${termID}`),
    {
      method: "GET",

      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
};

// ------------------ TEACHER SUBJECT MAPPING ------------------
const getTeacherSubject = (teacherId) => {
  const subjectMap = {
    T001: { name: "Toán", code: "SUB001" },
    T002: { name: "Văn", code: "SUB002" },
    T003: { name: "Tiếng Anh", code: "SUB003" },
    T004: { name: "Lý", code: "SUB004" },
    T005: { name: "Hóa", code: "SUB005" },
  };
  return subjectMap[teacherId] || { name: "Toán", code: "SUB001" };
};

// ------------------ CHATBOT ------------------
const postChatBotAsk = async (parentId, messageText, token) => {
  if (!token) token = getToken();
  return axios.post(
    `${BASE_URL}/ChatBotLog/ask`,
    { parentId, messageText },
    {
      withCredentials: true,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
};
// ------------------ CHATBOT ------------------

// ------------------ EXPORT ------------------
const generateReport = async (termId, classId, token) => {
  if (!token) token = getToken();
  return axios.post(
    `${BASE_URL}/Report/generate`,
    { termId, classId },
    {
      withCredentials: true,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
};

// ------------------ COURSE STATUS ------------------
const updateCourseStatus = async (courseId, status, token) => {
  if (!token) token = getToken();
  return axios.put(
    `${BASE_URL}/Course/status`,
    { courseId, status },
    {
      withCredentials: true,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
};

export {
  postSignin,
  postGoogleLogin,
  postRegister,
  forgetPassword,
  resetPassword,
  getAllAdminUsers,
  putChangeUserRole,
  putUpdateTeacher,
  deleteTeacher,
  getTeacherDetail,
  getTeacherCourses,
  getReport,
  updateParentProfile,
  getParentProfile,
  getStudentSchedule,
  getToken,
  decodeToken,
  postCourse,
  postAttendance,
  getSlots,
  getAttendanceByCourse,
  updateAttendance,
  postScore,
  getScoresByCourse,
  updateScore,
  postReport,
  postTerm,
  getTermByTermID,
  getTeacherSubject,
  getStudentByParentEmail,
  postChatBotAsk,
  generateReport,
  updateCourseStatus,
};
