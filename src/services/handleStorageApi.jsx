export const setUserName = (name) => {
  localStorage.setItem("username", name);
};

export const getUserName = () => {
  return localStorage.getItem("username");
};

export const logoutUser = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userInfo");
  localStorage.removeItem("teacherId");
  localStorage.removeItem("teacherInfo");
};

export const setUserInfo = (userId, role, fullName, email, token) => {
  localStorage.setItem(
    "userInfo",
    JSON.stringify({ userId, role, fullName, email, token })
  );
};

export const getUserInfo = () => {
  const info = localStorage.getItem("userInfo");
  return info ? JSON.parse(info) : null;
};
