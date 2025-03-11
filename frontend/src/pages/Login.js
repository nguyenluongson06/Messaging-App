import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { login } from "../authService";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      setUser({ name: data.userName, email: data.email });
      localStorage.setItem("token", data.token);
      navigate("/chat");
    } catch (error) {
      console.error("Login failed:", error.response.data);
      alert("Login failed: " + error.response.data.error.errorMessage.join(", "));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Đăng nhập</h2>
        <Form onSubmit={handleLogin}>
          <Form.Group className="form-group">
            <Form.Control
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Control
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button type="submit" variant="primary">Đăng nhập</Button>
        </Form>
        <p>Chưa có tài khoản? <a href="/register">Đăng ký</a></p>
      </div>
    </div>
  );
};

export default Login;