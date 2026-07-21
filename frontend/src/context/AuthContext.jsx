import { createContext, useState, useEffect } from "react";
import apiClient from "../api/client";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log("Sending:", { email, password });
      const response = await apiClient.auth.login({ email, password });
      console.log(response.data);

      const accessToken = response.data.access_token;

      localStorage.setItem("token", accessToken);
      setToken(accessToken);

      // Return a clean success status to the component
      return { success: true, data: response.data };
    } catch (error) {
      // Extract the error message coming from your FastAPI backend
      const errorMessage = error.response?.data?.detail || "Authentication failed";
      return { success: false, error: errorMessage };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await apiClient.auth.signup(userData);
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || "Registration failed";
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        signup,
        logout,
        isAuthenticated: !!token,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};