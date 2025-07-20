import axios from "axios";

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
  console.log(credential);
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

// ------------------ ADMIN ------------------
const getAllAdminUsers = async (token) => {
  return axios.get(`${BASE_URL}/Admin/User`, {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

const putChangeUserRole = async (email, role, token) => {
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
  return axios.delete(`${BASE_URL}/Teacher/${userId}`, {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

const getTeacherDetail = async (userId, token) => {
  return axios.get(`${BASE_URL}/Teacher/${userId}`, {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

const getTeacherCourses = async (teacherId, token) => {
  return axios.get(`${BASE_URL}/Course/teacher/${teacherId}`, {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

// ------------------ PARENT ------------------

const updateParentProfile = async (formData, token) => {
  return axios.put(`${BASE_URL}/Parent/profile`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
};

const getStudentByParentEmail = async (token, email) => {
  return axios.get(`${BASE_URL}/Parent/students?email=${email}`, {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

const getParentProfile = async (token) => {
  return axios.get(`${BASE_URL}/Parent/profile`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    withCredentials: true,
  });
};

// ------------------ COURSE & ATTENDANCE ------------------
const postCourse = async (courseData, token) => {
  return axios.post(`${BASE_URL}/Course`, courseData, {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

const postAttendance = async (attendanceData, token) => {
  return axios.post(`${BASE_URL}/Attendance`, attendanceData, {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

const getStudentSchedule = async (classId, token) => {
  return axios.get(`${BASE_URL}/Course/class/${classId}`, {
    method: "GET",
    headers: {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true,
    },
  });
};

// ------------------ SLOT ------------------
const getSlots = async (token) => {
  return axios.get(`${BASE_URL}/Slot/all`, {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

// ------------------ ATTENDANCE STATISTICS ------------------
const getAttendanceByCourse = async (courseId, token) => {
  return axios.get(`${BASE_URL}/Attendance/course/${courseId}`, {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

const updateAttendance = async (attendanceData, token) => {
  return axios.put(`${BASE_URL}/Attendance`, attendanceData, {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

const postScore = async (scoreData, token) => {
  return axios.post(`${BASE_URL}/Score`, scoreData, {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

const getScoresByCourse = async (courseId, token) => {
  return axios.get(`${BASE_URL}/Score/course/${courseId}`, {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

const updateScore = async (scoreData, token) => {
  return axios.put(`${BASE_URL}/Score`, scoreData, {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

// ------------------ REPORT ------------------
const postReport = async (reportData, token) => {
  return axios.post(`${BASE_URL}/Report`, reportData, {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

const getReport = async (classId, token) => {
  return axios.get(`${BASE_URL}/Report`, {
    params: { classId },
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

const getReportDetail = async (classId, token) => {
  return axios.get(`${BASE_URL}/Report`, {
    params: { classId },
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

// ------------------ TERM ------------------
const postTerm = async (termData, token) => {
  return axios.post(`${BASE_URL}/Term`, termData, {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
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
const postChatBotAsk = async (parentId, messageText) => {
  return axios.post(`${BASE_URL}/ChatBotLog/ask`, { parentId, messageText });
};

// ------------------ EXPORT ------------------
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
  getTeacherSubject,
  getStudentByParentEmail,
  postChatBotAsk,
};
