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
export const putUpdateTeacher = async (userId, subjectId, status, token) => {
  return axios.put(
    `${BASE_URL}/Teacher/${userId}`,
    { subjectId, status },
    {
      withCredentials: true,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
};

export const deleteTeacher = async (userId, token) => {
  return axios.delete(`${BASE_URL}/Teacher/${userId}`, {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

export const getTeacherDetail = async (userId, token) => {
  return axios.get(`${BASE_URL}/Teacher/${userId}`, {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

export const getTeacherCourses = async (teacherId, token) => {
  return axios.get(`${BASE_URL}/Course/teacher/${teacherId}`, {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

// ------------------ PARENT ------------------
const updateParentProfile = async (formData) => {
  return axios.put(`${BASE_URL}/Parent/profile`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });
};

const getParentProfile = async () => {
  return axios.get(`${BASE_URL}/Parent/profile`, { withCredentials: true });
};

// ------------------ REPORT ------------------
const postReport = async (formData) => {
  return axios.post(`${BASE_URL}/Report`, formData, { withCredentials: true });
};

// ------------------ EXPORT ------------------
export {
  postSignin,
  postRegister,
  forgetPassword,
  resetPassword,
  getAllAdminUsers,
  putChangeUserRole,
  updateParentProfile,
  getParentProfile,
  getToken,
  postReport,
};
