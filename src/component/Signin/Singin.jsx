import React, { useState } from "react";
import { Form, Input, Button, Typography, Divider } from "antd";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { setUserInfo } from "../../services/handleStorageApi";
import { postSignin } from "../../services/apiServices";
import "./Signin.css";
import "antd/dist/reset.css";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

const { Title, Text, Link } = Typography;

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignin = async (values) => {
    const { email, password } = values;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Invalid email!");
      return;
    }

    if (
      !password ||
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      toast.error(
        "Password must be at least 8 characters long, include a number and an uppercase letter!"
      );
      return;
    }

    try {
      const response = await postSignin(email, password, true);
      if (response.status === 200) {
        toast.success("Đăng nhập thành công!");
        setUserInfo(
          response.data.userId,
          response.data.role,
          response.data.fullName,
          response.data.email,
          response.data.token
        );
        let role = response.data.role;
        console.log(role);
        if (role === "Admin") {
          navigate("/admin");
        } else if (role === "Parent") {
          navigate("/homepage");
        } else if (role === "Teacher") {
          navigate("/teacher");
          axios
            .get(`https://localhost:7064/api/Teacher/${response.data.userId}`)
            .then((res) => {
              const teacherId = res.data.teacherId || res.data.id;
              if (teacherId) {
                localStorage.setItem("teacherId", teacherId);
              }
            })
            .catch((err) => {
              console.error("Lỗi lấy teacherId:", err);
            });
          navigate("/teacher");
        } else {
          navigate("/homepage");
        }
      } else {
        toast.error(response?.message || "Đăng nhập thất bại!");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Đăng nhập thất bại!");
    }
  };

  return (
    <div className="signin-bg">
      <div className="signin-card">
        <Title level={2} className="signin-title">
          EduConnect
        </Title>
        <Text className="signin-welcome">
          Chào mừng bạn đến với EduConnect! Vui lòng nhập thông tin của bạn.
        </Text>

        <Form layout="vertical" onFinish={handleSignin} className="signin-form">
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please enter your email!",
              },
            ]}
          >
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="large"
              autoComplete="email"
              placeholder="Enter your email"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size="large"
              autoComplete="current-password"
              placeholder="Enter your password"
            />
          </Form.Item>

          <div className="signin-forgot">
            <Link onClick={() => navigate("/forget-password")}>
              Quên mật khẩu?
            </Link>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              className="signin-btn"
            >
              Đăng nhập
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                // Xử lý đăng nhập thành công ở đây
                // credentialResponse.credential là JWT trả về từ Google
                // Gửi lên backend để xác thực hoặc decode lấy thông tin user
                console.log(credentialResponse);
                // Ví dụ: gọi API backend để xác thực và đăng nhập
              }}
              onError={() => {
                toast.error("Đăng nhập Google thất bại!");
              }}
              width="100%"
              text="signin_with"
              shape="rectangular"
              theme="outline"
              size="large"
            />
          </div>
        </Form>

        <div className="signin-header">
          <Text type="secondary" className="signin-header-text">
            Bạn chưa có tài khoản?
          </Text>
          <Button
            type="link"
            className="signin-signup-btn"
            onClick={() => navigate("/register")}
          >
            Đăng ký
          </Button>
        </div>

        <Divider plain>Hoặc</Divider>

        <div className="signin-home">
          <Link onClick={() => navigate("/homepage")}>← Quay về trang chủ</Link>
        </div>
      </div>
    </div>
  );
};

export default Signin;
