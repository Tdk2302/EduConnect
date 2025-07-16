import { Route, Routes, Navigate } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Register from "./component/Register/Register";
import Signin from "./component/Signin/Singin";
import TeacherMainLayout from "./pages/Teachers/Layout/TeacherMainLayout";
import Homepage from "./pages/Parents/HomePage/Homepage";
import ProfileUser from "./component/ProfileUser";
import ChatBotPage from "./pages/Parents/ChatBot/ChatBox";
import ParentNotifications from "./pages/Parents/Notification/Notification";
import { GoogleOAuthProvider } from "@react-oauth/google";
import StudentSchedule from "./pages/Parents/Schedule/StudentSchedule";
import TeacherSchedule from "./pages/Teachers/Schedule/TeacherSchedule";
import AdminMainLayout from "./pages/Admin/AdminMainLayout";
import TeacherScheduleCreate from "./pages/Admin/TeacherScheduleCreate";
import TeacherCourseCreate from "./pages/Admin/TeacherCourseCreate";
import TeacherAttendanceCreate from "./pages/Admin/TeacherAttendanceCreate";
import { getUserInfo } from "./services/handleStorageApi";
import ManageUser from "./pages/Admin/ManageUser";
import AdminSettings from "./pages/Admin/AdminSettings";

function ProtectedRoute({ allowedRoles, children }) {
  const user = getUserInfo();
  if (!user) return <Navigate to="/signin" replace />;
  if (!allowedRoles.includes(user.role)) {
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
      <GoogleOAuthProvider clientId="846378431742-59jfr2idp9l6tfmt6kf1j2kumpka4vut.apps.googleusercontent.com">
        {" "}
        <Routes>
          <Route path="/" element={<Navigate to="/homepage" replace />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/parent-notifications"
            element={
              <ProtectedRoute allowedRoles={["Parent"]}>
                <ParentNotifications />
              </ProtectedRoute>
            }
          />
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

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <AdminMainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="manage-user" element={<ManageUser />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="create-course" element={<TeacherCourseCreate />} />
            <Route
              path="create-attendance/:courseId"
              element={<TeacherAttendanceCreate />}
            />
          </Route>
          <Route path="/student-schedule" element={<StudentSchedule />} />
          <Route path="/teacher-schedule" element={<TeacherSchedule />} />
          <Route
            path="/admin/create-schedule"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <TeacherScheduleCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/create-course"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <AdminMainLayout>
                  <TeacherCourseCreate />
                </AdminMainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/create-attendance/:courseId"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <AdminMainLayout>
                  <TeacherAttendanceCreate />
                </AdminMainLayout>
              </ProtectedRoute>
            }
          />

          {/* <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} /> */}
        </Routes>
      </GoogleOAuthProvider>

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
