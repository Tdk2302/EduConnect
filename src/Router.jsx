
// import ForgetPassword from "@/pages/Customer/Auth/2FA/forgetPassword"
// import ResetPassword from "@/pages/Customer/Auth/2FA/resetPassword"
import { Route, Routes } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Register from "./pages/Parents/Auth/Register/index";
import Signin from "./pages/Parents/Auth/Signin/index";
import Dashboard from "./component/dashboard"

const Router = () => {
  return (
    <>
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/register" element={<Register />} />
        <Route path= "/" element={<Dashboard />} />
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
