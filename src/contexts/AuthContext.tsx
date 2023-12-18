import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface AuthContextType {
  isLoggedIn: boolean;
  authToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
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
    setIsLoggedIn(!!storedAuthToken); // Update to true if token exists
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
        { email, password }
      );
  
      if (response.status === 200) {
        const newAuthToken = response.headers['authorization'];
        const newRefreshToken = response.headers['refresh-token'];
  
        if (newAuthToken && newRefreshToken) {
          localStorage.setItem("Authorization", newAuthToken);
          localStorage.setItem("Refresh-Token", newRefreshToken);
          setIsLoggedIn(true);
          setAuthToken(newAuthToken);
          setRefreshToken(newRefreshToken);
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(`Login Error: ${error.response.status} ${error.response.statusText}`);
      } else {
        throw new Error("An unknown error occurred during login.");
      }
    }
  };

  const logout = async () => {
    if (authToken) {
      try {
        await refreshAuthToken();
        await axios.get(`${process.env.REACT_APP_API_URL}/logout`, {
          headers: {
            Authorization: `${authToken}`,
          },
          withCredentials: true
        });

        localStorage.removeItem("Authorization");
        localStorage.removeItem("Refresh-Token");
        setIsLoggedIn(false);
        setAuthToken(null);
        setRefreshToken(null);
      } catch (error) {
        console.error("Logout failed:", error);
        // Handle logout failure
      }
    }
  };

  const refreshAuthToken = async () => {
    try {
      const currentRefreshToken = localStorage.getItem("Refresh-Token");
      if (authToken && currentRefreshToken) {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/refresh`, {
          headers: {
            Authorization: `${authToken}`,
            'Refresh-Token': currentRefreshToken,
          },
        });

        if (response.status === 204) {
          const newAuthToken = response.headers["authorization"];
          if (newAuthToken) {
            localStorage.setItem("Authorization", newAuthToken);
            setAuthToken(newAuthToken);
          }
        }
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, authToken, login, logout, refreshToken: refreshAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
};
