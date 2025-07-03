export const setUserName = (name) => {
  localStorage.setItem("username", name);
};

export const getUserName = () => {
  return localStorage.getItem("username");
};

export const logoutUser = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userInfo");
};

export const setUserInfo = (role, fullName, email, userId) => {
  localStorage.setItem(
    "userInfo",
    JSON.stringify({ role, fullName, email, userId })
  );
};

export const getUserInfo = () => {
  const info = localStorage.getItem("userInfo");
  return info ? JSON.parse(info) : null;
};
