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

const postRegister = async (
  firstName,
  lastName,
  email,
  password,
  passwordConfirm,
  gender
) => {
  return axios.post(
    `https://localhost:7096/parent/registerUser`,
    {
      firstName,
      lastName,
      email,
      password,
      passwordConfirm,
      gender,
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

const getClassesByTeacherId = async (teacherId, token) => {
  return axios.get(`${BASE_URL}/Classroom/teacher/${teacherId}`, {
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
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

// ------------------ COURSE & ATTENDANCE ------------------
const postCourse = async (courseData, token) => {
  return axios.post(`${BASE_URL}/Course`, courseData, {
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

const postAttendance = async (attendanceData, token) => {
  return axios.post(`${BASE_URL}/Attendance`, attendanceData, {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
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

// ------------------ REPORT ------------------
const postReport = async (reportData, token) => {
  return axios.post(`${BASE_URL}/Report`, reportData, {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

// ------------------ EXPORT ------------------
export {
  postSignin,
  postRegister,
  forgetPassword,
  resetPassword,
  getAllAdminUsers,
  putChangeUserRole,
  putUpdateTeacher,
  deleteTeacher,
  getTeacherDetail,
  getTeacherCourses,
  postReport,
  updateParentProfile,
  getParentProfile,
  getToken,
  getClassesByTeacherId,
  postCourse,
  postAttendance,
  getSlots,
  getAttendanceByCourse,
  getStudentByParentEmail,
  getStudentSchedule,
};
