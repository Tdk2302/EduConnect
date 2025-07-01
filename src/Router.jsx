import { Route, Routes, Navigate } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Register from "./component/Register/Register";

import Signin from "./component/Signin/Singin";
import Dashboard from "./pages/Admin/Dashboard";
import TeacherMainLayout from "./pages/Teachers/Layout/TeacherMainLayout";
import Homepage from "./pages/Parents/HomePage/Homepage";
import ProfileUser from "./component/ProfileUser";
import ChatBotPage from "./pages/Parents/ChatBot/ChatBotPage";
import ParentNotifications from "./pages/Parents/Notification/Notification";
import TeacherNotifications from "./pages/Teachers/Notification/NotificationBox";
import StudentSchedule from "./pages/Parents/Schedule/StudentSchedule";
import TeacherSchedule from "./pages/Teachers/Schedule/TeacherSchedule";

const Router = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/homepage" replace />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/teacher" element={<TeacherMainLayout />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/profile" element={<ProfileUser />} />
        <Route path="/chatbot" element={<ChatBotPage />} />
        <Route path="/notifications" element={<ParentNotifications />} />
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
