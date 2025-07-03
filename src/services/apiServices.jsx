import axios from "axios";

const BASE_URL = "https://localhost:7064/api";

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

// Thêm hàm lấy danh sách user cho admin
const getAllAdminUsers = async () => {
  return axios.get(`${BASE_URL}/Admin/User`, { withCredentials: true });
};

const updateParentProfile = async (formData) => {
  return axios.put(`${BASE_URL}/Parent/profile`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });
};

const getParentProfile = async () => {
  return axios.get(`${BASE_URL}/Parent/profile`, { withCredentials: true });
};

export {
  postSignin,
  postRegister,
  forgetPassword,
  resetPassword,
  getAllAdminUsers,
  updateParentProfile,
  getParentProfile,
};
