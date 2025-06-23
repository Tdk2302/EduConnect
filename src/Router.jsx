// import ForgetPassword from "@/pages/Customer/Auth/2FA/forgetPassword"
// import ResetPassword from "@/pages/Customer/Auth/2FA/resetPassword"
import { Route, Routes, Navigate } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Register from "./pages/Parents/Auth/Register/Register";
import Signin from "./pages/Parents/Auth/Signin/Singin";
import Dashboard from "./component/Dashboard";
import Homepage from "./pages/Parents/Auth/Teacher/Homepage";
import ProfileUser from "./component/ProfileUser";

const Router = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/profile" element={<ProfileUser />} />
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
