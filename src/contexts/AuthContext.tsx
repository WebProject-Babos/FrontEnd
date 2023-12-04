// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface AuthContextType {
  isLoggedIn: boolean;
  authToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    const storedAuthToken = localStorage.getItem("Authorization");
    const storedRefreshToken = localStorage.getItem("Refresh-Token");
    if (storedAuthToken && storedRefreshToken) {
      setIsLoggedIn(true);
      setAuthToken(storedAuthToken);
      setRefreshToken(storedRefreshToken);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/login`,
        {
          email,
          password,
        }
      );
      console.log("Response Headers:", response.headers);

      if (response.status === 200) {
        const authToken = response.headers["authorization"];
        const refreshToken = response.headers["refresh-token"];
        if (authToken && refreshToken) {
          localStorage.setItem("Authorization", authToken);
          localStorage.setItem("Refresh-Token", refreshToken);
          // alert(authToken);
          setIsLoggedIn(true);
          setAuthToken(authToken);
          setRefreshToken(refreshToken);
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Rethrow the error to be handled in the component
    }
  };

  const logout = async () => {
    if (authToken) {
      try {
        await axios.get(`${process.env.REACT_APP_API_URL}/logout`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        // Clear local storage and state
        localStorage.removeItem("Authorization");
        setIsLoggedIn(false);
        setAuthToken(null);
      } catch (error) {
        console.error("Logout failed:", error);
        throw error; // Rethrow the error to be handled in the component
      }
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
