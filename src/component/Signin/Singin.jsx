import React, { useState } from "react";
import { Form, Input, Button, Typography, Divider } from "antd";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { postSignin } from "../../services/apiServices";
import { setUserInfo } from "../../services/handleStorageApi";
import "./Signin.css";
import "antd/dist/reset.css";

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
      const response = await postSignin(email, password);
      if (response.status === 200) {
        toast.success("Sign in successful!");

        // Nếu backend trả về thông tin user, bạn có thể lưu lại, nếu không thì bỏ qua đoạn này
        if (
          response.data.userId &&
          response.data.fullName &&
          response.data.email &&
          response.data.role
        ) {
          setUserInfo({
            userId: response.data.userId,
            fullName: response.data.fullName,
            email: response.data.email,
            role: response.data.role,
          });
        }

        // Navigate based on role
        const role = response.data.role;
        if (role === "Parent") {
          navigate("/homepage");
        } else if (role === "Teacher") {
          navigate("/teacher");
        } else if (role === "Admin") {
          navigate("/dashboard");
        } else {
          navigate("/homepage");
        }
      } else {
        toast.error(response?.message || "Sign in failed!");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Wrong email or password!");
    }
  };

  return (
    <div className="signin-bg">
      <div className="signin-card">
        <Title level={2} className="signin-title">
          EduConnect
        </Title>
        <Text className="signin-welcome">
          Welcome back! Please enter your details.
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
              Forgot password?
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
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <div className="signin-header">
          <Text type="secondary" className="signin-header-text">
            Don't have an account?
          </Text>
          <Button
            type="link"
            className="signin-signup-btn"
            onClick={() => navigate("/register")}
          >
            Sign up
          </Button>
        </div>

        <Divider plain>Or</Divider>

        <div className="signin-home">
          <Link onClick={() => navigate("/homepage")}>← Go To Home Page</Link>
        </div>
      </div>
    </div>
  );
};

export default Signin;
