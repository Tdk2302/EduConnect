import { Route, Routes, Navigate } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Register from "./component/Register/Register";
import Signin from "./component/Signin/Singin";
import TeacherMainLayout from "./pages/Teachers/Layout/TeacherMainLayout";
import Homepage from "./pages/Parents/HomePage/Homepage";
import ProfileUser from "./component/ProfileUser";
import ChatBotPage from "./pages/Parents/ChatBot/ChatBotPage";
import ParentNotifications from "./pages/Parents/Notification/Notification";
import TeacherNotifications from "./pages/Teachers/Notification/NotificationBox";
import StudentSchedule from "./pages/Parents/Schedule/StudentSchedule";
import TeacherSchedule from "./pages/Teachers/Schedule/TeacherSchedule";
import AdminMainLayout from "./pages/Admin/AdminMainLayout";
import { getUserInfo } from "./services/handleStorageApi";

// ProtectedRoute component
function ProtectedRoute({ allowedRoles, children }) {
  const user = getUserInfo();
  if (!user) return <Navigate to="/signin" replace />;
  if (!allowedRoles.includes(user.role)) {
    // Nếu đã đăng nhập nhưng không đúng role, về đúng trang role của mình
    if (user.role === "Admin") return <Navigate to="/admin" replace />;
    if (user.role === "Teacher") return <Navigate to="/teacher" replace />;
    if (user.role === "Parent") return <Navigate to="/homepage" replace />;
    return <Navigate to="/signin" replace />;
  }
  return children;
}

const Router = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/homepage" replace />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={["Teacher"]}>
              <TeacherMainLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/homepage"
          element={
            <ProtectedRoute allowedRoles={["Parent"]}>
              <Homepage />
            </ProtectedRoute>
          }
        />
        <Route path="/profile" element={<ProfileUser />} />
        <Route path="/chatbot" element={<ChatBotPage />} />
        <Route path="/notifications" element={<ParentNotifications />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminMainLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher-notifications"
          element={<TeacherNotifications />}
        />
        <Route path="/student-schedule" element={<StudentSchedule />} />
        <Route path="/teacher-schedule" element={<TeacherSchedule />} />

        {/* <Route path="/forget-password" element={<ForgetPassword/>} />
        <Route path="/reset-password" element={<ResetPassword/>} />        */}
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </>
  );
};

export default Router;
