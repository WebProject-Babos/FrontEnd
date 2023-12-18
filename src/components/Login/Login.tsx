// src/components/Login/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import PageView from "../PageView/PageView";
import "./Login.css";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      if (err instanceof Error) {
        alert(`Login Failed!: ` + err.message);
        setError(err.message);
      }
    }
  };

  return (
    <PageView>
      <div className="login-container">
        <h2>Login to your Account</h2>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">
            Login
          </button>
          <button
            type="button"
            className="signup-button"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </form>
      </div>
    </PageView>
  );
};

export default Login;
