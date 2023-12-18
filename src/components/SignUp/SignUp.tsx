import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageView from "../PageView/PageView";
import axios from "axios";
import "./SignUp.css";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [emailAvailable, setEmailAvailable] = useState<boolean>(false);
  const [nicknameAvailable, setNicknameAvailable] = useState<boolean>(false);
  const [emailCheckCompleted, setEmailCheckCompleted] = useState(false);
  const [nicknameCheckCompleted, setNicknameCheckCompleted] = useState(false);

  const checkDuplicateEmail = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/members/signup/exists?email=${email}`
      );
      const isAvailable = response.data; // 'false' means email is already taken
      setEmailAvailable(isAvailable);
      if (isAvailable) setEmailCheckCompleted(true);
      alert(isAvailable ? "Email is available." : "Email is already in use.");
    } catch (error) {
      setError("Failed to check email duplication.");
      setEmailAvailable(false); // Assume not available if error occurs
    }
  };

  const checkDuplicateNickname = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/members/signup/exists?nickname=${nickname}`
      );
      const isAvailable = response.data; // 'false' means nickname is already taken
      setNicknameAvailable(isAvailable);
      if (isAvailable) setNicknameCheckCompleted(true);
      alert(
        isAvailable ? "Nickname is available." : "Nickname is already taken."
      );
    } catch (error) {
      setError("Failed to check nickname duplication.");
      setNicknameAvailable(false); // Assume not available if error occurs
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailAvailable || !nicknameAvailable) {
      setError("Email or Nickname is already in use. Please check again.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/members/signup`,
        {
          email,
          nickname,
          password,
        }
      );

      if (response.status === 201) {
        alert("Signup successful!");
        navigate("/");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred during signup.");
      }
    }
  };

  return (
    <PageView>
      <div className="signup-container">
        <h2>Create your Account</h2>
        <form onSubmit={handleSignUp} className="signup-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-group">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={emailCheckCompleted}
              />
              <button type="button" onClick={checkDuplicateEmail} className="check-button">
                Check Email
              </button>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="nickname">Nickname</label>
            <div className="input-group">
              <input
                type="text"
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
                disabled={nicknameCheckCompleted}
              />
              <button type="button" onClick={checkDuplicateNickname} className="check-button">
                Check Nickname
              </button>
            </div>
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
          <button
            type="submit"
            className="signup-button"
            disabled={!emailAvailable || !nicknameAvailable}
          >
            Sign Up
          </button>
        </form>
      </div>
    </PageView>
  );
};

export default SignUp;
