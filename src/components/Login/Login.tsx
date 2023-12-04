// src/components/Login/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth"; // Adjust the import path as necessary
import PageView from "../PageView/PageView";

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
      navigate("/"); // Redirect to home page
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "An error occurred during login");
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <PageView>
      <div>
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p>{error}</p>}
          <button type="submit">Login</button>
        </form>
      </div>
    </PageView>
  );
};

export default Login;
